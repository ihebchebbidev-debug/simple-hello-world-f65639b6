<?php
/**
 * Atlas Agricole — Contact form endpoint
 * POST JSON: { name, company?, email, phone?, need?, message }
 * Response  : { ok: true, id: <int> } or { ok: false, error: <string> }
 *
 * Deploy: upload this file to your PHP host (e.g. /public_html/backend/contact.php).
 * Then set VITE_CONTACT_API_URL in your Lovable env to its public URL, e.g.
 *   VITE_CONTACT_API_URL=https://atlasagricole.tn/backend/contact.php
 */

declare(strict_types=1);

// ============ CORS ============
// Restrict this to your production domain(s) in real deployment.
$allowedOrigins = [
    'http://localhost:8080',
    'https://atlasagricole.tn',
    'https://www.atlasagricole.tn',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ============ DB CONFIG ============
$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_NAME = getenv('DB_NAME') ?: 'atlas_agricole';
$DB_USER = getenv('DB_USER') ?: 'atlas_user';
$DB_PASS = getenv('DB_PASS') ?: 'change-me';

// ============ INPUT ============
$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '[]', true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

function s(?string $v, int $max): ?string {
    if ($v === null) return null;
    $v = trim($v);
    if ($v === '') return null;
    if (mb_strlen($v) > $max) $v = mb_substr($v, 0, $max);
    return $v;
}

$name    = s($data['name']    ?? null, 100);
$company = s($data['company'] ?? null, 150);
$email   = s($data['email']   ?? null, 255);
$phone   = s($data['phone']   ?? null, 40);
$need    = s($data['need']    ?? null, 200);
$message = s($data['message'] ?? null, 2000);

$errors = [];
if (!$name || mb_strlen($name) < 2)          $errors['name']    = 'Nom requis';
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email invalide';
if (!$message || mb_strlen($message) < 10)   $errors['message'] = 'Message trop court';

if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Validation', 'fields' => $errors]);
    exit;
}

// ============ INSERT ============
try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER, $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $stmt = $pdo->prepare(
        'INSERT INTO contact_messages (name, company, email, phone, need, message, ip_address, user_agent)
         VALUES (:name, :company, :email, :phone, :need, :message, :ip, :ua)'
    );
    $stmt->execute([
        ':name'    => $name,
        ':company' => $company,
        ':email'   => $email,
        ':phone'   => $phone,
        ':need'    => $need,
        ':message' => $message,
        ':ip'      => substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45),
        ':ua'      => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
    ]);

    // Optional: notify by email
    $notify = getenv('NOTIFY_EMAIL') ?: 'atlasagricole@planet.tn';
    if ($notify) {
        @mail(
            $notify,
            "[Site] Nouveau message de $name",
            "Nom : $name\nSociété : " . ($company ?? '-') . "\nEmail : $email\nTéléphone : " . ($phone ?? '-') . "\nBesoin : " . ($need ?? '-') . "\n\n$message\n",
            "From: no-reply@atlasagricole.tn\r\nReply-To: $email\r\nContent-Type: text/plain; charset=utf-8"
        );
    }

    echo json_encode(['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
} catch (Throwable $e) {
    error_log('contact.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server error']);
}
