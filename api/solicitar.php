<?php
/**
 * POST /api/solicitar.php
 * Crea una solicitud de semillas (formulario publico)
 *
 * Body (JSON):
 * {
 *   "nombre": "Pedro Shiguango",
 *   "email": "pshiguango@gmail.com",
 *   "telefono": "0987654321",
 *   "cedula": "1600123456",
 *   "finca": "Finca San Jose",
 *   "direccion": "Via Ahuano, km 5, Tena",
 *   "items": [
 *     { "accesion_id": 1, "cantidad": 5 }
 *   ]
 * }
 */

require_once __DIR__ . '/includes/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_body();

if (!$data || empty($data['nombre']) || empty($data['email']) || empty($data['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos']);
    exit;
}

try {
    $conn->beginTransaction();

    // ========================================
    // 1. Verificar stock Y descontar (multi-fila)
    // ========================================
    $stockCheckStmt = $conn->prepare("
        SELECT id, cantidad_disponible FROM inventario_almacen
        WHERE accesion_id = :id AND cantidad_disponible > 0
        ORDER BY id ASC
    ");
    $deductStmt = $conn->prepare("
        UPDATE inventario_almacen
        SET cantidad_disponible = cantidad_disponible - :cantidad
        WHERE id = :id
    ");

    foreach ($data['items'] as $item) {
        $stockCheckStmt->execute(['id' => $item['accesion_id']]);
        $rows = $stockCheckStmt->fetchAll();

        // Calcular stock total
        $stockTotal = 0;
        foreach ($rows as $r) {
            $stockTotal += (float) $r['cantidad_disponible'];
        }

        $solicitado = (float) $item['cantidad'];

        if ($solicitado > $stockTotal) {
            $conn->rollBack();
            http_response_code(400);
            echo json_encode([
                'error' => "Stock insuficiente para la accesion ID {$item['accesion_id']}. "
                         . "Disponible: $stockTotal, solicitado: $solicitado",
            ]);
            exit;
        }

        // Descontar de una o varias filas hasta cubrir la cantidad
        $remaining = $solicitado;
        foreach ($rows as $r) {
            if ($remaining <= 0) break;
            $take = min($remaining, (float) $r['cantidad_disponible']);
            $deductStmt->execute(['cantidad' => $take, 'id' => $r['id']]);
            $remaining -= $take;
        }
    }

    // ========================================
    // 2. Insertar solicitud
    // ========================================
    $stmt = $conn->prepare("
        INSERT INTO solicitud (solicitante_nombre, solicitante_email,
                               solicitante_telefono, solicitante_cedula,
                               solicitante_finca, solicitante_direccion)
        VALUES (:nombre, :email, :telefono, :cedula, :finca, :direccion)
    ");
    $stmt->execute([
        'nombre'    => $data['nombre'],
        'email'     => $data['email'],
        'telefono'  => $data['telefono'] ?? null,
        'cedula'    => $data['cedula'] ?? null,
        'finca'     => $data['finca'] ?? null,
        'direccion' => $data['direccion'] ?? null,
    ]);

    $solicitudId = $conn->lastInsertId();

    // ========================================
    // 3. Insertar items (detalle_solicitud)
    // ========================================
    $stmt = $conn->prepare("
        INSERT INTO detalle_solicitud (solicitud_id, accesion_id, cantidad, unidad)
        VALUES (:solicitud_id, :accesion_id, :cantidad, :unidad)
    ");

    $unidadMap = [
        'unidades' => 'unidad',
        'kgs'      => 'kg',
        'lbs'      => 'lb',
        'gramos'   => 'g',
        'onzas'    => 'oz',
        'libras'   => 'lb',
    ];

    foreach ($data['items'] as $item) {
        $rawUnidad = $item['unidad'] ?? 'kg';
        $normalized = $unidadMap[$rawUnidad] ?? $rawUnidad;
        $stmt->execute([
            'solicitud_id' => $solicitudId,
            'accesion_id'  => $item['accesion_id'],
            'cantidad'     => $item['cantidad'],
            'unidad'       => $normalized,
        ]);
    }

    $conn->commit();

    // Obtener numero de seguimiento
    $stmt = $conn->prepare("SELECT numero_seguimiento FROM solicitud WHERE id = :id");
    $stmt->execute(['id' => $solicitudId]);
    $solicitud = $stmt->fetch();

    http_response_code(201);
    echo json_encode([
        'mensaje'            => 'Solicitud creada exitosamente',
        'numero_seguimiento' => $solicitud ? $solicitud['numero_seguimiento'] : null,
        'solicitud_id'       => $solicitudId,
    ]);
} catch (Throwable $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
