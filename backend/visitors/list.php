<?php
require_once __DIR__ . '/../config.php';
$db = getDB();
try {
    $limit = min(500, (int)($_GET['limit'] ?? 200));
    $offset = max(0, (int)($_GET['offset'] ?? 0));
    $stmt = $db->prepare("SELECT * FROM atlasagricole_visitors ORDER BY visited_at DESC LIMIT $limit OFFSET $offset");
    $stmt->execute();
    $rows = $stmt->fetchAll();
    $tot = $db->query("SELECT COUNT(*) as c FROM atlasagricole_visitors")->fetch();
    jsonResponse(['success' => true, 'data' => $rows, 'total' => (int)$tot['c']]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
