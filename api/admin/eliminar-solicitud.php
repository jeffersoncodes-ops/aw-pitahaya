<?php
/**
 * POST /api/admin/eliminar-solicitud.php
 * Elimina una solicitud y sus detalles asociados
 * Body: { "id": 1 }
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos']);
    exit;
}

try {
    $conn->beginTransaction();

    // Eliminar detalles primero (FK)
    $stmt = $conn->prepare("DELETE FROM detalle_solicitud WHERE solicitud_id = :id");
    $stmt->execute(['id' => (int)$data['id']]);

    // Eliminar solicitud
    $stmt = $conn->prepare("DELETE FROM solicitud WHERE id = :id");
    $stmt->execute(['id' => (int)$data['id']]);

    $conn->commit();
    echo json_encode(['mensaje' => 'Solicitud eliminada correctamente']);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
