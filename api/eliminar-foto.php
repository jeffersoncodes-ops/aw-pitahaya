<?php
/**
 * Eliminar una foto (archivo + registro DB)
 * POST /api/eliminar-foto.php
 * Body: { id: number }
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
if (!$input || !isset($input['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el id de la foto']);
    exit;
}

$id = intval($input['id']);

try {
    // Obtener la URL antes de borrar
    $stmt = $conn->prepare("SELECT url FROM fotografia WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $foto = $stmt->fetch();

    if (!$foto) {
        http_response_code(404);
        echo json_encode(['error' => 'Foto no encontrada']);
        exit;
    }

    // Borrar el archivo fisico
    $filePath = __DIR__ . '/' . $foto['url'];
    if (file_exists($filePath)) {
        unlink($filePath);
    }

    // Borrar el registro
    $stmt = $conn->prepare("DELETE FROM fotografia WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['mensaje' => 'Foto eliminada']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
