<?php
/**
 * GET /api/productos.php
 * Lista todos los productos procesados con datos basicos
 */

require_once __DIR__ . '/includes/config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("SELECT id, nombre, tipo, descripcion, proceso_obtencion, ingredientes, fotografia_url FROM producto_procesado ORDER BY nombre");
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
