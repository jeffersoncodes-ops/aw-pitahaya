<?php
/**
 * GET /api/admin/enfermedades.php
 * Lista todas las enfermedades con sus tratamientos (admin)
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("
        SELECT f.id, f.nombre_cientifico, f.nombre_comun, f.tipo,
               f.sintomas, f.condiciones_propagacion
        FROM fitopatogeno f
        ORDER BY f.nombre_cientifico
    ");
    $enfermedades = $stmt->fetchAll();

    // Cargar tratamientos por separado para evitar problemas con jsonb
    $stmtT = $conn->query("SELECT id, fitopatogeno_id, nombre_tratamiento, tipo_tratamiento, descripcion, dosis, frecuencia FROM tratamiento ORDER BY id");
    $tratamientos = $stmtT->fetchAll();

    // Indexar tratamientos por fitopatogeno_id
    $tIndex = [];
    foreach ($tratamientos as $t) {
        $tIndex[$t['fitopatogeno_id']][] = [
            'id'                => $t['id'],
            'nombre_tratamiento' => $t['nombre_tratamiento'],
            'tipo_tratamiento'   => $t['tipo_tratamiento'],
            'descripcion'       => $t['descripcion'],
            'dosis'             => $t['dosis'],
            'frecuencia'        => $t['frecuencia'],
        ];
    }

    foreach ($enfermedades as &$e) {
        $e['tratamientos'] = $tIndex[$e['id']] ?? [];
    }

    echo json_encode($enfermedades);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
