<?php
/**
 * GET /api/admin/noticias.php
 * Lista todas las noticias (incluyendo inactivas) para el admin
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("
        SELECT n.id, n.titulo, n.contenido, n.foto_url,
               TO_CHAR(n.fecha_publicacion, 'DD/MM/YYYY') AS fecha,
               u.nombre AS autor,
               n.activo
        FROM noticia n
        JOIN usuario u ON u.id = n.usuario_id
        ORDER BY n.fecha_publicacion DESC
    ");
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
