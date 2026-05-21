<?php
/**
 * GET /api/accesion.php?codigo=EI-PIT-26-001
 * Detalle completo de una accesion con evaluaciones
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

$codigo = $_GET['codigo'] ?? '';

if (!$codigo) {
    http_response_code(400);
    echo json_encode(['error' => 'Parametro codigo requerido']);
    exit;
}

try {
    // Datos de la accesion
    $stmt = $conn->prepare("
        SELECT a.*,
               t.nombre           AS tecnico,
               t.correo           AS correo_tecnico,
               p.nombre_productor AS propietario,
               d.institucion      AS donante
        FROM accesion a
        JOIN tecnico t       ON t.id = a.tecnico_id
        JOIN propietario p   ON p.id = a.propietario_id
        LEFT JOIN donante d  ON d.id = a.donante_id
        WHERE a.codigo_accesion = :codigo
    ");
    $stmt->execute(['codigo' => $codigo]);
    $accesion = $stmt->fetch();

    if (!$accesion) {
        http_response_code(404);
        echo json_encode(['error' => 'Accesion no encontrada']);
        exit;
    }

    // Plantas con evaluaciones
    $stmt = $conn->prepare("
        SELECT p.codigo_planta,
               jsonb_build_object(
                   'vegetativa', row_to_json(ev),
                   'floral', row_to_json(ef),
                   'fruto', row_to_json(fru),
                   'sanidad', row_to_json(es)
               ) AS evaluaciones
        FROM planta p
        LEFT JOIN evaluacion_vegetativa ev ON ev.planta_id = p.id
        LEFT JOIN evaluacion_floral ef     ON ef.planta_id = p.id
        LEFT JOIN evaluacion_fruto fru     ON fru.planta_id = p.id
        LEFT JOIN evaluacion_sanidad es    ON es.planta_id = p.id
        WHERE p.accesion_id = :accesion_id
        ORDER BY p.codigo_planta
    ");
    $stmt->execute(['accesion_id' => $accesion['id']]);
    $accesion['plantas'] = $stmt->fetchAll();

    // Detecciones de laboratorio
    $stmt = $conn->prepare("
        SELECT f.nombre_comun AS enfermedad, dl.nivel_incidencia,
               dl.metodo_deteccion, dl.fecha_deteccion, dl.provincia
        FROM deteccion_laboratorio dl
        JOIN fitopatogeno f ON f.id = dl.fitopatogeno_id
        WHERE dl.accesion_id = :accesion_id
        ORDER BY dl.fecha_deteccion DESC
    ");
    $stmt->execute(['accesion_id' => $accesion['id']]);
    $accesion['detecciones'] = $stmt->fetchAll();

    echo json_encode($accesion);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
