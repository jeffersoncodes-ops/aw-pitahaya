<?php
/**
 * POST /api/admin/actualizar-enfermedad.php
 * Actualiza una enfermedad y sus tratamientos (borra y reinserta)
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_body();

if (!$data || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el id de la enfermedad']);
    exit;
}

try {
    $conn->beginTransaction();
    $id = (int)$data['id'];

    $stmt = $conn->prepare("
        UPDATE fitopatogeno SET
            nombre_cientifico      = :nombre_cientifico,
            nombre_comun           = :nombre_comun,
            tipo                   = :tipo,
            sintomas               = :sintomas,
            condiciones_propagacion = :condiciones_propagacion
        WHERE id = :id
    ");
    $stmt->execute([
        ':nombre_cientifico'       => $data['nombre_cientifico'],
        ':nombre_comun'            => $data['nombre_comun'] ?? null,
        ':tipo'                    => $data['tipo'] ?? null,
        ':sintomas'                => $data['sintomas'] ?? null,
        ':condiciones_propagacion' => $data['condiciones_propagacion'] ?? null,
        ':id'                      => $id,
    ]);

    // Reemplazar tratamientos: borrar existentes e insertar nuevos
    $conn->prepare("DELETE FROM tratamiento WHERE fitopatogeno_id = :id")->execute([':id' => $id]);

    if (!empty($data['tratamientos']) && is_array($data['tratamientos'])) {
        $stmtT = $conn->prepare("
            INSERT INTO tratamiento (fitopatogeno_id, nombre_tratamiento, tipo_tratamiento, descripcion, dosis, frecuencia)
            VALUES (:fitopatogeno_id, :nombre_tratamiento, :tipo_tratamiento, :descripcion, :dosis, :frecuencia)
        ");
        foreach ($data['tratamientos'] as $t) {
            $stmtT->execute([
                ':fitopatogeno_id'    => $id,
                ':nombre_tratamiento' => $t['nombre_tratamiento'],
                ':tipo_tratamiento'   => $t['tipo_tratamiento'] ?? null,
                ':descripcion'        => $t['descripcion'] ?? null,
                ':dosis'              => $t['dosis'] ?? null,
                ':frecuencia'         => $t['frecuencia'] ?? null,
            ]);
        }
    }

    $conn->commit();
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
