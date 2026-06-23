<?php
/**
 * JWT Helper - HMAC-SHA256 con firebase/php-jwt
 */

require_once __DIR__ . '/../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$env = parse_ini_file(__DIR__ . '/../../.env');
if (!$env || empty($env['JWT_SECRET'])) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Error de configuracion: JWT_SECRET no definido']);
    exit;
}
define('JWT_SECRET', $env['JWT_SECRET']);
define('JWT_EXPIRY', 86400); // 24 horas

function jwt_generate(array $payload): string {
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    return JWT::encode($payload, JWT_SECRET, 'HS256');
}

function jwt_verify(string $token): ?array {
    try {
        return (array) JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
    } catch (\Exception $e) {
        return null;
    }
}

function jwt_get_token(): ?string {
    $auth = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if (preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
        return $m[1];
    }
    return null;
}

function jwt_unauthorized(string $msg = 'Token requerido'): void {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(['error' => $msg]);
    exit;
}
