-- =====================================================
-- Atlas Agricole — Migrations SQL
-- All tables prefixed with atlasagricole_
-- =====================================================

CREATE TABLE IF NOT EXISTS `atlasagricole_products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `name` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `tone` VARCHAR(30) DEFAULT 'sage',
  `short_description` TEXT,
  `description` LONGTEXT,
  `homologation` VARCHAR(255) DEFAULT NULL,
  `main_image` VARCHAR(500) DEFAULT NULL,
  `images` JSON DEFAULT NULL,          -- array of image URLs
  `usages` JSON DEFAULT NULL,          -- [{crop, dose, target}]
  `composition` JSON DEFAULT NULL,     -- [{name, percentage}]
  `benefits` JSON DEFAULT NULL,        -- ["...","..."]
  `technical_sheet_url` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `atlasagricole_visitors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_address` VARCHAR(45) NOT NULL,
  `country` VARCHAR(100) DEFAULT NULL,
  `region` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `device_type` VARCHAR(20) DEFAULT NULL,   -- mobile / desktop / tablet
  `browser` VARCHAR(100) DEFAULT NULL,
  `os` VARCHAR(100) DEFAULT NULL,
  `user_agent` TEXT,
  `page_url` VARCHAR(500) DEFAULT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `language` VARCHAR(20) DEFAULT NULL,
  `screen_size` VARCHAR(20) DEFAULT NULL,
  `session_id` VARCHAR(80) DEFAULT NULL,
  `visited_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ip` (`ip_address`),
  KEY `idx_country` (`country`),
  KEY `idx_visited_at` (`visited_at`),
  KEY `idx_session` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `atlasagricole_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `atlasagricole_categories` (`name`, `slug`, `sort_order`) VALUES
('Fongicides', 'fongicides', 1),
('Insecticides', 'insecticides', 2),
('Herbicides', 'herbicides', 3),
('Engrais', 'engrais', 4),
('Biostimulants', 'biostimulants', 5),
('Adjuvants', 'adjuvants', 6);
