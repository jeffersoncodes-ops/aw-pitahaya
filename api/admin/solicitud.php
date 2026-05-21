<?php
/**
 * POST /api/admin/solicitud.php
 * Actualizar estado de una solicitud
 * Body: { "id": 1, "estado": "aprobada", "observaciones": "..." }
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id']) || empty($data['estado'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos']);
    exit;
}

$estadosValidos = ['pendiente', 'aprobada', 'rechazada', 'entregada'];
if (!in_array($data['estado'], $estadosValidos)) {
    http_response_code(400);
    echo json_encode(['error' => 'Estado invalido']);
    exit;
}

try {
    $stmt = $conn->prepare("
        UPDATE solicitud
        SET estado = :estado, admin_id = :admin_id,
            observaciones = COALESCE(:observaciones, observaciones)
        WHERE id = :id
    ");
    $stmt->execute([
        'estado'        => $data['estado'],
        'admin_id'      => ADMIN_ID,
        'observaciones' => $data['observaciones'] ?? null,
        'id'            => $data['id'],
    ]);

    echo json_encode(['mensaje' => 'Solicitud actualizada']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
