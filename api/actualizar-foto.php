<?php
/**
 * Actualizar descripción de una foto
 * POST /api/actualizar-foto.php
 * Body: { id: number, descripcion: string }
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$input = json_body();
if (!$input || !isset($input['id']) || !isset($input['descripcion'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos: id y descripcion']);
    exit;
}

$id = intval($input['id']);
$descripcion = $input['descripcion'];

try {
    $stmt = $conn->prepare("UPDATE fotografia SET descripcion = :desc WHERE id = :id");
    $stmt->execute([':desc' => $descripcion, ':id' => $id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Foto no encontrada']);
        exit;
    }

    echo json_encode(['mensaje' => 'Descripcion actualizada']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
