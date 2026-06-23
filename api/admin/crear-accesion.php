<?php
/**
 * POST /api/admin/crear-accesion.php
 * Crea una nueva accesion
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../includes/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_body();

if (!$data || empty($data['codigo_accesion']) || empty($data['tecnico_id']) || empty($data['propietario_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan campos requeridos: codigo_accesion, tecnico_id, propietario_id']);
    exit;
}

try {
    $stmt = $conn->prepare("
        INSERT INTO accesion (
            codigo_accesion, instcode, collnumb, collcode,
            genus, species, spauthor, subtaxa, subtauthor,
            cropname, accename, acqdate, origcty, collsite,
            provincia, latitude, longitude, elevation,
            colldate, sampstat, ancest, collsrc, storage,
            remarks, variedad, tipo_suelo,
            tecnico_id, propietario_id, donante_id
        ) VALUES (
            :codigo_accesion, :instcode, :collnumb, :collcode,
            :genus, :species, :spauthor, :subtaxa, :subtauthor,
            :cropname, :accename, :acqdate, :origcty, :collsite,
            :provincia, :latitude, :longitude, :elevation,
            :colldate, :sampstat, :ancest, :collsrc, :storage,
            :remarks, :variedad, :tipo_suelo,
            :tecnico_id, :propietario_id, :donante_id
        )
    ");

    $stmt->execute([
        ':codigo_accesion' => $data['codigo_accesion'],
        ':instcode'        => $data['instcode'] ?? null,
        ':collnumb'        => $data['collnumb'] ?? null,
        ':collcode'        => $data['collcode'] ?? null,
        ':genus'           => $data['genus'] ?? null,
        ':species'         => $data['species'] ?? null,
        ':spauthor'        => $data['spauthor'] ?? null,
        ':subtaxa'         => $data['subtaxa'] ?? null,
        ':subtauthor'      => $data['subtauthor'] ?? null,
        ':cropname'        => $data['cropname'] ?? null,
        ':accename'        => $data['accename'] ?? null,
        ':acqdate'         => $data['acqdate'] ?? null,
        ':origcty'         => $data['origcty'] ?? null,
        ':collsite'        => $data['collsite'] ?? null,
        ':provincia'       => $data['provincia'] ?? null,
        ':latitude'        => $data['latitude'] ?? null,
        ':longitude'       => $data['longitude'] ?? null,
        ':elevation'       => $data['elevation'] ?? null,
        ':colldate'        => $data['colldate'] ?? null,
        ':sampstat'        => $data['sampstat'] ?? null,
        ':ancest'          => $data['ancest'] ?? null,
        ':collsrc'         => $data['collsrc'] ?? null,
        ':storage'         => $data['storage'] ?? null,
        ':remarks'         => $data['remarks'] ?? null,
        ':variedad'        => $data['variedad'] ?? null,
        ':tipo_suelo'      => $data['tipo_suelo'] ?? null,
        ':tecnico_id'      => (int)$data['tecnico_id'],
        ':propietario_id'  => (int)$data['propietario_id'],
        ':donante_id'      => isset($data['donante_id']) ? (int)$data['donante_id'] : null,
    ]);

    $id = $conn->lastInsertId();

    echo json_encode(['success' => true, 'id' => $id, 'codigo_accesion' => $data['codigo_accesion']]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error interno del servidor']);
}
