<?php
/**
 * POST /api/admin/crear-enfermedad.php
 * Crea una nueva enfermedad (fitopatogeno) + tratamientos
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['nombre_cientifico'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta campo requerido: nombre_cientifico']);
    exit;
}

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("
        INSERT INTO fitopatogeno (nombre_cientifico, nombre_comun, tipo, sintomas, condiciones_propagacion)
        VALUES (:nombre_cientifico, :nombre_comun, :tipo, :sintomas, :condiciones_propagacion)
    ");
    $stmt->execute([
        ':nombre_cientifico'     => $data['nombre_cientifico'],
        ':nombre_comun'          => $data['nombre_comun'] ?? null,
        ':tipo'                  => $data['tipo'] ?? null,
        ':sintomas'              => $data['sintomas'] ?? null,
        ':condiciones_propagacion' => $data['condiciones_propagacion'] ?? null,
    ]);

    $id = $conn->lastInsertId();

    // Insertar tratamientos si vienen
    if (!empty($data['tratamientos']) && is_array($data['tratamientos'])) {
        $stmtT = $conn->prepare("
            INSERT INTO tratamiento (fitopatogeno_id, nombre_tratamiento, tipo_tratamiento, descripcion, dosis, frecuencia)
            VALUES (:fitopatogeno_id, :nombre_tratamiento, :tipo_tratamiento, :descripcion, :dosis, :frecuencia)
        ");
        foreach ($data['tratamientos'] as $t) {
            $stmtT->execute([
                ':fitopatogeno_id'     => $id,
                ':nombre_tratamiento'  => $t['nombre_tratamiento'],
                ':tipo_tratamiento'    => $t['tipo_tratamiento'] ?? null,
                ':descripcion'         => $t['descripcion'] ?? null,
                ':dosis'               => $t['dosis'] ?? null,
                ':frecuencia'          => $t['frecuencia'] ?? null,
            ]);
        }
    }

    $conn->commit();
    echo json_encode(['success' => true, 'id' => $id]);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
