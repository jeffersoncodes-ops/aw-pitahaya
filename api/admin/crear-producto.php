<?php
/**
 * POST /api/admin/crear-producto.php
 * Crea un nuevo producto procesado
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

if (!$data || empty($data['nombre'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta campo requerido: nombre']);
    exit;
}

try {
    $stmt = $conn->prepare("
        INSERT INTO producto_procesado (nombre, tipo, descripcion, proceso_obtencion, ingredientes, fotografia_url)
        VALUES (:nombre, :tipo, :descripcion, :proceso_obtencion, :ingredientes, :fotografia_url)
    ");
    $stmt->execute([
        ':nombre'            => $data['nombre'],
        ':tipo'              => $data['tipo'] ?? null,
        ':descripcion'       => $data['descripcion'] ?? null,
        ':proceso_obtencion' => $data['proceso_obtencion'] ?? null,
        ':ingredientes'      => $data['ingredientes'] ?? null,
        ':fotografia_url'    => $data['fotografia_url'] ?? null,
    ]);

    echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al crear producto: ' . $e->getMessage()]);
}
