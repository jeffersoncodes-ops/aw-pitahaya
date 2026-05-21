<?php
/**
 * POST /api/admin/eliminar-accesion.php
 * Elimina una accesion (solo si no tiene dependencias)
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
    echo json_encode(['error' => 'Falta el id de la accesion']);
    exit;
}

try {
    $id = (int)$data['id'];

    // Verificar que no tenga dependencias
    $checks = [
        'inventario_almacen' => "SELECT COUNT(*) FROM inventario_almacen WHERE accesion_id = $id",
        'planta'             => "SELECT COUNT(*) FROM planta WHERE accesion_id = $id",
        'detalle_solicitud'  => "SELECT COUNT(*) FROM detalle_solicitud WHERE accesion_id = $id",
        'deteccion_laboratorio' => "SELECT COUNT(*) FROM deteccion_laboratorio WHERE accesion_id = $id",
        'fotografia'         => "SELECT COUNT(*) FROM fotografia WHERE entidad_tipo = 'accesion' AND entidad_id = $id",
    ];

    $dependencias = [];
    foreach ($checks as $tabla => $query) {
        $count = $conn->query($query)->fetchColumn();
        if ($count > 0) $dependencias[] = "$tabla ($count registros)";
    }

    if (!empty($dependencias)) {
        http_response_code(409);
        echo json_encode(['error' => 'No se puede eliminar: tiene dependencias en ' . implode(', ', $dependencias)]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM accesion WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
