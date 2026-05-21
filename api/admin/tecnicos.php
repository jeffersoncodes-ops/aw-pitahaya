<?php
/**
 * GET /api/admin/tecnicos.php
 * Lista todos los técnicos para selects del admin
 */
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->query("SELECT id, nombre, correo, cargo FROM tecnico ORDER BY nombre");
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
