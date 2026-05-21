<?php
/**
 * GET /api/admin/donantes.php
 * Lista todos los donantes para selects del admin
 */
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("SELECT id, institucion, nombre, numero_accesion FROM donante ORDER BY institucion");
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
