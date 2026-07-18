<?php
require_once __DIR__ . '/../config.php';
$db = getDB();
try {
    $b = getRequestBody();
    $id = $b['id'] ?? null;
    if (!$id) jsonResponse(['success' => false, 'error' => 'id required'], 400);

    // fetch old name to cascade to products
    $old = $db->prepare("SELECT name FROM atlasagricole_categories WHERE id = ?");
    $old->execute([$id]);
    $oldRow = $old->fetch();
    if (!$oldRow) jsonResponse(['success' => false, 'error' => 'Not found'], 404);

    $fields = []; $params = [':id' => $id];
    if (array_key_exists('name', $b) && $b['name']) {
        $chk = $db->prepare("SELECT id FROM atlasagricole_categories WHERE name = ? AND id <> ?");
        $chk->execute([$b['name'], $id]);
        if ($chk->fetch()) jsonResponse(['success' => false, 'error' => 'Ce nom est déjà utilisé'], 409);
        $fields[] = "name = :name"; $params[':name'] = $b['name'];
    }
    if (array_key_exists('description', $b)) { $fields[] = "description = :description"; $params[':description'] = $b['description']; }
    if (array_key_exists('slug', $b) && $b['slug']) {
        $newSlug = slugify($b['slug']);
        $chk = $db->prepare("SELECT id FROM atlasagricole_categories WHERE slug = ? AND id <> ?");
        $chk->execute([$newSlug, $id]);
        if ($chk->fetch()) jsonResponse(['success' => false, 'error' => 'Ce slug est déjà utilisé'], 409);
        $fields[] = "slug = :slug"; $params[':slug'] = $newSlug;
    }
    if (array_key_exists('sort_order', $b)) { $fields[] = "sort_order = :so"; $params[':so'] = (int)$b['sort_order']; }
    if (!$fields) jsonResponse(['success' => false, 'error' => 'Aucun champ à mettre à jour'], 400);

    $stmt = $db->prepare("UPDATE atlasagricole_categories SET " . implode(',', $fields) . " WHERE id = :id");
    $stmt->execute($params);

    // cascade rename to products
    if (!empty($b['name']) && $b['name'] !== $oldRow['name']) {
        $u = $db->prepare("UPDATE atlasagricole_products SET category = ? WHERE category = ?");
        $u->execute([$b['name'], $oldRow['name']]);
    }
    jsonResponse(['success' => true]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
