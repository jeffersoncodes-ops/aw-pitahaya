<?php
/**
 * POST /api/admin/eliminar-producto.php
 * Elimina un producto procesado
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el id del producto']);
    exit;
}

try {
    $id = (int)$data['id'];

    // Verificar dependencias (fotos)
    $count = $conn->prepare("SELECT COUNT(*) FROM fotografia WHERE entidad_tipo = 'producto' AND entidad_id = :id");
    $count->execute([':id' => $id]);
    if ($count->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'No se puede eliminar: tiene fotos asociadas. Elimine primero las fotos.']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM producto_procesado WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
