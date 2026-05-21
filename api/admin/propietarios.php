<?php
/**
 * GET /api/admin/propietarios.php
 * Lista todos los propietarios para selects del admin
 */
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("SELECT id, nombre_productor, cedula, celular, nombre_finca FROM propietario ORDER BY nombre_productor");
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
