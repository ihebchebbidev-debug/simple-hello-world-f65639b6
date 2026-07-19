<?php
require_once __DIR__ . '/config.php';

// Ensures only authorized usage or limit access if needed
// For now, it's a utility script to be run manually.

try {
    $db = getDB();
    
    // 1. Fetch all products
    $stmt = $db->query("SELECT id, main_image, images FROM atlasagricole_products");
    $products = $stmt->fetchAll();
    
    $uploadsDir = ensureUploadsDir();
    $updatedCount = 0;
    
    echo "<pre>";
    echo "Starting image migration...\n\n";

    foreach ($products as $p) {
        $id = $p['id'];
        $main_image = $p['main_image'];
        $imagesJson = $p['images'];
        $images = json_decode($imagesJson, true) ?: [];
        
        $new_main_image = $main_image;
        $new_images = [];
        $changed = false;

        // Process main_image
        if ($main_image && strpos($main_image, 'atlasagricole.tn') !== false) {
            $filename = basename(parse_url($main_image, PHP_URL_PATH));
            $targetPath = $uploadsDir . '/' . $filename;
            
            if (!file_exists($targetPath)) {
                $content = @file_get_contents($main_image);
                if ($content !== false) {
                    file_put_contents($targetPath, $content);
                    echo "Downloaded: $filename\n";
                } else {
                    echo "FAILED to download: $main_image\n";
                }
            }
            
            $new_main_image = getUploadUrl($filename);
            $changed = true;
        }

        // Process images array
        foreach ($images as $img) {
            if ($img && strpos($img, 'atlasagricole.tn') !== false) {
                $filename = basename(parse_url($img, PHP_URL_PATH));
                $targetPath = $uploadsDir . '/' . $filename;
                
                if (!file_exists($targetPath)) {
                    $content = @file_get_contents($img);
                    if ($content !== false) {
                        file_put_contents($targetPath, $content);
                        echo "Downloaded (gallery): $filename\n";
                    } else {
                        echo "FAILED to download: $img\n";
                    }
                }
                $new_images[] = getUploadUrl($filename);
                $changed = true;
            } else {
                $new_images[] = $img;
            }
        }

        // Update database if changed
        if ($changed) {
            $upd = $db->prepare("UPDATE atlasagricole_products SET main_image = ?, images = ? WHERE id = ?");
            $upd->execute([
                $new_main_image,
                json_encode($new_images, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                $id
            ]);
            $updatedCount++;
            echo "Updated product ID $id in database.\n";
        }
    }
    
    echo "\nMigration complete! Updated $updatedCount products.\n";
    echo "</pre>";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
