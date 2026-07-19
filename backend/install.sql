-- =========================================================
-- Atlas Agricole — Full installation script
-- Run this once against your MySQL database.
-- =========================================================

CREATE DATABASE IF NOT EXISTS `atlas_agricole`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `atlas_agricole`;

CREATE TABLE IF NOT EXISTS `atlasagricole_products` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(200) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `tone` VARCHAR(30) DEFAULT 'sage',
  `short_description` TEXT DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `homologation` VARCHAR(255) DEFAULT NULL,
  `main_image` VARCHAR(500) DEFAULT NULL,
  `images` JSON DEFAULT NULL,
  `usages` JSON DEFAULT NULL,
  `composition` JSON DEFAULT NULL,
  `benefits` JSON DEFAULT NULL,
  `technical_sheet_url` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_slug` (`slug`),
  KEY `idx_category` (`category`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `atlasagricole_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_name` (`name`),
  UNIQUE KEY `uniq_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `atlasagricole_visitors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip_address` VARCHAR(45) NOT NULL,
  `country` VARCHAR(100) DEFAULT NULL,
  `region` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `device_type` VARCHAR(20) DEFAULT NULL,
  `browser` VARCHAR(100) DEFAULT NULL,
  `os` VARCHAR(100) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `atlasagricole_contact_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `company` VARCHAR(150) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(40) DEFAULT NULL,
  `need` VARCHAR(200) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('new','read','archived') NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status` (`status`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `atlasagricole_categories` (`name`, `slug`, `sort_order`) VALUES
  ('Fongicides', 'fongicides', 1),
  ('Insecticides', 'insecticides', 2),
  ('Herbicides', 'herbicides', 3),
  ('Engrais', 'engrais', 4),
  ('Biostimulants', 'biostimulants', 5),
  ('Adjuvants', 'adjuvants', 6)
ON DUPLICATE KEY UPDATE `slug` = VALUES(`slug`), `sort_order` = VALUES(`sort_order`);

-- Optional app user for restricted access
-- CREATE USER IF NOT EXISTS 'atlas_user'@'localhost' IDENTIFIED BY 'change-me-strong-password';
-- GRANT SELECT, INSERT, UPDATE ON atlas_agricole.atlasagricole_products TO 'atlas_user'@'localhost';
-- GRANT SELECT, INSERT, UPDATE ON atlas_agricole.atlasagricole_categories TO 'atlas_user'@'localhost';
-- GRANT SELECT, INSERT, UPDATE ON atlas_agricole.atlasagricole_visitors TO 'atlas_user'@'localhost';
-- GRANT SELECT, INSERT, UPDATE ON atlas_agricole.atlasagricole_contact_messages TO 'atlas_user'@'localhost';
-- FLUSH PRIVILEGES;
