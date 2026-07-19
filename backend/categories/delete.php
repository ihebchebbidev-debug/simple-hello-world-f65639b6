<?php
require_once __DIR__ . '/../config.php';
requireMethod(['POST']);
$db = getDB();
try {
    $id = $_GET['id'] ?? (getRequestBody()['id'] ?? null);
    if (!$id) jsonResponse(['success' => false, 'error' => 'id required'], 400);
    // guard: block delete if products still use it
    $r = $db->prepare("SELECT c.name, (SELECT COUNT(*) FROM atlasagricole_products p WHERE p.category = c.name) AS n
                       FROM atlasagricole_categories c WHERE c.id = ?");
    $r->execute([$id]);
    $row = $r->fetch();
    if (!$row) jsonResponse(['success' => false, 'error' => 'Not found'], 404);
    if ((int)$row['n'] > 0) jsonResponse(['success' => false, 'error' => "Impossible: {$row['n']} produit(s) utilisent cette catégorie"], 409);
    $db->prepare("DELETE FROM atlasagricole_categories WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
