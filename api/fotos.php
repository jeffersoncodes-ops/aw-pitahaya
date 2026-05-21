<?php
/**
 * Obtener fotos por entidad
 * GET /api/fotos.php?tipo=accesion&id=5
 * GET /api/fotos.php?tipo=accesion  (todas las de ese tipo)
 * GET /api/fotos.php (todas las fotos con nombre de entidad)
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

try {
    $tipo = $_GET['tipo'] ?? null;
    $id   = isset($_GET['id']) ? intval($_GET['id']) : null;

    if ($tipo && $id) {
        $stmt = $conn->prepare("SELECT id, entidad_tipo, entidad_id, url, descripcion, es_principal, creado_en FROM fotografia WHERE entidad_tipo = :tipo AND entidad_id = :id ORDER BY es_principal DESC, creado_en DESC");
        $stmt->execute([':tipo' => $tipo, ':id' => $id]);
    } elseif ($tipo) {
        $stmt = $conn->prepare("SELECT f.id, f.entidad_tipo, f.entidad_id, f.url, f.descripcion, f.es_principal, f.creado_en FROM fotografia f WHERE f.entidad_tipo = :tipo ORDER BY f.creado_en DESC");
        $stmt->execute([':tipo' => $tipo]);
    } else {
        $stmt = $conn->query("SELECT f.id, f.entidad_tipo, f.entidad_id, f.url, f.descripcion, f.es_principal, f.creado_en FROM fotografia f ORDER BY f.creado_en DESC");
    }

    $fotos = $stmt->fetchAll();
    echo json_encode($fotos);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
