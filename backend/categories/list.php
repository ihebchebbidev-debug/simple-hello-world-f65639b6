<?php
require_once __DIR__ . '/../config.php';
$db = getDB();
try {
    $rows = $db->query("SELECT * FROM atlasagricole_categories ORDER BY sort_order ASC, name ASC")->fetchAll();
    jsonResponse(['success' => true, 'data' => $rows]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
