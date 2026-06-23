<?php
/**
 * GET /api/buscar.php?q=roja
 * Busqueda de texto completo en accesiones (RF4.2)
 */

require_once __DIR__ . '/includes/config.php';

header('Content-Type: application/json');

$q = trim($_GET['q'] ?? '');

if (!$q) {
    http_response_code(400);
    echo json_encode(['error' => 'Parametro q requerido']);
    exit;
}

try {
    // Construir tsquery: cada palabra termina en :* para prefijo
    $terminos = array_filter(explode(' ', $q));
    $partes = array_map(function ($t) {
        return trim($t) . ':*';
    }, $terminos);
    $tsquery = implode(' & ', $partes);

    $stmt = $conn->prepare("
        SELECT codigo_accesion, accename, cropname, provincia, variedad,
               ts_rank(to_tsvector('spanish',
                   COALESCE(codigo_accesion, '') || ' ' ||
                   COALESCE(accename, '') || ' ' ||
                   COALESCE(cropname, '') || ' ' ||
                   COALESCE(provincia, '') || ' ' ||
                   COALESCE(variedad, '')
               ), to_tsquery('spanish', :tsquery)) AS relevancia
        FROM accesion
        WHERE to_tsvector('spanish',
            COALESCE(codigo_accesion, '') || ' ' ||
            COALESCE(accename, '') || ' ' ||
            COALESCE(cropname, '') || ' ' ||
            COALESCE(provincia, '') || ' ' ||
            COALESCE(variedad, '')
        ) @@ to_tsquery('spanish', :tsquery)
        ORDER BY relevancia DESC
        LIMIT 20
    ");
    $stmt->execute(['tsquery' => $tsquery]);

    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
