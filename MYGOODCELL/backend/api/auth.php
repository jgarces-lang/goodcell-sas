<?php
/*
|--------------------------------------------------------------------------
| POST /backend/api/auth.php
| Login de administrador por email + contrasena
|--------------------------------------------------------------------------
*/

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/_helpers.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    startApiSession();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], (bool) $params['secure'], (bool) $params['httponly']);
    }
    session_destroy();
    sendJson(['ok' => true, 'message' => 'Sesion cerrada.']);
}

requireMethod('POST');

$input = getJsonInput();
$email = trim((string) ($input['email'] ?? ''));
$password = (string) ($input['password'] ?? '');

if ($email === '' || $password === '') {
    sendJson(['ok' => false, 'message' => 'Email y contrasena son obligatorios.'], 422);
}

try {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare('
        SELECT id, nombre, email, contrasena_hash, rol, activo
        FROM usuarios
        WHERE email = :email
        LIMIT 1
    ');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || (int) $user['activo'] !== 1 || strtolower((string) $user['rol']) !== 'admin') {
        sendJson(['ok' => false, 'message' => 'Credenciales invalidas.'], 401);
    }

    $hash = (string) ($user['contrasena_hash'] ?? '');
    $validPassword = false;

    if ($hash !== '') {
        $validPassword = password_verify($password, $hash) || hash_equals($hash, $password);
    }

    if (!$validPassword) {
        sendJson(['ok' => false, 'message' => 'Credenciales invalidas.'], 401);
    }

    startApiSession();
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_user'] = [
        'id' => (int) $user['id'],
        'nombre' => $user['nombre'],
        'email' => $user['email'],
    ];

    sendJson(['ok' => true, 'message' => 'Login exitoso.', 'user' => $_SESSION['admin_user']]);
} catch (Throwable $error) {
    sendJson(['ok' => false, 'message' => 'No fue posible iniciar sesion.', 'error' => $error->getMessage()], 500);
}
