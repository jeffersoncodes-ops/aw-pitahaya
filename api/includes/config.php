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
/**
 * Reconstruir un valor JSON al que AlwaysData le eliminó las comillas dobles,
 * parseando recursivamente objetos/arrays anidados.
 */
function _parse_stripped_value(string $raw): mixed {
    $raw = trim($raw);
    if ($raw === '') return null;

    // Array: [val,val,val] o [{...},{...}]
    if ($raw[0] === '[') {
        $inner = substr($raw, 1, -1);
        $parts = _split_stripped_top_level($inner);
        $arr = [];
        foreach ($parts as $p) {
            $arr[] = _parse_stripped_value($p);
        }
        return $arr;
    }

    // Objeto: {key:val,key:val}
    if ($raw[0] === '{') {
        $inner = substr($raw, 1, -1);
        $pairs = _split_stripped_top_level($inner);
        $obj = [];
        foreach ($pairs as $pair) {
            $pair = trim($pair);
            $colon = strpos($pair, ':');
            if ($colon !== false) {
                $k = trim(substr($pair, 0, $colon));
                $v = trim(substr($pair, $colon + 1));
                $obj[$k] = _parse_stripped_value($v);
            }
        }
        return $obj;
    }

    // Valor plano: intentar como número, booleano, o string
    if (is_numeric($raw)) {
        return str_contains($raw, '.') ? (float)$raw : (int)$raw;
    }
    if ($raw === 'true') return true;
    if ($raw === 'false') return false;
    if ($raw === 'null') return null;
    return $raw;
}

/**
 * Dividir un string por comas en el nivel superior (depth=0),
 * respetando {}[] y strings.
 */
function _split_stripped_top_level(string $raw): array {
    $raw = trim($raw);
    if ($raw === '') return [];

    $parts = [];
    $buffer = '';
    $depth = 0;
    $len = strlen($raw);

    for ($i = 0; $i < $len; $i++) {
        $ch = $raw[$i];
        if ($ch === '{' || $ch === '[') $depth++;
        if ($ch === '}' || $ch === ']') $depth--;
        if ($depth === 0 && $ch === ',') {
            $parts[] = trim($buffer);
            $buffer = '';
        } else {
            $buffer .= $ch;
        }
    }
    if ($buffer !== '') {
        $parts[] = trim($buffer);
    }

    return $parts;
}

/**
 * Reconstruir un JSON al que AlwaysData le eliminó las comillas dobles.
 */
function _repair_stripped_json(string $raw): ?array {
    $raw = trim($raw);
    if ($raw === '') return null;

    // Quitar {} envolventes si existen
    if ($raw[0] === '{') {
        $raw = substr($raw, 1, -1);
    }
    $raw = trim($raw);

    $result = [];
    $len = strlen($raw);
    $i = 0;
    $currentKey = null;
    $buffer = '';
    $depth = 0;

    while ($i < $len) {
        $ch = $raw[$i];

        if ($ch === '{' || $ch === '[') $depth++;
        if ($ch === '}' || $ch === ']') $depth--;

        if ($depth === 0) {
            if ($ch === ':') {
                $currentKey = trim($buffer);
                $buffer = '';
                $i++;
                continue;
            }
            if ($ch === ',') {
                if ($currentKey !== null) {
                    $result[$currentKey] = _parse_stripped_value(trim($buffer));
                    $currentKey = null;
                    $buffer = '';
                }
                $i++;
                continue;
            }
        }

        $buffer .= $ch;
        $i++;
    }

    // Último par
    if ($currentKey !== null) {
        $result[$currentKey] = _parse_stripped_value(trim($buffer));
    }

    return !empty($result) ? $result : null;
}

function json_body(): ?array {
    $raw = trim(file_get_contents('php://input') ?: '');

    // 1. Intentar JSON estándar
    if ($raw) {
        $data = json_decode($raw, true);
        if (is_array($data)) return $data;

        // 2. Reparar JSON dañado por AlwaysData (quita comillas dobles)
        $data = _repair_stripped_json($raw);
        if ($data !== null) return $data;
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
