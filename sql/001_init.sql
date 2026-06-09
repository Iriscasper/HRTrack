-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.6.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para hrtrack
CREATE DATABASE IF NOT EXISTS `hrtrack` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci */;
USE `hrtrack`;

-- Volcando estructura para tabla hrtrack.notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `supply_id` int(10) unsigned NOT NULL,
  `schedule_id` int(10) unsigned NOT NULL,
  `type` enum('reminder','low_stock','missed') DEFAULT NULL,
  `message` longtext DEFAULT NULL,
  `read` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_notifications_supplies` (`supply_id`),
  KEY `FK_notifications_schedules` (`schedule_id`),
  KEY `FK_notifications_users` (`user_id`),
  CONSTRAINT `FK_notifications_schedules` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_notifications_supplies` FOREIGN KEY (`supply_id`) REFERENCES `supplies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_notifications_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla hrtrack.notifications: ~0 rows (aproximadamente)

-- Volcando estructura para tabla hrtrack.schedules
CREATE TABLE IF NOT EXISTS `schedules` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `supply_id` int(10) unsigned NOT NULL,
  `scheduled_at` datetime DEFAULT NULL,
  `taken_at` datetime DEFAULT NULL,
  `status` enum('pending','taken','missed') DEFAULT 'pending',
  `note` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_schedules_supplies` (`supply_id`),
  CONSTRAINT `FK_schedules_supplies` FOREIGN KEY (`supply_id`) REFERENCES `supplies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla hrtrack.schedules: ~0 rows (aproximadamente)

-- Volcando estructura para tabla hrtrack.supplies
CREATE TABLE IF NOT EXISTS `supplies` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` varchar(50) NOT NULL,
  `stock` int(11) DEFAULT NULL,
  `frequency` varchar(20) NOT NULL,
  `frequency_type` enum('interval','weekdays') NOT NULL DEFAULT 'interval',
  `start_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_supplies_users` (`user_id`),
  CONSTRAINT `FK_supplies_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla hrtrack.supplies: ~1 rows (aproximadamente)
REPLACE INTO `supplies` (`id`, `user_id`, `name`, `color`, `stock`, `frequency`, `frequency_type`, `start_date`) VALUES
	(6, 1, 'Testing', '#ff0000', NULL, '2', 'interval', '2026-06-09 20:01:45');

-- Volcando estructura para tabla hrtrack.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` int(10) unsigned NOT NULL COMMENT '0 = user, 1 = admin',
  `active` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- Volcando datos para la tabla hrtrack.users: ~1 rows (aproximadamente)
REPLACE INTO `users` (`id`, `email`, `password_hash`, `role`, `active`) VALUES
	(1, 'test@test.com', '$2b$10$n/TTK9yK9/Ru/c4R2/5dYePLnc0utI7JTOQBeoIPTBdxohm1wKPFa', 0, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
