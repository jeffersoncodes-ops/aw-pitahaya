<?php
/**
 * JWT Helper - Implementacion HMAC-SHA256 sin librerias externas
 */

define('JWT_SECRET', 'bd_pitahaya_secret_key_2026_cambiar_en_produccion');
define('JWT_EXPIRY', 86400); // 24 horas

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_generate(array $payload): string {
    $header = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $payloadEncoded = base64url_encode(json_encode($payload));
    $signature = base64url_encode(
        hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true)
    );
    return "$header.$payloadEncoded.$signature";
}

function jwt_verify(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $payload, $signature] = $parts;
    $expectedSig = base64url_encode(
        hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)
    );
    if (!hash_equals($expectedSig, $signature)) return null;
    $data = json_decode(base64url_decode($payload), true);
    if (!$data || !isset($data['exp'])) return null;
    if ($data['exp'] < time()) return null;
    return $data;
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
