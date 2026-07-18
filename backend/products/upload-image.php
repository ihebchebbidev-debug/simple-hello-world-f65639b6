<?php
require_once __DIR__ . '/../config.php';
try {
    if (empty($_FILES['file'])) jsonResponse(['success' => false, 'error' => 'No file'], 400);
    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK) jsonResponse(['success' => false, 'error' => 'Upload error'], 400);
    $allowed = ['jpg','jpeg','png','webp','gif'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed)) jsonResponse(['success' => false, 'error' => 'Invalid extension'], 400);
    if ($file['size'] > 10 * 1024 * 1024) jsonResponse(['success' => false, 'error' => 'File too large (max 10MB)'], 400);

    $dir = ensureUploadsDir();
    $filename = 'prod_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $target = $dir . '/' . $filename;
    if (!move_uploaded_file($file['tmp_name'], $target)) {
        jsonResponse(['success' => false, 'error' => 'Failed to save file'], 500);
    }

    $url = getUploadUrl($filename);

    // Optionally attach to product
    if (!empty($_POST['product_id'])) {
        $db = getDB();
        $stmt = $db->prepare("SELECT images, main_image FROM atlasagricole_products WHERE id = ?");
        $stmt->execute([$_POST['product_id']]);
        $row = $stmt->fetch();
        if ($row) {
            $imgs = decodeJsonField($row['images'], []);
            $imgs[] = $url;
            $main = $row['main_image'] ?: $url;
            $u = $db->prepare("UPDATE atlasagricole_products SET images = ?, main_image = ? WHERE id = ?");
            $u->execute([json_encode($imgs, JSON_UNESCAPED_UNICODE), $main, $_POST['product_id']]);
        }
    }

    jsonResponse(['success' => true, 'url' => $url, 'filename' => $filename]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
