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

    // Validar stock disponible para cada item solicitado
    $stockStmt = $conn->prepare("
        SELECT COALESCE(SUM(cantidad_disponible), 0) AS stock_total
        FROM inventario_almacen
        WHERE accesion_id = :id AND cantidad_disponible > 0
    ");

    foreach ($data['items'] as $item) {
        $stockStmt->execute(['id' => $item['accesion_id']]);
        $stockTotal = (float) $stockStmt->fetchColumn();
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
    }

    // Insertar solicitud
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

    // Insertar items
    $stmt = $conn->prepare("
        INSERT INTO detalle_solicitud (solicitud_id, accesion_id, cantidad, unidad)
        VALUES (:solicitud_id, :accesion_id, :cantidad, :unidad)
    ");

    // Mapa de normalizacion de unidades (plurales -> singulares aceptados por el CHECK)
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

    // Obtener numero de seguimiento generado
    $stmt = $conn->prepare("SELECT numero_seguimiento FROM solicitud WHERE id = :id");
    $stmt->execute(['id' => $solicitudId]);
    $solicitud = $stmt->fetch();

    http_response_code(201);
    echo json_encode([
        'mensaje'            => 'Solicitud creada exitosamente',
        'numero_seguimiento' => $solicitud['numero_seguimiento'],
        'solicitud_id'       => $solicitudId,
    ]);
} catch (Throwable $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
