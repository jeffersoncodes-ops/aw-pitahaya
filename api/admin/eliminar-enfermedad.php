<?php
/**
 * POST /api/admin/eliminar-enfermedad.php
 * Elimina una enfermedad y sus tratamientos en cascada
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
    echo json_encode(['error' => 'Falta el id de la enfermedad']);
    exit;
}

try {
    $id = (int)$data['id'];

    // Verificar dependencias
    $checks = [
        'deteccion_laboratorio' => "SELECT COUNT(*) FROM deteccion_laboratorio WHERE fitopatogeno_id = $id",
    ];
    $deps = [];
    foreach ($checks as $tabla => $q) {
        $c = $conn->query($q)->fetchColumn();
        if ($c > 0) $deps[] = "$tabla ($c registros)";
    }
    if (!empty($deps)) {
        http_response_code(409);
        echo json_encode(['error' => 'No se puede eliminar: tiene dependencias en ' . implode(', ', $deps)]);
        exit;
    }

    $conn->beginTransaction();
    $conn->prepare("DELETE FROM tratamiento WHERE fitopatogeno_id = :id")->execute([':id' => $id]);
    $conn->prepare("DELETE FROM fitopatogeno WHERE id = :id")->execute([':id' => $id]);
    $conn->commit();

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
