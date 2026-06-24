<?php
/**
 * POST /api/admin/eliminar-solicitud.php
 * Elimina una solicitud y sus detalles asociados
 * Body: { "id": 1 }
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_body();

if (!$data || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos']);
    exit;
}

try {
    $conn->beginTransaction();

    // Restaurar stock antes de eliminar
    $detStmt = $conn->prepare("
        SELECT accesion_id, cantidad FROM detalle_solicitud WHERE solicitud_id = :id
    ");
    $detStmt->execute(['id' => (int)$data['id']]);
    $items = $detStmt->fetchAll();

    $restoreStmt = $conn->prepare("
        UPDATE inventario_almacen
        SET cantidad_disponible = cantidad_disponible + :cantidad
        WHERE id = :id
    ");
    foreach ($items as $item) {
        $rowsStmt = $conn->prepare("
            SELECT id FROM inventario_almacen
            WHERE accesion_id = :aid AND cantidad_disponible > 0
            ORDER BY id ASC LIMIT 1
        ");
        $rowsStmt->execute(['aid' => $item['accesion_id']]);
        $row = $rowsStmt->fetch();
        if ($row) {
            $restoreStmt->execute([
                'cantidad' => $item['cantidad'],
                'id'       => $row['id'],
            ]);
        }
    }

    // Eliminar detalles primero (FK)
    $stmt = $conn->prepare("DELETE FROM detalle_solicitud WHERE solicitud_id = :id");
    $stmt->execute(['id' => (int)$data['id']]);

    // Eliminar solicitud
    $stmt = $conn->prepare("DELETE FROM solicitud WHERE id = :id");
    $stmt->execute(['id' => (int)$data['id']]);

    $conn->commit();
    echo json_encode(['mensaje' => 'Solicitud eliminada correctamente']);
} catch (PDOException $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
