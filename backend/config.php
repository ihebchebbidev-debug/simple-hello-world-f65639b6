<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

// CORS — allow all origins
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, X-Auth-Token");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

class Database {
    private $host = "localhost";
    private $username = "dramines_directadmin";
    private $password = "8edaanPtEDCCAELVmh3w";
    private $database = "dramines_directadmin";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database connection failed']);
            exit;
        }
        return $this->conn;
    }
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getRequestBody() {
    $raw = file_get_contents('php://input');
    if ($raw !== '' && $raw !== false) {
        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }
        $formData = [];
        parse_str($raw, $formData);
        if (!empty($formData)) return $formData;
    }
    return $_POST ?: [];
}

function getDB() {
    $db = new Database();
    return $db->getConnection();
}

function ensureUploadsDir() {
    $dir = __DIR__ . '/uploads';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    return $dir;
}

function getUploadUrl($filename) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $basePath = dirname($_SERVER['SCRIPT_NAME']);
    // if in subfolder like /products, go up one
    $basePath = preg_replace('#/(products|visitors)$#', '', $basePath);
    $basePath = rtrim($basePath, '/');
    return $protocol . '://' . $host . $basePath . '/uploads/' . $filename;
}

function decodeJsonField($value, $default = []) {
    if ($value === null || $value === '') return $default;
    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : $default;
}

function slugify($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    return strtolower($text) ?: 'produit';
}

function getClientIp() {
    $keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($keys as $k) {
        if (!empty($_SERVER[$k])) {
            $ip = trim(explode(',', $_SERVER[$k])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) return $ip;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function geoLookup($ip) {
    $out = ['country' => null, 'region' => null, 'city' => null];
    if ($ip === '127.0.0.1' || $ip === '0.0.0.0') return $out;
    $ctx = stream_context_create(['http' => ['timeout' => 2]]);
    $res = @file_get_contents("http://ip-api.com/json/{$ip}?fields=status,country,regionName,city", false, $ctx);
    if ($res) {
        $d = json_decode($res, true);
        if (!empty($d) && ($d['status'] ?? '') === 'success') {
            $out['country'] = $d['country'] ?? null;
            $out['region'] = $d['regionName'] ?? null;
            $out['city'] = $d['city'] ?? null;
        }
    }
    return $out;
}

function detectDevice($ua) {
    if (!$ua) return 'unknown';
    if (preg_match('/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i', $ua)) return 'mobile';
    if (preg_match('/ipad|tablet/i', $ua)) return 'tablet';
    return 'desktop';
}
