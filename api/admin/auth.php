<?php
/**
 * Middleware de autenticacion para rutas de administracion
 * Include este archivo al inicio de cualquier endpoint protegido
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

require_once __DIR__ . '/../includes/jwt.php';

header('Content-Type: application/json');

$token = jwt_get_token();
if (!$token) {
    jwt_unauthorized();
}

$payload = jwt_verify($token);
if (!$payload) {
    jwt_unauthorized('Token invalido o expirado');
}

// Verificar que sea admin (solo admin puede gestionar)
if ($payload['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Se requiere rol de administrador']);
    exit;
}

// Dejar el payload disponible para los endpoints
define('ADMIN_ID', $payload['sub']);
define('ADMIN_EMAIL', $payload['email']);
define('ADMIN_ROL', $payload['rol']);
