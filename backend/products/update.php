<?php
require_once __DIR__ . '/../config.php';
$db = getDB();
try {
    $b = getRequestBody();
    $id = $b['id'] ?? $_GET['id'] ?? null;
    if (!$id) jsonResponse(['success' => false, 'error' => 'id required'], 400);

    $fields = [];
    $params = [':id' => $id];
    $map = [
        'name' => 'name', 'category' => 'category', 'tone' => 'tone',
        'short_description' => 'short_description', 'description' => 'description',
        'homologation' => 'homologation', 'main_image' => 'main_image',
        'technical_sheet_url' => 'technical_sheet_url',
    ];
    foreach ($map as $k => $col) {
        if (array_key_exists($k, $b)) { $fields[] = "$col = :$k"; $params[":$k"] = $b[$k]; }
    }
    foreach (['images','usages','composition','benefits'] as $j) {
        if (array_key_exists($j, $b)) {
            $fields[] = "$j = :$j";
            $params[":$j"] = json_encode($b[$j] ?? [], JSON_UNESCAPED_UNICODE);
        }
    }
    if (array_key_exists('is_active', $b)) { $fields[] = "is_active = :ia"; $params[':ia'] = (int)$b['is_active']; }
    if (array_key_exists('slug', $b) && $b['slug']) {
        $newSlug = slugify($b['slug']);
        $chk = $db->prepare("SELECT id FROM atlasagricole_products WHERE slug = ? AND id <> ?");
        $chk->execute([$newSlug, $id]);
        if ($chk->fetch()) jsonResponse(['success' => false, 'error' => 'Ce slug est déjà utilisé par un autre produit'], 409);
        $fields[] = "slug = :slug"; $params[':slug'] = $newSlug;
    }
    if (!$fields) jsonResponse(['success' => false, 'error' => 'No fields to update'], 400);

    $sql = "UPDATE atlasagricole_products SET " . implode(',', $fields) . " WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse(['success' => true]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
