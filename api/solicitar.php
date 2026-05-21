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

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['nombre']) || empty($data['email']) || empty($data['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos']);
    exit;
}

try {
    $conn->beginTransaction();

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

    foreach ($data['items'] as $item) {
        $stmt->execute([
            'solicitud_id' => $solicitudId,
            'accesion_id'  => $item['accesion_id'],
            'cantidad'     => $item['cantidad'],
            'unidad'       => $item['unidad'] ?? 'kg',
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
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
