<?php
/**
 * POST /api/admin/eliminar-inventario.php
 * Elimina un item del inventario
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
    $stmt = $conn->prepare("DELETE FROM inventario_almacen WHERE id = :id");
    $stmt->execute(['id' => (int)$data['id']]);

    echo json_encode(['mensaje' => 'Item de inventario eliminado correctamente']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
