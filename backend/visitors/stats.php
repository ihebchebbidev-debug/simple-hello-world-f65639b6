<?php
require_once __DIR__ . '/../config.php';
$db = getDB();
try {
    $stats = [];
    $stats['total'] = (int)$db->query("SELECT COUNT(*) c FROM atlasagricole_visitors")->fetch()['c'];
    $stats['unique_ips'] = (int)$db->query("SELECT COUNT(DISTINCT ip_address) c FROM atlasagricole_visitors")->fetch()['c'];
    $stats['today'] = (int)$db->query("SELECT COUNT(*) c FROM atlasagricole_visitors WHERE DATE(visited_at) = CURDATE()")->fetch()['c'];
    $stats['this_week'] = (int)$db->query("SELECT COUNT(*) c FROM atlasagricole_visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetch()['c'];
    $stats['this_month'] = (int)$db->query("SELECT COUNT(*) c FROM atlasagricole_visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")->fetch()['c'];

    $stats['by_country'] = $db->query("SELECT country, COUNT(*) count FROM atlasagricole_visitors WHERE country IS NOT NULL GROUP BY country ORDER BY count DESC LIMIT 15")->fetchAll();
    $stats['by_device'] = $db->query("SELECT device_type, COUNT(*) count FROM atlasagricole_visitors GROUP BY device_type ORDER BY count DESC")->fetchAll();
    $stats['by_browser'] = $db->query("SELECT browser, COUNT(*) count FROM atlasagricole_visitors GROUP BY browser ORDER BY count DESC LIMIT 10")->fetchAll();
    $stats['by_region'] = $db->query("SELECT country, region, COUNT(*) count FROM atlasagricole_visitors WHERE region IS NOT NULL GROUP BY country, region ORDER BY count DESC LIMIT 15")->fetchAll();
    $stats['last_7_days'] = $db->query("SELECT DATE(visited_at) day, COUNT(*) count FROM atlasagricole_visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(visited_at) ORDER BY day ASC")->fetchAll();

    jsonResponse(['success' => true, 'data' => $stats]);
} catch (Exception $e) {
    jsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
