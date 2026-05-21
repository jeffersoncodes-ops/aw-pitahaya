<?php
/**
 * GET /api/accesiones.php
 * Lista todas las accesiones con datos basicos
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("
        SELECT a.id,
               a.codigo_accesion,
               a.cropname,
               a.accename,
               a.variedad,
               a.provincia,
               a.genus,
               a.species,
               a.latitude,
               a.longitude,
               a.elevation,
               t.nombre              AS tecnico,
               p.nombre_productor    AS propietario
        FROM accesion a
        JOIN tecnico t       ON t.id = a.tecnico_id
        JOIN propietario p   ON p.id = a.propietario_id
        ORDER BY a.codigo_accesion
    ");

    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
