<?php
/**
 * POST /api/admin/eliminar-accesion.php
 * Elimina una accesion y todos sus datos asociados en cascada
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
    echo json_encode(['error' => 'Falta el id de la accesion']);
    exit;
}

try {
    $id = (int)$data['id'];

    $conn->beginTransaction();

    // 1. Eliminar fotos (archivo fisico + registro)
    $stmt = $conn->prepare("SELECT url FROM fotografia WHERE entidad_tipo = 'accesion' AND entidad_id = :id");
    $stmt->execute([':id' => $id]);
    foreach ($stmt as $foto) {
        $filePath = __DIR__ . '/../' . $foto['url'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }
    $conn->prepare("DELETE FROM fotografia WHERE entidad_tipo = 'accesion' AND entidad_id = :id")->execute([':id' => $id]);

    // 2. Eliminar evaluaciones (dependen de planta)
    $conn->prepare("DELETE FROM evaluacion_sanidad      WHERE planta_id IN (SELECT id FROM planta WHERE accesion_id = :id)")->execute([':id' => $id]);
    $conn->prepare("DELETE FROM evaluacion_fruto         WHERE planta_id IN (SELECT id FROM planta WHERE accesion_id = :id)")->execute([':id' => $id]);
    $conn->prepare("DELETE FROM evaluacion_floral        WHERE planta_id IN (SELECT id FROM planta WHERE accesion_id = :id)")->execute([':id' => $id]);
    $conn->prepare("DELETE FROM evaluacion_vegetativa   WHERE planta_id IN (SELECT id FROM planta WHERE accesion_id = :id)")->execute([':id' => $id]);

    // 3. Eliminar plantas
    $conn->prepare("DELETE FROM planta WHERE accesion_id = :id")->execute([':id' => $id]);

    // 4. Eliminar detecciones de laboratorio
    $conn->prepare("DELETE FROM deteccion_laboratorio WHERE accesion_id = :id")->execute([':id' => $id]);

    // 5. Eliminar inventario
    $conn->prepare("DELETE FROM inventario_almacen WHERE accesion_id = :id")->execute([':id' => $id]);

    // 6. Eliminar detalles de solicitud (para no dejar items huerfanos)
    $conn->prepare("DELETE FROM detalle_solicitud WHERE accesion_id = :id")->execute([':id' => $id]);

    // 7. Eliminar la accesion
    $conn->prepare("DELETE FROM accesion WHERE id = :id")->execute([':id' => $id]);

    $conn->commit();

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
