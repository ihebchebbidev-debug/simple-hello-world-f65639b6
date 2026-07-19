<?php
/**
 * Atlas Agricole — Contact form endpoint
 * POST JSON: { name, company?, email, phone?, need?, message }
 * Response  : { success: true, id: <int> } or { success: false, error: <string> }
 *
 * Uses the shared config.php (same DB as products/categories/visitors) and writes
 * to atlasagricole_contact_messages. Run backend/migrations.sql to create the table.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

function s($v, int $max): ?string {
    if ($v === null) return null;
    $v = trim((string)$v);
    if ($v === '') return null;
    if (mb_strlen($v) > $max) $v = mb_substr($v, 0, $max);
    return $v;
}

$b = getRequestBody();

$name    = s($b['name']    ?? null, 100);
$company = s($b['company'] ?? null, 150);
$email   = s($b['email']   ?? null, 255);
$phone   = s($b['phone']   ?? null, 40);
$need    = s($b['need']    ?? null, 200);
$message = s($b['message'] ?? null, 2000);

$errors = [];
if (!$name || mb_strlen($name) < 2)                        $errors['name']    = 'Nom requis';
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email']   = 'Email invalide';
if (!$message || mb_strlen($message) < 10)                 $errors['message'] = 'Message trop court';

if ($errors) {
    jsonResponse(['success' => false, 'error' => 'Validation', 'fields' => $errors], 422);
}

try {
    $db = getDB();
    $stmt = $db->prepare(
        'INSERT INTO atlasagricole_contact_messages
         (name, company, email, phone, need, message, ip_address, user_agent)
         VALUES (:name, :company, :email, :phone, :need, :message, :ip, :ua)'
    );
    $stmt->execute([
        ':name'    => $name,
        ':company' => $company,
        ':email'   => $email,
        ':phone'   => $phone,
        ':need'    => $need,
        ':message' => $message,
        ':ip'      => substr(getClientIp(), 0, 45),
        ':ua'      => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
    ]);

    $notify = getenv('NOTIFY_EMAIL') ?: 'atlasagricole@planet.tn';
    if ($notify) {
        @mail(
            $notify,
            "[Site] Nouveau message de $name",
            "Nom : $name\nSociété : " . ($company ?? '-') . "\nEmail : $email\nTéléphone : " . ($phone ?? '-') . "\nBesoin : " . ($need ?? '-') . "\n\n$message\n",
            "From: no-reply@atlasagricole.tn\r\nReply-To: $email\r\nContent-Type: text/plain; charset=utf-8"
        );
    }

    jsonResponse(['success' => true, 'id' => (int)$db->lastInsertId()]);
} catch (Throwable $e) {
    error_log('contact.php: ' . $e->getMessage());
    jsonResponse(['success' => false, 'error' => 'Server error'], 500);
}
