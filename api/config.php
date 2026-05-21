<?php
/**
 * Configuracion de conexion a la base de datos bd_pitahaya
 * PostgreSQL 17
 */

$host = 'localhost';
$port = '5432';
$dbname = 'bd_pitahaya';
$user = 'postgres';
$password = 'sql';

try {
    $conn = new PDO(
        "pgsql:host=$host;port=$port;dbname=$dbname",
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
    echo json_encode(['error' => 'Error de conexion: ' . $e->getMessage()]);
    exit;
}
