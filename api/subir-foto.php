<?php
/**
 * Subir foto a la base de datos
 * POST /api/subir-foto.php
 * JSON body: file (base64), ext, entidad_tipo, entidad_id, descripcion
 *
 * NOTA: Usamos JSON en vez de multipart porque AlwaysData (mod_security)
 * bloquea/blinda multipart uploads. JSON ya tiene repair via json_body().
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

// Leer body JSON (con reparacion para AlwaysData)
$data = json_body();
if (!$data || empty($data['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No se envio ningun archivo o hubo un error']);
    exit;
}

$base64 = $data['file'];
$ext    = strtolower($data['ext'] ?? '');

// Validar extension
$allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$normExt    = ['jpg' => 'jpg', 'jpeg' => 'jpg', 'png' => 'png', 'webp' => 'webp', 'gif' => 'gif'];
if (!in_array($ext, $allowedExt)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de archivo no permitido. Solo JPG, PNG, WebP, GIF']);
    exit;
}

// Decodificar base64
$binary = base64_decode($base64, true);
if ($binary === false) {
    http_response_code(400);
    echo json_encode(['error' => 'El archivo esta corrupto o no es una imagen valida']);
    exit;
}

// Validar tamaño (max 10MB)
$maxSize = 10 * 1024 * 1024;
if (strlen($binary) > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Archivo demasiado grande. Maximo 10MB']);
    exit;
}

// Validar entidad_tipo
$entidad_tipo = $data['entidad_tipo'] ?? '';
$valid_types  = ['accesion', 'enfermedad', 'producto', 'noticia'];
if (!in_array($entidad_tipo, $valid_types)) {
    http_response_code(400);
    echo json_encode(['error' => 'entidad_tipo invalido. Debe ser: ' . implode(', ', $valid_types)]);
    exit;
}

$entidad_id = intval($data['entidad_id'] ?? 0);
if ($entidad_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'entidad_id invalido']);
    exit;
}

$descripcion = $data['descripcion'] ?? '';

// Generar nombre unico
$safeExt   = $normExt[$ext] ?? 'jpg';
$filename  = $entidad_tipo . '-' . $entidad_id . '-' . uniqid() . '.' . $safeExt;
$uploadDir = __DIR__ . '/uploads/';

// Crear directorio uploads si no existe
if (!is_dir($uploadDir)) {
    $created = mkdir($uploadDir, 0755, true);
    if (!$created) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear el directorio de uploads']);
        error_log('subir-foto.php: No se pudo crear ' . $uploadDir);
        exit;
    }
}

// Verificar que sea escribible
if (!is_writable($uploadDir)) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
    error_log('subir-foto.php: Directorio no escribible: ' . $uploadDir);
    exit;
}

$destPath = $uploadDir . $filename;

// Escribir archivo directamente
$written = file_put_contents($destPath, $binary);
if ($written === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar el archivo']);
    error_log('subir-foto.php: file_put_contents fallo a ' . $destPath);
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
    error_log('subir-foto.php: DB error: ' . $e->getMessage());
    // Si falla la DB, borramos el archivo subido
    unlink($destPath);
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
