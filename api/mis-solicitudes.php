<?php
/**
 * GET /api/mis-solicitudes.php
 * Historial de solicitudes del agricultor autenticado (por email del JWT)
 */

require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/jwt.php';

header('Content-Type: application/json');

$token = jwt_get_token();
if (!$token) {
    jwt_unauthorized();
}

$payload = jwt_verify($token);
if (!$payload) {
    jwt_unauthorized('Token invalido o expirado');
}

$email = $payload['email'];

try {
    $stmt = $conn->prepare("
        SELECT s.id, s.numero_seguimiento, s.estado,
               TO_CHAR(s.fecha_solicitud, 'DD/MM/YYYY HH24:MI') AS fecha,
               s.observaciones,
               jsonb_agg(
                jsonb_build_object(
                    'codigo', a.codigo_accesion,
                    'cropname', a.cropname,
                    'cantidad', ds.cantidad,
                    'unidad', ds.unidad
                )
               ) AS items
        FROM solicitud s
        LEFT JOIN detalle_solicitud ds ON ds.solicitud_id = s.id
        LEFT JOIN accesion a ON a.id = ds.accesion_id
        WHERE s.solicitante_email = :email
        GROUP BY s.id
        ORDER BY s.fecha_solicitud DESC
    ");
    $stmt->execute(['email' => $email]);

    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        if (isset($row['items']) && is_string($row['items'])) {
            $row['items'] = json_decode($row['items'], true);
        }
    }
    echo json_encode($rows);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
