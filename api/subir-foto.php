<?php
/**
 * Subir foto a la base de datos
 * POST /api/subir-foto.php
 * multipart/form-data: file, entidad_tipo, entidad_id, descripcion (opcional)
 */

require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/jwt.php';

header('Content-Type: application/json');

$token = jwt_get_token();
if (!$token) {
    jwt_unauthorized();
}
$payload = jwt_verify($token);
if (!$payload) {
    jwt_unauthorized('Token invalido o expirado');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

// Validar archivo
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No se envio ningun archivo o hubo un error']);
    exit;
}

$file = $_FILES['file'];

// Validar tipo de imagen por extension
$allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$normExt = ['jpg' => 'jpg', 'jpeg' => 'jpg', 'png' => 'png', 'webp' => 'webp', 'gif' => 'gif'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExt)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de archivo no permitido. Solo JPG, PNG, WebP, GIF']);
    exit;
}

// Intentar validar MIME con finfo si esta disponible, o confiar en la extension
if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    $allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($mime, $allowedMime)) {
        http_response_code(400);
        echo json_encode(['error' => 'El archivo no parece ser una imagen valida']);
        exit;
    }
}

// Validar tamaño (max 10MB)
$maxSize = 10 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Archivo demasiado grande. Maximo 10MB']);
    exit;
}

// Validar entidad_tipo
$entidad_tipo = $_POST['entidad_tipo'] ?? '';
$valid_types = ['accesion', 'enfermedad', 'producto', 'noticia'];
if (!in_array($entidad_tipo, $valid_types)) {
    http_response_code(400);
    echo json_encode(['error' => 'entidad_tipo invalido. Debe ser: ' . implode(', ', $valid_types)]);
    exit;
}

$entidad_id = intval($_POST['entidad_id'] ?? 0);
if ($entidad_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'entidad_id invalido']);
    exit;
}

$descripcion = $_POST['descripcion'] ?? '';

// Generar nombre unico
$safeExt = $normExt[$ext] ?? 'jpg';
$filename = $entidad_tipo . '-' . $entidad_id . '-' . uniqid() . '.' . $safeExt;
$uploadDir = __DIR__ . '/uploads/';
$destPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar el archivo']);
    exit;
}

$url = 'uploads/' . $filename;

// Insertar en DB
try {
    $stmt = $conn->prepare("INSERT INTO fotografia (entidad_tipo, entidad_id, url, descripcion) VALUES (:tipo, :id, :url, :desc) RETURNING id");
    $stmt->execute([
        ':tipo' => $entidad_tipo,
        ':id'   => $entidad_id,
        ':url'  => $url,
        ':desc' => $descripcion,
    ]);
    $row = $stmt->fetch();

    echo json_encode([
        'mensaje' => 'Foto subida exitosamente',
        'id'      => $row['id'],
        'url'     => $url,
    ]);
} catch (PDOException $e) {
    // Si falla la DB, borramos el archivo subido
    unlink($destPath);
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
