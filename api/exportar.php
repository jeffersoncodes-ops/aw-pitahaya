<?php
/**
 * GET /api/exportar.php?tipo=accesiones
 * Exporta datos en formato CSV para investigadores
 *
 * Tipos soportados: accesiones, detecciones, enfermedades, productos
 */

require_once __DIR__ . '/config.php';

$tipo = $_GET['tipo'] ?? '';

function csvOutput(string $filename, array $headers, array $rows): void {
    // Suprimir warnings de PHP que romperian el CSV
    ini_set('display_errors', '0');

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Cache-Control: no-cache, no-store, must-revalidate');

    $output = fopen('php://output', 'w');
    // BOM UTF-8 para que Excel reconozca acentos
    fwrite($output, "\xEF\xBB\xBF");
    fputcsv($output, $headers, separator: ',', enclosure: '"', escape: '\\');

    foreach ($rows as $row) {
        $vals = [];
        foreach ($headers as $h) {
            $val = $row[$h] ?? '';
            // Reemplazar saltos de linea internos para no romper el CSV
            $val = str_replace(["\r\n", "\r", "\n"], ' ', $val);
            $vals[] = $val;
        }
        fputcsv($output, $vals, separator: ',', enclosure: '"', escape: '\\');
    }
    fclose($output);
    exit;
}

try {
    switch ($tipo) {
        case 'accesiones':
            $stmt = $conn->query("
                SELECT a.codigo_accesion, a.cropname, a.accename, a.variedad,
                       a.provincia, a.genus, a.species, a.latitude, a.longitude,
                       a.elevation, a.origcty, a.collsite, a.tipo_suelo,
                       a.acqdate, a.colldate, a.sampstat, a.collsrc, a.storage,
                       a.remarks,
                       t.nombre AS tecnico,
                       t.correo AS correo_tecnico,
                       p.nombre_productor AS propietario,
                       d.institucion AS donante
                FROM accesion a
                JOIN tecnico t       ON t.id = a.tecnico_id
                JOIN propietario p   ON p.id = a.propietario_id
                LEFT JOIN donante d  ON d.id = a.donante_id
                ORDER BY a.codigo_accesion
            ");
            $rows = $stmt->fetchAll();
            $headers = [
                'codigo_accesion', 'cropname', 'accename', 'variedad',
                'provincia', 'genus', 'species', 'latitude', 'longitude',
                'elevation', 'origcty', 'collsite', 'tipo_suelo',
                'acqdate', 'colldate', 'sampstat', 'collsrc', 'storage',
                'remarks', 'tecnico', 'correo_tecnico', 'propietario', 'donante',
            ];
            csvOutput('accesiones.csv', $headers, $rows);
            break;

        case 'detecciones':
            $stmt = $conn->query("
                SELECT a.codigo_accesion, f.nombre_cientifico AS enfermedad_cientifico,
                       f.nombre_comun AS enfermedad_comun, dl.nivel_incidencia,
                       dl.metodo_deteccion, dl.fecha_deteccion, dl.provincia,
                       dl.variedad, dl.observaciones
                FROM deteccion_laboratorio dl
                JOIN accesion a    ON a.id = dl.accesion_id
                JOIN fitopatogeno f ON f.id = dl.fitopatogeno_id
                ORDER BY dl.fecha_deteccion DESC
            ");
            $rows = $stmt->fetchAll();
            $headers = [
                'codigo_accesion', 'enfermedad_cientifico', 'enfermedad_comun',
                'nivel_incidencia', 'metodo_deteccion', 'fecha_deteccion',
                'provincia', 'variedad', 'observaciones',
            ];
            csvOutput('detecciones.csv', $headers, $rows);
            break;

        case 'enfermedades':
            $stmt = $conn->query("
                SELECT f.nombre_cientifico, f.nombre_comun, f.tipo,
                       f.sintomas, f.condiciones_propagacion,
                       COALESCE(
                           (SELECT STRING_AGG(
                               t.nombre_tratamiento || ' (' || t.tipo_tratamiento || ')',
                               '; '
                           ) FROM tratamiento t WHERE t.fitopatogeno_id = f.id),
                           ''
                       ) AS tratamientos
                FROM fitopatogeno f
                ORDER BY f.nombre_comun
            ");
            $rows = $stmt->fetchAll();
            $headers = [
                'nombre_cientifico', 'nombre_comun', 'tipo', 'sintomas',
                'condiciones_propagacion', 'tratamientos',
            ];
            csvOutput('enfermedades.csv', $headers, $rows);
            break;

        case 'productos':
            $stmt = $conn->query("
                SELECT nombre, tipo, descripcion, proceso_obtencion,
                       ingredientes, fotografia_url
                FROM producto_procesado
                ORDER BY nombre
            ");
            $rows = $stmt->fetchAll();
            $headers = [
                'nombre', 'tipo', 'descripcion', 'proceso_obtencion',
                'ingredientes', 'fotografia_url',
            ];
            csvOutput('productos.csv', $headers, $rows);
            break;

        default:
            header('Content-Type: application/json');
            echo json_encode([
                'error' => 'Tipo no valido. Usar: accesiones, detecciones, enfermedades, productos',
                'tipos_disponibles' => ['accesiones', 'detecciones', 'enfermedades', 'productos'],
            ]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
}
