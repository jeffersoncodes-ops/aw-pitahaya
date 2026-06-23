<?php
/**
 * Configuracion de conexion a la base de datos bd_pitahaya
 * PostgreSQL 17
 */

// CORS — permitir cross-origin desde Vercel (o cualquier origen en dev)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Responder inmediatamente a preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function env(string $key, mixed $default = null): mixed {
    // Check .env in same dir as www/ (AlwaysData) first, then project root (local dev)
    $paths = [__DIR__ . '/../.env', __DIR__ . '/../../.env'];
    foreach ($paths as $path) {
        $local = parse_ini_file($path);
        if ($local !== false && isset($local[$key])) return $local[$key];
    }
    if (isset($_ENV[$key])) return $_ENV[$key];
    $val = getenv($key);
    if ($val !== false) return $val;
    return $default;
}

$host    = env('DB_HOST', 'localhost');
$port    = env('DB_PORT', '5432');
$dbname  = env('DB_NAME', 'bd_pitahaya');
$user    = env('DB_USER', 'postgres');
$password = env('DB_PASSWORD', 'sql');
$sslmode = env('DB_SSLMODE', 'prefer');

try {
    $conn = new PDO(
        "pgsql:host=$host;port=$port;dbname=$dbname;sslmode=$sslmode",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Error interno del servidor']);
    exit;
}
