<?php
/**
 * POST /api/registro.php
 * Registro de agricultores
 * Body: { "nombre": "...", "email": "...", "password": "...", "telefono": "...", "cedula": "...", "finca": "...", "direccion": "..." }
 */

require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/jwt.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['nombre']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Nombre, email y password requeridos']);
    exit;
}

try {
    // Verificar email unico
    $stmt = $conn->prepare("SELECT id FROM usuario WHERE email = :email");
    $stmt->execute(['email' => $data['email']]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'El email ya esta registrado']);
        exit;
    }

    $hash = password_hash($data['password'], PASSWORD_BCRYPT);

    $stmt = $conn->prepare("
        INSERT INTO usuario (nombre, email, password_hash, rol, telefono, cedula, finca, direccion)
        VALUES (:nombre, :email, :hash, 'agricultor', :telefono, :cedula, :finca, :direccion)
    ");
    $stmt->execute([
        'nombre'    => $data['nombre'],
        'email'     => $data['email'],
        'hash'      => $hash,
        'telefono'  => $data['telefono'] ?? null,
        'cedula'    => $data['cedula'] ?? null,
        'finca'     => $data['finca'] ?? null,
        'direccion' => $data['direccion'] ?? null,
    ]);

    $userId = $conn->lastInsertId();

    $token = jwt_generate([
        'sub'   => (int)$userId,
        'email' => $data['email'],
        'rol'   => 'agricultor',
    ]);

    http_response_code(201);
    echo json_encode([
        'token' => $token,
        'usuario' => [
            'id'       => (int)$userId,
            'nombre'   => $data['nombre'],
            'email'    => $data['email'],
            'rol'      => 'agricultor',
            'telefono' => $data['telefono'] ?? '',
            'cedula'   => $data['cedula'] ?? '',
            'finca'    => $data['finca'] ?? '',
            'direccion'=> $data['direccion'] ?? '',
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al registrar']);
}
