<?php
/**
 * GET /api/admin/listar-inventario.php
 * Lista todo el inventario con datos completos para edicion
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

try {
    $stmt = $conn->query("
        SELECT i.id, i.accesion_id, i.codigo_ubicacion, i.cantidad_disponible,
               i.unidad,
               i.fecha_ingreso,
               TO_CHAR(i.fecha_actualizacion, 'DD/MM/YYYY HH24:MI') AS fecha_actualizacion,
               a.codigo_accesion, a.cropname, a.variedad
        FROM inventario_almacen i
        JOIN accesion a ON a.id = i.accesion_id
        ORDER BY i.codigo_ubicacion
    ");
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
