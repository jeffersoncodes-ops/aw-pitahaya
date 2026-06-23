<?php
/**
 * GET /api/noticias.php - Lista de noticias
 */

require_once __DIR__ . '/includes/config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("
        SELECT n.id, n.titulo, n.contenido, n.foto_url,
               TO_CHAR(n.fecha_publicacion, 'DD/MM/YYYY') AS fecha,
               u.nombre AS autor
        FROM noticia n
        JOIN usuario u ON u.id = n.usuario_id
        WHERE n.activo = true
        ORDER BY n.fecha_publicacion DESC
    ");

    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
