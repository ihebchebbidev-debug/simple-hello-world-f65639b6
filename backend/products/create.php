<?php
require_once __DIR__ . '/../config.php';
requireMethod(['POST']);
$db = getDB();
try {
    $b = getRequestBody();
    if (empty($b['name'])) jsonResponse(['success' => false, 'error' => 'Name required'], 400);

    $slug = !empty($b['slug']) ? slugify($b['slug']) : slugify($b['name']);
    // ensure unique
    $base = $slug; $i = 1;
    $c = $db->prepare("SELECT id FROM atlasagricole_products WHERE slug = ?");
    while (true) {
        $c->execute([$slug]);
        if (!$c->fetch()) break;
        $i++;
        $slug = $base . '-' . $i;
    }

    $sql = "INSERT INTO atlasagricole_products
        (slug, name, category, tone, short_description, description, homologation, main_image, images, usages, composition, benefits, technical_sheet_url, is_active)
        VALUES (:slug,:name,:cat,:tone,:sd,:d,:h,:mi,:imgs,:us,:co,:be,:ts,:ia)";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':slug' => $slug,
        ':name' => $b['name'],
        ':cat' => $b['category'] ?? 'Fongicides',
        ':tone' => $b['tone'] ?? 'sage',
        ':sd' => $b['short_description'] ?? '',
        ':d' => $b['description'] ?? '',
        ':h' => $b['homologation'] ?? null,
        ':mi' => $b['main_image'] ?? null,
        ':imgs' => json_encode($b['images'] ?? [], JSON_UNESCAPED_UNICODE),
        ':us' => json_encode($b['usages'] ?? [], JSON_UNESCAPED_UNICODE),
        ':co' => json_encode($b['composition'] ?? [], JSON_UNESCAPED_UNICODE),
        ':be' => json_encode($b['benefits'] ?? [], JSON_UNESCAPED_UNICODE),
        ':ts' => $b['technical_sheet_url'] ?? null,
        ':ia' => isset($b['is_active']) ? (int)$b['is_active'] : 1,
    ]);
    jsonResponse(['success' => true, 'id' => $db->lastInsertId(), 'slug' => $slug]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
