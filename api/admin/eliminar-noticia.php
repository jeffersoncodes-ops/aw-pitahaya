<?php
/**
 * POST /api/admin/eliminar-noticia.php
 * Elimina (desactiva) una noticia
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
    echo json_encode(['error' => 'Falta el id de la noticia']);
    exit;
}

try {
    // Soft delete: desactivar en lugar de borrar
    $stmt = $conn->prepare("UPDATE noticia SET activo = false WHERE id = :id");
    $stmt->execute([':id' => (int)$data['id']]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
