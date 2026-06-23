<?php
/**
 * POST /api/admin/eliminar-producto.php
 * Elimina un producto procesado y sus fotos asociadas en cascada
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
    echo json_encode(['error' => 'Falta el id del producto']);
    exit;
}

try {
    $id = (int)$data['id'];

    $conn->beginTransaction();

    // Eliminar fotos (archivo fisico + registro)
    $stmt = $conn->prepare("SELECT url FROM fotografia WHERE entidad_tipo = 'producto' AND entidad_id = :id");
    $stmt->execute([':id' => $id]);
    foreach ($stmt as $foto) {
        $filePath = __DIR__ . '/../' . $foto['url'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
    $conn->prepare("DELETE FROM fotografia WHERE entidad_tipo = 'producto' AND entidad_id = :id")->execute([':id' => $id]);

    // Eliminar producto
    $conn->prepare("DELETE FROM producto_procesado WHERE id = :id")->execute([':id' => $id]);

    $conn->commit();

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
