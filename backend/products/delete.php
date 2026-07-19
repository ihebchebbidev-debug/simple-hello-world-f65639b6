<?php
require_once __DIR__ . '/../config.php';
requireMethod(['POST']);
$db = getDB();
try {
    $id = $_GET['id'] ?? (getRequestBody()['id'] ?? null);
    if (!$id) jsonResponse(['success' => false, 'error' => 'id required'], 400);

    // fetch images to clean up files after delete
    $s = $db->prepare("SELECT images, main_image FROM atlasagricole_products WHERE id = ?");
    $s->execute([$id]);
    $row = $s->fetch();
    if (!$row) jsonResponse(['success' => false, 'error' => 'Not found'], 404);

    $stmt = $db->prepare("DELETE FROM atlasagricole_products WHERE id = :id");
    $stmt->execute([':id' => $id]);

    $urls = decodeJsonField($row['images'], []);
    if ($row['main_image']) $urls[] = $row['main_image'];
    $uploadsDir = realpath(__DIR__ . '/../uploads');
    foreach (array_unique($urls) as $u) {
        if (!$u) continue;
        $filename = basename(parse_url($u, PHP_URL_PATH));
        $path = __DIR__ . '/../uploads/' . $filename;
        $real = realpath($path);
        if ($uploadsDir && $real && strpos($real, $uploadsDir) === 0 && is_file($real)) @unlink($real);
    }
    jsonResponse(['success' => true]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
