<?php
/**
 * GET /api/admin/solicitudes.php - Todas las solicitudes (requiere JWT)
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config.php';

try {
    $stmt = $conn->query("
        SELECT s.id, s.numero_seguimiento, s.solicitante_nombre,
               s.solicitante_email, s.solicitante_telefono, s.solicitante_cedula,
               s.solicitante_finca, s.estado,
               TO_CHAR(s.fecha_solicitud, 'DD/MM/YYYY HH24:MI') AS fecha,
               u.nombre AS atendido_por, s.observaciones,
               jsonb_agg(
                jsonb_build_object(
                    'codigo', a.codigo_accesion,
                    'cropname', a.cropname,
                    'cantidad', ds.cantidad,
                    'unidad', ds.unidad
                )
               ) AS items
        FROM solicitud s
        LEFT JOIN usuario u ON u.id = s.admin_id
        LEFT JOIN detalle_solicitud ds ON ds.solicitud_id = s.id
        LEFT JOIN accesion a ON a.id = ds.accesion_id
        GROUP BY s.id, u.nombre
        ORDER BY s.fecha_solicitud DESC
    ");

    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        if (isset($row['items']) && is_string($row['items'])) {
            $row['items'] = json_decode($row['items'], true);
        }
    }
    echo json_encode($rows);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
