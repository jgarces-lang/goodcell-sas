<?php
/*
|--------------------------------------------------------------------------
| /backend/api/admin_categorias.php
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
            SELECT id, nombre, descripcion, imagen, activo, creado_en
            FROM categorias
            ORDER BY id DESC
        ';
        sendJson(['ok' => true, 'data' => $pdo->query($sql)->fetchAll()]);
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        if (empty(trim((string) ($input['nombre'] ?? ''))) || empty(trim((string) ($input['descripcion'] ?? '')))) {
            sendJson(['ok' => false, 'message' => 'Nombre y descripcion son obligatorios.'], 422);
        }

        $stmt = $pdo->prepare('
            INSERT INTO categorias (nombre, descripcion, imagen, activo)
            VALUES (:nombre, :descripcion, :imagen, :activo)
        ');
        $stmt->execute([
            'nombre' => trim((string) $input['nombre']),
            'descripcion' => trim((string) $input['descripcion']),
            'imagen' => trim((string) ($input['imagen'] ?? '')),
            'activo' => isset($input['activo']) ? (int) !!$input['activo'] : 1,
        ]);
        sendJson(['ok' => true, 'message' => 'Categoria creada.', 'id' => (int) $pdo->lastInsertId()], 201);
    }

    if ($method === 'PUT') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) {
            sendJson(['ok' => false, 'message' => 'Parametro id invalido.'], 400);
        }
        $input = getJsonInput();
        if (empty(trim((string) ($input['nombre'] ?? ''))) || empty(trim((string) ($input['descripcion'] ?? '')))) {
            sendJson(['ok' => false, 'message' => 'Nombre y descripcion son obligatorios.'], 422);
        }

        $stmt = $pdo->prepare('
            UPDATE categorias
            SET nombre = :nombre,
                descripcion = :descripcion,
                imagen = :imagen,
                activo = :activo
            WHERE id = :id
        ');
        $stmt->execute([
            'id' => $id,
            'nombre' => trim((string) $input['nombre']),
            'descripcion' => trim((string) $input['descripcion']),
            'imagen' => trim((string) ($input['imagen'] ?? '')),
            'activo' => isset($input['activo']) ? (int) !!$input['activo'] : 1,
        ]);
        sendJson(['ok' => true, 'message' => 'Categoria actualizada.']);
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) {
            sendJson(['ok' => false, 'message' => 'Parametro id invalido.'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM categorias WHERE id = :id');
        $stmt->execute(['id' => $id]);
        sendJson(['ok' => true, 'message' => 'Categoria eliminada.']);
    }

    sendJson(['ok' => false, 'message' => 'Metodo no permitido.'], 405);
} catch (Throwable $error) {
    sendJson(['ok' => false, 'message' => 'Error en operacion de categorias admin.', 'error' => $error->getMessage()], 500);
}
