<?php
/**
 * GET /api/enfermedades.php
 * Lista fitopatogenos con sus tratamientos (para RF1.5)
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("
        SELECT f.id,
               f.nombre_cientifico,
               f.nombre_comun,
               f.tipo,
               f.sintomas,
               jsonb_agg(
                   jsonb_build_object(
                       'nombre', t.nombre_tratamiento,
                       'tipo', t.tipo_tratamiento,
                       'descripcion', t.descripcion,
                       'dosis', t.dosis,
                       'frecuencia', t.frecuencia
                   )
               ) FILTER (WHERE t.id IS NOT NULL) AS tratamientos
        FROM fitopatogeno f
        LEFT JOIN tratamiento t ON t.fitopatogeno_id = f.id
        GROUP BY f.id
        ORDER BY f.nombre_comun
    ");

    $rows = $stmt->fetchAll();
    // jsonb_agg devuelve string JSON, lo decodificamos para que el frontend reciba un array
    foreach ($rows as &$row) {
        if (isset($row['tratamientos']) && is_string($row['tratamientos'])) {
            $row['tratamientos'] = json_decode($row['tratamientos'], true);
        }
    }
    echo json_encode($rows);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
