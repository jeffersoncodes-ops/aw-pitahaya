<?php
/**
 * POST /api/login.php
 * Autenticacion de usuarios admin/investigador
 * Body: { "email": "...", "password": "..." }
 * Retorna: { "token": "...", "usuario": { ... } }
 */

require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/jwt.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_body();

if (!$data || empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email y password requeridos']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT id, nombre, email, password_hash, rol, telefono, cedula, finca, direccion
        FROM usuario
        WHERE email = :email AND activo = true
    ");
    $stmt->execute(['email' => $data['email']]);
    $usuario = $stmt->fetch();

    if (!$usuario || !password_verify($data['password'], $usuario['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales invalidas']);
        exit;
    }

    $token = jwt_generate([
        'sub'   => $usuario['id'],
        'email' => $usuario['email'],
        'rol'   => $usuario['rol'],
    ]);

    echo json_encode([
        'token' => $token,
        'usuario' => [
            'id'       => $usuario['id'],
            'nombre'   => $usuario['nombre'],
            'email'    => $usuario['email'],
            'rol'      => $usuario['rol'],
            'telefono' => $usuario['telefono'] ?? '',
            'cedula'   => $usuario['cedula'] ?? '',
            'finca'    => $usuario['finca'] ?? '',
            'direccion'=> $usuario['direccion'] ?? '',
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno']);
}
