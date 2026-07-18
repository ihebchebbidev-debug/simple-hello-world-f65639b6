<?php
require_once __DIR__ . '/../config.php';
$db = getDB();
try {
    $b = getRequestBody();
    if (empty($b['name'])) jsonResponse(['success' => false, 'error' => 'Nom requis'], 400);
    $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['name']);

    $chk = $db->prepare("SELECT id FROM atlasagricole_categories WHERE name = ? OR slug = ? LIMIT 1");
    $chk->execute([$b['name'], $slug]);
    if ($chk->fetch()) jsonResponse(['success' => false, 'error' => 'Une catégorie avec ce nom ou slug existe déjà'], 409);

    $stmt = $db->prepare("INSERT INTO atlasagricole_categories (name, slug, description, sort_order) VALUES (?,?,?,?)");
    $stmt->execute([$b['name'], $slug, $b['description'] ?? null, (int)($b['sort_order'] ?? 0)]);
    jsonResponse(['success' => true, 'id' => $db->lastInsertId()]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
