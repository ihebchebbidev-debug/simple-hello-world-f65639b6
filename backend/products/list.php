<?php
require_once __DIR__ . '/../config.php';
$db = getDB();
try {
    $where = ['1=1'];
    $params = [];
    if (!empty($_GET['category']) && $_GET['category'] !== 'Tous') {
        $where[] = 'category = :cat';
        $params[':cat'] = $_GET['category'];
    }
    if (!empty($_GET['search'])) {
        $where[] = '(name LIKE :q OR short_description LIKE :q OR description LIKE :q)';
        $params[':q'] = '%' . $_GET['search'] . '%';
    }
    if (!isset($_GET['include_inactive'])) {
        $where[] = 'is_active = 1';
    }
    $sql = "SELECT * FROM atlasagricole_products WHERE " . implode(' AND ', $where) . " ORDER BY created_at DESC";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$r) {
        $r['images'] = decodeJsonField($r['images'], []);
        $r['usages'] = decodeJsonField($r['usages'], []);
        $r['composition'] = decodeJsonField($r['composition'], []);
        $r['benefits'] = decodeJsonField($r['benefits'], []);
    }
    jsonResponse(['success' => true, 'data' => $rows]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
