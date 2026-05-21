<?php
/**
 * GET /api/admin/resumen.php - Resumen para panel admin (requiere JWT)
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config.php';

try {
    $solicitudes = $conn->query("
        SELECT s.id, s.numero_seguimiento, s.solicitante_nombre,
               s.solicitante_email, s.estado,
               TO_CHAR(s.fecha_solicitud, 'DD/MM/YYYY') AS fecha,
               COUNT(ds.id) AS items
        FROM solicitud s
        LEFT JOIN detalle_solicitud ds ON ds.solicitud_id = s.id
        WHERE s.estado = 'pendiente'
        GROUP BY s.id
        ORDER BY s.fecha_solicitud DESC
    ")->fetchAll();

    $inventario = $conn->query("
        SELECT i.id, i.accesion_id, i.codigo_ubicacion, i.cantidad_disponible,
               i.unidad,
               a.codigo_accesion, a.cropname, a.variedad
        FROM inventario_almacen i
        JOIN accesion a ON a.id = i.accesion_id
        ORDER BY i.codigo_ubicacion
    ")->fetchAll();

    $totals = $conn->query("
        SELECT
            (SELECT COUNT(*) FROM accesion) AS total_accesiones,
            (SELECT COUNT(*) FROM solicitud) AS total_solicitudes,
            (SELECT COUNT(*) FROM solicitud WHERE estado = 'pendiente') AS pendientes,
            (SELECT COUNT(*) FROM fitopatogeno) AS total_enfermedades
    ")->fetch();

    echo json_encode([
        'solicitudes' => $solicitudes,
        'inventario'  => $inventario,
        'totals'      => $totals,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
