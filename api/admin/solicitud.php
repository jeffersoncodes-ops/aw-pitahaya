<?php
/**
 * POST /api/admin/solicitud.php
 * Actualizar estado de una solicitud
 * Body: { "id": 1, "estado": "aprobada", "observaciones": "..." }
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_body();

if (!$data || empty($data['id']) || empty($data['estado'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos']);
    exit;
}

$estadosValidos = ['pendiente', 'aprobada', 'rechazada', 'entregada'];
if (!in_array($data['estado'], $estadosValidos)) {
    http_response_code(400);
    echo json_encode(['error' => 'Estado invalido']);
    exit;
}

try {
    $conn->beginTransaction();

    // Si se aprueba, descontar stock del inventario
    if ($data['estado'] === 'aprobada') {
        // Obtener items de la solicitud
        $detStmt = $conn->prepare("
            SELECT accesion_id, cantidad FROM detalle_solicitud WHERE solicitud_id = :id
        ");
        $detStmt->execute(['id' => $data['id']]);
        $items = $detStmt->fetchAll();

        $updateStmt = $conn->prepare("
            UPDATE inventario_almacen
            SET cantidad_disponible = cantidad_disponible - :cantidad
            WHERE id = (
                SELECT id FROM inventario_almacen
                WHERE accesion_id = :id AND cantidad_disponible >= :cantidad
                LIMIT 1
            )
        ");

        foreach ($items as $item) {
            $updateStmt->execute([
                'cantidad' => $item['cantidad'],
                'id'       => $item['accesion_id'],
            ]);
            if ($updateStmt->rowCount() === 0) {
                $conn->rollBack();
                http_response_code(400);
                echo json_encode([
                    'error' => "Stock insuficiente para la accesion ID {$item['accesion_id']}",
                ]);
                exit;
            }
        }
    }

    // Actualizar estado de la solicitud
    $stmt = $conn->prepare("
        UPDATE solicitud
        SET estado = :estado, admin_id = :admin_id,
            observaciones = COALESCE(:observaciones, observaciones)
        WHERE id = :id
    ");
    $stmt->execute([
        'estado'        => $data['estado'],
        'admin_id'      => ADMIN_ID,
        'observaciones' => $data['observaciones'] ?? null,
        'id'            => $data['id'],
    ]);

    $conn->commit();
    echo json_encode(['mensaje' => 'Solicitud actualizada']);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
