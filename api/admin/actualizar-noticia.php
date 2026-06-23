<?php
/**
 * POST /api/admin/actualizar-noticia.php
 * Actualiza una noticia existente
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

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
    $stmt = $conn->prepare("
        UPDATE noticia SET
            titulo    = :titulo,
            contenido = :contenido,
            foto_url  = :foto_url
        WHERE id = :id
    ");
    $stmt->execute([
        ':id'        => (int)$data['id'],
        ':titulo'    => $data['titulo'],
        ':contenido' => $data['contenido'],
        ':foto_url'  => $data['foto_url'] ?? null,
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
