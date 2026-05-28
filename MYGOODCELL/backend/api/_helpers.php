<?php
/*
|--------------------------------------------------------------------------
| Good Cell SAS - Utilidades compartidas para API
|--------------------------------------------------------------------------
*/

declare(strict_types=1);

function sendJson(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonInput(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        sendJson(['ok' => false, 'message' => 'JSON invalido.'], 400);
    }

    return $decoded;
}

function requireMethod(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        sendJson(['ok' => false, 'message' => 'Metodo no permitido.'], 405);
    }
}

function startApiSession(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

function requireAdminSession(): void
{
    startApiSession();
    if (empty($_SESSION['admin_logged_in'])) {
        sendJson(['ok' => false, 'message' => 'No autorizado.'], 401);
    }
}
