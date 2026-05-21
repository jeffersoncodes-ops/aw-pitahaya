<?php
/**
 * POST /api/admin/crear-inventario.php
 * Crea un nuevo item en el inventario
 * Body: { "codigo_ubicacion": "A-01", "cantidad_disponible": 50, "unidad": "libras", "accesion_id": 1 }
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['codigo_ubicacion']) || empty($data['accesion_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos: codigo_ubicacion y accesion_id requeridos']);
    exit;
}

try {
    $stmt = $conn->prepare("
        INSERT INTO inventario_almacen (codigo_ubicacion, cantidad_disponible, unidad, accesion_id, fecha_ingreso, fecha_actualizacion)
        VALUES (:codigo_ubicacion, :cantidad_disponible, :unidad, :accesion_id, CURRENT_DATE, NOW())
    ");
    $stmt->execute([
        'codigo_ubicacion'    => $data['codigo_ubicacion'],
        'cantidad_disponible' => (int)($data['cantidad_disponible'] ?? 0),
        'unidad'              => $data['unidad'] ?? 'libras',
        'accesion_id'         => (int)$data['accesion_id'],
    ]);

    echo json_encode(['mensaje' => 'Item de inventario creado correctamente', 'id' => (int)$conn->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
