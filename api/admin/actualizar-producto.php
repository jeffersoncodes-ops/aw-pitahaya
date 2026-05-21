<?php
/**
 * POST /api/admin/actualizar-producto.php
 * Actualiza un producto procesado
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el id del producto']);
    exit;
}

try {
    $stmt = $conn->prepare("
        UPDATE producto_procesado SET
            nombre             = :nombre,
            tipo               = :tipo,
            descripcion        = :descripcion,
            proceso_obtencion  = :proceso_obtencion,
            ingredientes       = :ingredientes,
            fotografia_url     = :fotografia_url
        WHERE id = :id
    ");
    $stmt->execute([
        ':id'                => (int)$data['id'],
        ':nombre'            => $data['nombre'],
        ':tipo'              => $data['tipo'] ?? null,
        ':descripcion'       => $data['descripcion'] ?? null,
        ':proceso_obtencion' => $data['proceso_obtencion'] ?? null,
        ':ingredientes'      => $data['ingredientes'] ?? null,
        ':fotografia_url'    => $data['fotografia_url'] ?? null,
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
