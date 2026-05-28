<?php
/*
|--------------------------------------------------------------------------
| GET /backend/api/categorias.php
|--------------------------------------------------------------------------
*/

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/_helpers.php';

requireMethod('GET');

try {
    $pdo = getDatabaseConnection();
    $sql = '
        SELECT id, nombre, descripcion, imagen, activo, creado_en
        FROM categorias
        WHERE activo = 1
        ORDER BY nombre ASC
    ';
    $items = $pdo->query($sql)->fetchAll();
    sendJson(['ok' => true, 'data' => $items]);
} catch (Throwable $error) {
    sendJson(['ok' => false, 'message' => 'No fue posible consultar categorias.', 'error' => $error->getMessage()], 500);
}
