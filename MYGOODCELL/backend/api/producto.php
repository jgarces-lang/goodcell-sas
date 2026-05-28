<?php
/*
|--------------------------------------------------------------------------
| GET /backend/api/producto.php?id={id}
|--------------------------------------------------------------------------
*/

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/_helpers.php';

requireMethod('GET');

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id <= 0) {
    sendJson(['ok' => false, 'message' => 'Parametro id invalido.'], 400);
}

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
        WHERE p.id = :id AND p.activo = 1 AND c.activo = 1
        LIMIT 1
    ';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $id]);
    $item = $stmt->fetch();

    if (!$item) {
        sendJson(['ok' => false, 'message' => 'Producto no encontrado.'], 404);
    }

    sendJson(['ok' => true, 'data' => $item]);
} catch (Throwable $error) {
    sendJson(['ok' => false, 'message' => 'No fue posible consultar el producto.', 'error' => $error->getMessage()], 500);
}
