<?php
require_once __DIR__ . '/../config.php';
requireMethod(['POST']);
$db = getDB();
try {
    $b = getRequestBody();
    $ip = getClientIp();
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $device = detectDevice($ua);
    $geo = geoLookup($ip);

    $browser = 'Unknown'; $os = 'Unknown';
    if (preg_match('/(Firefox|Chrome|Safari|Edge|Opera|MSIE|Trident)/i', $ua, $m)) $browser = $m[1];
    if (preg_match('/(Windows|Mac OS X|Linux|Android|iPhone|iPad|iOS)/i', $ua, $m)) $os = $m[1];

    $stmt = $db->prepare("INSERT INTO atlasagricole_visitors
        (ip_address, country, region, city, device_type, browser, os, user_agent, page_url, referrer, language, screen_size, session_id)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([
        $ip, $geo['country'], $geo['region'], $geo['city'],
        $device, $browser, $os, $ua,
        $b['page_url'] ?? null, $b['referrer'] ?? null,
        $b['language'] ?? null, $b['screen_size'] ?? null,
        $b['session_id'] ?? null,
    ]);
    jsonResponse(['success' => true, 'id' => $db->lastInsertId()]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
