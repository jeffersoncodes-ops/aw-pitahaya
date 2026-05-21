<?php
/**
 * POST /api/admin/actualizar-accesion.php
 * Actualiza una accesion existente
 */
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el id de la accesion']);
    exit;
}

try {
    $stmt = $conn->prepare("
        UPDATE accesion SET
            codigo_accesion = :codigo_accesion,
            instcode        = :instcode,
            collnumb        = :collnumb,
            collcode        = :collcode,
            genus           = :genus,
            species         = :species,
            spauthor        = :spauthor,
            subtaxa         = :subtaxa,
            subtauthor      = :subtauthor,
            cropname        = :cropname,
            accename        = :accename,
            acqdate         = :acqdate,
            origcty         = :origcty,
            collsite        = :collsite,
            provincia       = :provincia,
            latitude        = :latitude,
            longitude       = :longitude,
            elevation       = :elevation,
            colldate        = :colldate,
            sampstat        = :sampstat,
            ancest          = :ancest,
            collsrc         = :collsrc,
            storage         = :storage,
            remarks         = :remarks,
            variedad        = :variedad,
            tipo_suelo      = :tipo_suelo,
            tecnico_id      = :tecnico_id,
            propietario_id  = :propietario_id,
            donante_id      = :donante_id,
            actualizado_en  = CURRENT_TIMESTAMP
        WHERE id = :id
    ");

    $stmt->execute([
        ':id'              => (int)$data['id'],
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
        ':donante_id'      => $data['donante_id'] ? (int)$data['donante_id'] : null,
    ]);

    echo json_encode(['success' => true, 'id' => $data['id']]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
