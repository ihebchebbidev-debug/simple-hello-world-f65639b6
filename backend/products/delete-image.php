<?php
require_once __DIR__ . '/../config.php';
requireMethod(['POST']);
$db = getDB();
try {
    $b = getRequestBody();
    $productId = $b['product_id'] ?? null;
    $url = $b['url'] ?? null;
    if (!$productId || !$url) jsonResponse(['success' => false, 'error' => 'product_id and url required'], 400);

    $stmt = $db->prepare("SELECT images, main_image FROM atlasagricole_products WHERE id = ?");
    $stmt->execute([$productId]);
    $row = $stmt->fetch();
    if (!$row) jsonResponse(['success' => false, 'error' => 'Product not found'], 404);
    $imgs = decodeJsonField($row['images'], []);
    $imgs = array_values(array_filter($imgs, fn($i) => $i !== $url));
    $main = $row['main_image'] === $url ? ($imgs[0] ?? null) : $row['main_image'];
    $u = $db->prepare("UPDATE atlasagricole_products SET images = ?, main_image = ? WHERE id = ?");
    $u->execute([json_encode($imgs, JSON_UNESCAPED_UNICODE), $main, $productId]);

    // delete physical file
    $filename = basename(parse_url($url, PHP_URL_PATH));
    $path = __DIR__ . '/../uploads/' . $filename;
    if (is_file($path)) @unlink($path);
    jsonResponse(['success' => true]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
