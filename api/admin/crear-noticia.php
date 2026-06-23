<?php
/**
 * POST /api/admin/crear-noticia.php
 * Crea una nueva noticia
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_body();

if (!$data || empty($data['titulo']) || empty($data['contenido'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan campos requeridos: titulo, contenido']);
    exit;
}

try {
    $stmt = $conn->prepare("
        INSERT INTO noticia (usuario_id, titulo, contenido, foto_url)
        VALUES (:usuario_id, :titulo, :contenido, :foto_url)
    ");
    $stmt->execute([
        ':usuario_id' => ADMIN_ID,
        ':titulo'     => $data['titulo'],
        ':contenido'  => $data['contenido'],
        ':foto_url'   => $data['foto_url'] ?? null,
    ]);

    $id = $conn->lastInsertId();
    echo json_encode(['success' => true, 'id' => $id]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
