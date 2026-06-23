<?php
/**
 * GET /api/stats.php - Estadisticas publicas (sin auth)
 */

require_once __DIR__ . '/includes/config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("
        SELECT
            (SELECT COUNT(*) FROM accesion) AS total_accesiones,
            (SELECT COUNT(*) FROM fitopatogeno) AS total_enfermedades,
            (SELECT COUNT(*) FROM producto_procesado) AS total_productos,
            (SELECT COUNT(*) FROM noticia WHERE activo = true) AS total_noticias
    ");

    echo json_encode($stmt->fetch());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
