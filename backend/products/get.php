<?php
require_once __DIR__ . '/../config.php';
$db = getDB();
try {
    $slug = $_GET['slug'] ?? null;
    $id = $_GET['id'] ?? null;
    if (!$slug && !$id) jsonResponse(['success' => false, 'error' => 'slug or id required'], 400);
    if ($id) {
        $stmt = $db->prepare("SELECT * FROM atlasagricole_products WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
    } else {
        $stmt = $db->prepare("SELECT * FROM atlasagricole_products WHERE slug = :slug LIMIT 1");
        $stmt->execute([':slug' => $slug]);
    }
    $r = $stmt->fetch();
    if (!$r) jsonResponse(['success' => false, 'error' => 'Not found'], 404);
    $r['images'] = decodeJsonField($r['images'], []);
    $r['usages'] = decodeJsonField($r['usages'], []);
    $r['composition'] = decodeJsonField($r['composition'], []);
    $r['benefits'] = decodeJsonField($r['benefits'], []);
    jsonResponse(['success' => true, 'data' => $r]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
