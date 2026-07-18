-- Atlas Agricole — Contact form schema (MySQL 5.7+ / MariaDB 10.3+)

CREATE DATABASE IF NOT EXISTS `atlas_agricole`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `atlas_agricole`;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100)  NOT NULL,
  `company`    VARCHAR(150)  DEFAULT NULL,
  `email`      VARCHAR(255)  NOT NULL,
  `phone`      VARCHAR(40)   DEFAULT NULL,
  `need`       VARCHAR(200)  DEFAULT NULL,
  `message`    TEXT          NOT NULL,
  `ip_address` VARCHAR(45)   DEFAULT NULL,
  `user_agent` VARCHAR(255)  DEFAULT NULL,
  `status`     ENUM('new','read','archived') NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_status`     (`status`),
  KEY `idx_email`      (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dedicated app user (optional — adjust host/password before running):
-- CREATE USER 'atlas_user'@'localhost' IDENTIFIED BY 'change-me-strong-password';
-- GRANT SELECT, INSERT, UPDATE ON atlas_agricole.contact_messages TO 'atlas_user'@'localhost';
-- FLUSH PRIVILEGES;
