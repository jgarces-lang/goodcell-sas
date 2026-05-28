<?php
/*
|--------------------------------------------------------------------------
| GET /backend/api/productos.php
| Retorna productos activos con su categoria activa
|--------------------------------------------------------------------------
*/

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/_helpers.php';

requireMethod('GET');

try {
    $pdo = getDatabaseConnection();
    $sql = '
        SELECT
            p.id,
            p.categoria_id,
            p.nombre,
            p.descripcion,
            p.precio,
            p.imagen,
            p.marca,
            p.stock,
            p.activo,
            c.nombre AS categoria_nombre
        FROM productos p
        INNER JOIN categorias c ON c.id = p.categoria_id
        WHERE p.activo = 1 AND c.activo = 1
        ORDER BY p.creado_en DESC, p.id DESC
    ';
    $items = $pdo->query($sql)->fetchAll();
    sendJson(['ok' => true, 'data' => $items]);
} catch (Throwable $error) {
    sendJson(['ok' => false, 'message' => 'No fue posible consultar productos.', 'error' => $error->getMessage()], 500);
}
