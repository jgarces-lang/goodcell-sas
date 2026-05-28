<?php
/*
|--------------------------------------------------------------------------
| /backend/api/admin_productos.php
| GET, POST, PUT, DELETE (protegido por sesion de admin)
|--------------------------------------------------------------------------
*/

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/_helpers.php';

requireAdminSession();

try {
    $pdo = getDatabaseConnection();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
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
            LEFT JOIN categorias c ON c.id = p.categoria_id
            ORDER BY p.id DESC
        ';
        sendJson(['ok' => true, 'data' => $pdo->query($sql)->fetchAll()]);
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        $required = ['categoria_id', 'nombre', 'descripcion', 'precio', 'marca', 'stock'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
                sendJson(['ok' => false, 'message' => "Campo obligatorio: {$field}"], 422);
            }
        }

        $stmt = $pdo->prepare('
            INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen, marca, stock, activo)
            VALUES (:categoria_id, :nombre, :descripcion, :precio, :imagen, :marca, :stock, :activo)
        ');
        $stmt->execute([
            'categoria_id' => (int) $input['categoria_id'],
            'nombre' => trim((string) $input['nombre']),
            'descripcion' => trim((string) $input['descripcion']),
            'precio' => (float) $input['precio'],
            'imagen' => trim((string) ($input['imagen'] ?? '')),
            'marca' => trim((string) $input['marca']),
            'stock' => (int) $input['stock'],
            'activo' => isset($input['activo']) ? (int) !!$input['activo'] : 1,
        ]);
        sendJson(['ok' => true, 'message' => 'Producto creado.', 'id' => (int) $pdo->lastInsertId()], 201);
    }

    if ($method === 'PUT') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) {
            sendJson(['ok' => false, 'message' => 'Parametro id invalido.'], 400);
        }
        $input = getJsonInput();
        $required = ['categoria_id', 'nombre', 'descripcion', 'precio', 'marca', 'stock'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || trim((string) $input[$field]) === '') {
                sendJson(['ok' => false, 'message' => "Campo obligatorio: {$field}"], 422);
            }
        }

        $stmt = $pdo->prepare('
            UPDATE productos
            SET categoria_id = :categoria_id,
                nombre = :nombre,
                descripcion = :descripcion,
                precio = :precio,
                imagen = :imagen,
                marca = :marca,
                stock = :stock,
                activo = :activo
            WHERE id = :id
        ');
        $stmt->execute([
            'id' => $id,
            'categoria_id' => (int) $input['categoria_id'],
            'nombre' => trim((string) $input['nombre']),
            'descripcion' => trim((string) $input['descripcion']),
            'precio' => (float) $input['precio'],
            'imagen' => trim((string) ($input['imagen'] ?? '')),
            'marca' => trim((string) $input['marca']),
            'stock' => (int) $input['stock'],
            'activo' => isset($input['activo']) ? (int) !!$input['activo'] : 1,
        ]);
        sendJson(['ok' => true, 'message' => 'Producto actualizado.']);
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) {
            sendJson(['ok' => false, 'message' => 'Parametro id invalido.'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM productos WHERE id = :id');
        $stmt->execute(['id' => $id]);
        sendJson(['ok' => true, 'message' => 'Producto eliminado.']);
    }

    sendJson(['ok' => false, 'message' => 'Metodo no permitido.'], 405);
} catch (Throwable $error) {
    sendJson(['ok' => false, 'message' => 'Error en operacion de productos admin.', 'error' => $error->getMessage()], 500);
}
