<?php
/**
 * GET /api/inventario-disponible.php
 * Endpoint público — lista items de inventario con stock disponible
 * Sin autenticación, solo lectura.
 */

require_once __DIR__ . '/includes/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

try {
    $stmt = $conn->query("
        SELECT i.id, i.codigo_ubicacion, i.cantidad_disponible,
               i.unidad, i.accesion_id,
               a.codigo_accesion, a.variedad AS nombre_variedad
        FROM inventario_almacen i
        JOIN accesion a ON a.id = i.accesion_id
        WHERE i.cantidad_disponible > 0
        ORDER BY a.variedad, i.codigo_ubicacion
    ");
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
