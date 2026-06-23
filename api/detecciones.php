<?php
/**
 * GET /api/detecciones.php - Lista todas las detecciones de laboratorio
 */

require_once __DIR__ . '/includes/config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("
        SELECT dl.id, a.codigo_accesion, f.nombre_comun AS enfermedad,
               dl.nivel_incidencia, dl.metodo_deteccion, dl.fecha_deteccion,
               dl.provincia, dl.variedad, dl.observaciones
        FROM deteccion_laboratorio dl
        JOIN accesion a ON a.id = dl.accesion_id
        JOIN fitopatogeno f ON f.id = dl.fitopatogeno_id
        ORDER BY dl.fecha_deteccion DESC
    ");

    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
