<?php
/**
 * POST /api/admin/actualizar-inventario.php
 * Actualiza un item del inventario
 * Body: { "id": 1, "codigo_ubicacion": "A-01", "cantidad_disponible": 50, "accesion_id": 1 }
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos']);
    exit;
}

try {
    $stmt = $conn->prepare("
        UPDATE inventario_almacen
        SET codigo_ubicacion = :codigo_ubicacion,
            cantidad_disponible = :cantidad_disponible,
            unidad = :unidad,
            accesion_id = :accesion_id,
            fecha_actualizacion = NOW()
        WHERE id = :id
    ");
    $stmt->execute([
        'codigo_ubicacion'    => $data['codigo_ubicacion'],
        'cantidad_disponible' => (int)$data['cantidad_disponible'],
        'unidad'              => $data['unidad'] ?? 'libras',
        'accesion_id'         => (int)$data['accesion_id'],
        'id'                  => (int)$data['id'],
    ]);

    echo json_encode(['mensaje' => 'Inventario actualizado correctamente']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
