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

/**
 * Obtener el body de la request como array asociativo.
 * 
 * AlwaysData elimina comillas dobles de JSON en POST (mod_security),
 * por lo que esta función intenta reparar el JSON dañado.
 */
function json_body(): ?array {
    $raw = trim(file_get_contents('php://input') ?: '');

    // 1. Intentar JSON estándar
    if ($raw) {
        $data = json_decode($raw, true);
        if (is_array($data)) return $data;

        // 2. Reparar JSON dañado por AlwaysData: {key:val,key2:val2}
        //    AlwaysData elimina comillas dobles de JSON.
        //    Esta regex parsea correctamente incluso si los valores contienen comas.
        $inner = trim($raw, "{}\t\n\r\0\x0B ");
        if ($inner !== '') {
            $result = [];
            // key:value donde value puede tener comas internas (no seguidas de key:)
            preg_match_all(
                '/(\w[\w\d_-]*)\s*:\s*([^,]*+(?:,(?!\s*\w[\w\d_-]*\s*:)[^,]*)*+)/',
                $inner,
                $matches,
                PREG_SET_ORDER
            );
            foreach ($matches as $m) {
                $result[trim($m[1])] = trim($m[2]);
            }
            if (!empty($result)) return $result;
        }
    }

    // 3. Fallback a form-urlencoded
    return $_POST ?: null;
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
