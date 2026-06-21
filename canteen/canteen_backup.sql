-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: canteen
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `action_name` varchar(100) NOT NULL,
  `details` text,
  `severity` enum('INFO','WARNING','CRITICAL') DEFAULT 'INFO',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'WALLET_TAMPERING_DETECTED','CRITICAL WARNING: Wallet balance for Employee ID 2 (CHANDAN KUMAR BARNWAL) has been tampered with! Database balance: ???500.00','CRITICAL','2026-06-10 12:25:39'),(2,'WALLET_RECHARGE','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 2. Amount: ???+100. New Balance: ???450.','INFO','2026-06-10 12:40:03'),(3,'WALLET_RECHARGE','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 2. Amount: ???+50. New Balance: ???500.','INFO','2026-06-10 12:46:47'),(4,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: RECEIPT. Amount: ???4800. Desc: Retirement Lunch. Date: 2026-06-10.','INFO','2026-06-10 13:39:51'),(5,'MEAL_PURCHASE_DEDUCTION','Employee ID 2 spent ???4 from Wallet for Canteen Order ID 18.','INFO','2026-06-10 13:56:49'),(6,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: BANK_CREDIT. Amount: ???5000. Desc: Bank Withdrawal. Date: 2026-06-10.','INFO','2026-06-10 14:10:18'),(7,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: BANK_DEBIT. Amount: ???1000. Desc: Pay to Supplier. Date: 2026-06-10.','INFO','2026-06-10 14:11:05'),(8,'WALLET_RECHARGE','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 3. Amount: ???+100. New Balance: ???300.','INFO','2026-06-10 15:37:22'),(9,'MEAL_PURCHASE_DEDUCTION','Employee ID 2 spent ???16 from Wallet for Canteen Order ID 22.','INFO','2026-06-10 15:51:18'),(10,'BROADCAST_PUBLISHED','Admin broadcasted a new SPECIAL_MENU: \"WEEKEND MEAL\"','INFO','2026-06-10 17:01:23'),(11,'BROADCAST_PUBLISHED','Admin broadcasted a new ANNOUNCEMENT: \"Tommorow Canteen Closed\"','INFO','2026-06-10 17:02:19'),(12,'WALLET_RECHARGE','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 6. Amount: ???+300. New Balance: ???300.','INFO','2026-06-10 17:33:38'),(13,'MEAL_PURCHASE_DEDUCTION','Employee ID 2 spent ???58 from Wallet for Canteen Order ID 24.','INFO','2026-06-10 17:36:21'),(14,'MEAL_PURCHASE_DEDUCTION','Employee ID 2 spent ???78 from Wallet for Canteen Order ID 25.','INFO','2026-06-10 17:47:08'),(15,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: RECEIPT. Amount: ???5000. Desc: Retirement Lunch. Date: 2026-06-12.','INFO','2026-06-10 17:58:34'),(16,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: BANK_DEBIT. Amount: ???1500. Desc: Payment to Suppliers. Date: 2026-06-10.','INFO','2026-06-10 18:00:00'),(17,'WALLET_RECHARGE','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 3. Amount: ???+10. New Balance: ???310.','INFO','2026-06-10 18:08:08'),(18,'WALLET_RECHARGE','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 2. Amount: ???+10.254. New Balance: ???354.254.','INFO','2026-06-10 18:16:07'),(19,'WALLET_DEDUCTION','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 2. Amount: ???-54.25. New Balance: ???300.','INFO','2026-06-10 18:16:27'),(20,'BROADCAST_PUBLISHED','Admin broadcasted a new ANNOUNCEMENT: \"Tomorrow Kunch Before 2:30\"','INFO','2026-06-10 18:17:46'),(21,'BROADCAST_PUBLISHED','Admin broadcasted a new SPECIAL_MENU: \"BIRIYANI\"','INFO','2026-06-10 18:18:13'),(22,'WALLET_DEDUCTION','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 2. Amount: ???-290. New Balance: ???10.','INFO','2026-06-10 18:25:03'),(23,'DAILY_CASH_CLOSING','Daily cashbook closing performed for Date: 2026-06-10. Opening Balance: ???15024, Total Income: ???5402, Total Expense: ???38500, Closing Balance: ???-15574. Actioned by Admin.','INFO','2026-06-10 18:28:47'),(24,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: RECEIPT. Amount: ???1500. Desc: ITSC Lunch. Date: 2026-06-10.','INFO','2026-06-10 18:32:13'),(25,'MEAL_PURCHASE_DEDUCTION','Employee ID 2 spent ???10 from Wallet for Canteen Order ID 28.','INFO','2026-06-11 05:50:33'),(26,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: RECEIPT. Amount: ???2800. Desc: Retirement Lunch. Date: 2026-06-12.','INFO','2026-06-11 06:43:27'),(27,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: RECEIPT. Amount: ???1500. Desc: retirement. Date: 2026-06-11.','INFO','2026-06-11 07:30:48'),(28,'BROADCAST_PUBLISHED','Admin broadcasted a new SPECIAL_MENU: \"Special Menu\"','INFO','2026-06-11 07:40:42'),(29,'WALLET_RECHARGE','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 2. Amount: ???+400. New Balance: ???400.','INFO','2026-06-11 12:05:51'),(30,'MEAL_PURCHASE_DEDUCTION','Employee ID 2 spent ???4 from Wallet for Canteen Order ID 31.','INFO','2026-06-11 12:06:57'),(31,'STOCK_ISSUE','Issued 35 of Rice - Miniket (Code: R01). Remarks: Stock Issued.','INFO','2026-06-11 12:25:04'),(32,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: RECEIPT. Amount: ???1200. Desc: DAG Lunch. Date: 2026-06-12.','INFO','2026-06-11 12:32:43'),(33,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: RECEIPT. Amount: ???1500. Desc: Meeting. Date: 2026-06-12.','INFO','2026-06-11 12:33:46'),(34,'BROADCAST_PUBLISHED','Admin broadcasted a new ANNOUNCEMENT: \"Canteen Closed\"','INFO','2026-06-11 12:41:12'),(35,'MEAL_PURCHASE_DEDUCTION','Employee ID 6 spent ???60 from Wallet for Canteen Order ID 34.','INFO','2026-06-12 10:09:39'),(36,'MEAL_PURCHASE_DEDUCTION','Employee ID 6 spent ???44 from Wallet for Canteen Order ID 35.','INFO','2026-06-12 10:18:22'),(37,'MEAL_PURCHASE_DEDUCTION','Employee ID 6 spent ???44 from Wallet for Canteen Order ID 36.','INFO','2026-06-12 10:22:53'),(38,'MEAL_PURCHASE_DEDUCTION','Employee ID 6 spent ???10 from Wallet for Canteen Order ID 37.','INFO','2026-06-12 10:29:27'),(39,'MEAL_PURCHASE_DEDUCTION','Employee ID 2 spent ???34 from Wallet for Canteen Order ID 38.','INFO','2026-06-14 17:25:09'),(40,'WALLET_RECHARGE','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 2. Amount: ???+20. New Balance: ???382.','INFO','2026-06-15 15:59:05'),(41,'STOCK_ISSUE','Issued 50 of Rice - Miniket (Code: R01). Remarks: Stock Issued.','INFO','2026-06-15 16:00:20'),(42,'MANUAL_CASHBOOK_ENTRY','Logged manual cashbook entry: RECEIPT. Amount: ???2500. Desc: Retirement Lunch. Date: 2026-06-15.','INFO','2026-06-15 16:38:34'),(43,'WALLET_RECHARGE','Admin AVRAJYOTI BISWAS (ID: 1) modified Wallet for Employee ID 9. Amount: Γé╣+100. New Balance: Γé╣100.','INFO','2026-06-21 16:01:44');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cashbook`
--

DROP TABLE IF EXISTS `cashbook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cashbook` (
  `cashbook_id` int NOT NULL AUTO_INCREMENT,
  `entry_type` enum('RECEIPT','EXPENSE','BANK_CREDIT','BANK_DEBIT') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `payment_mode` varchar(50) DEFAULT 'Cash',
  `receipt_path` varchar(255) DEFAULT NULL,
  `entry_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cashbook_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cashbook`
--

LOCK TABLES `cashbook` WRITE;
/*!40000 ALTER TABLE `cashbook` DISABLE KEYS */;
INSERT INTO `cashbook` VALUES (1,'RECEIPT',4800.00,'Retirement Lunch','Cash',NULL,'2026-06-10','2026-06-10 13:39:51'),(2,'BANK_CREDIT',5000.00,'Bank Withdrawal','Bank',NULL,'2026-06-10','2026-06-10 14:10:17'),(3,'BANK_DEBIT',1000.00,'Pay to Supplier','Bank',NULL,'2026-06-10','2026-06-10 14:11:05'),(4,'RECEIPT',5000.00,'Retirement Lunch','Cash',NULL,'2026-06-12','2026-06-10 17:58:34'),(5,'BANK_DEBIT',1500.00,'Payment to Suppliers','Bank',NULL,'2026-06-10','2026-06-10 18:00:00'),(6,'RECEIPT',1500.00,'ITSC Lunch','Cash',NULL,'2026-06-10','2026-06-10 18:32:13'),(7,'RECEIPT',2800.00,'Retirement Lunch','Cash',NULL,'2026-06-12','2026-06-11 06:43:27'),(8,'RECEIPT',1500.00,'retirement','Cash',NULL,'2026-06-11','2026-06-11 07:30:48'),(9,'RECEIPT',1200.00,'DAG Lunch','Cash',NULL,'2026-06-12','2026-06-11 12:32:43'),(10,'RECEIPT',1500.00,'Meeting','Cash',NULL,'2026-06-12','2026-06-11 12:33:46'),(11,'RECEIPT',2500.00,'Retirement Lunch','Cash',NULL,'2026-06-15','2026-06-15 16:38:34');
/*!40000 ALTER TABLE `cashbook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `role` enum('ADMIN','EMPLOYEE','STAFF') DEFAULT 'EMPLOYEE',
  `email` varchar(150) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'BPVPB0510H','$2b$10$qS4nsbYMm4Zs2VZ7ZktfeOR4.Ab6DKMIqxUFFV//5bGT30H29Y2Oe','AVRAJYOTI BISWAS','ADMIN','avrajyotib.wbl.ae@cag.gov.in','8927279103','Accountant',NULL,'2026-06-03 17:38:02','2026-06-21 16:48:19',NULL,NULL),(2,'CHYPB3643P','$2b$10$MfQwlRAw2gB0dfN/S2bAtu4688.uEtCXOAk5TG9uYBtNnzyg261G.','CHANDAN KUMAR BARNWAL','EMPLOYEE','chandankbl.wbl.ae@cag.gov.in','9851344622','CT',NULL,'2026-06-03 17:38:02','2026-06-21 16:48:19',NULL,NULL),(3,'AXXPR3413Q','$2b$10$G6vxL5xfc27vUTASworp/OrM44dVzFzZFhsGSoW2/nUePY7NdWB8e','AVIJIT ROY','STAFF','avijitr.wbl.ae@cag.gov.in','9874483288','Accountant',NULL,'2026-06-03 17:38:02','2026-06-21 16:48:19',NULL,NULL),(4,'admin_user','$2b$10$5X7vIC8wVCRiZeqXypXGjuwtPZG2OpP1MqSt/yrHYpoig4h4lAZ1u','Admin Canteen Guest','EMPLOYEE','admin_canteen@cag.gov.in','0000000000','Guest Counter',NULL,'2026-06-10 13:49:37','2026-06-21 16:48:20',NULL,NULL),(5,'admin','$2b$10$0v7XS5Ifj5FBAE9mrUOiquFE1zbdWId/S3dPY9ZDNjUP4hmVhFlM2','Canteen Admin Counter','EMPLOYEE','admin_counter@cag.gov.in','9999999999','Admin Operator',NULL,'2026-06-10 14:04:14','2026-06-21 16:48:20',NULL,NULL),(6,'BBJPM9837J','$2b$10$z/lRubpvGPdA358OLBF0d.VMwwgDgtoFOcXCRdHq2ec7mjOzwp5Ha','SAMRAT M','EMPLOYEE','samratm.wbl.ae@cag.gov.in','8240932621','AAO',NULL,'2026-06-10 17:31:47','2026-06-21 16:48:20',NULL,NULL),(8,'biswas.avrajyoti2010','google_oauth_placeholder','avro 03','EMPLOYEE','biswas.avrajyoti2010@gmail.com',NULL,NULL,'https://lh3.googleusercontent.com/a/ACg8ocKIY8xKDS-1NNLolG6qiTNsIzvmjhBfSvG-ht2mLW6Z6BhYtrEMnQ=s96-c','2026-06-12 06:18:19','2026-06-12 06:18:19',NULL,NULL),(9,'ABCDE1234F','$2b$10$CsrLiAwB2EQoXtzYaGD7j.oL53ZuAW2oOvOc.Wj7NGQmCEVQhj/ke','Rock Data','EMPLOYEE','dataworkshop101@gmail.com','9876543210','Accountant','https://lh3.googleusercontent.com/a/ACg8ocITBPa8zulKib6HGuCQG5sZIMo0k3TSPQuQGxSFbAbrWUpqJFSH=s96-c','2026-06-21 15:58:34','2026-06-21 18:38:53','750923','2026-06-22 00:13:54');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_time_slots`
--

DROP TABLE IF EXISTS `meal_time_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_time_slots` (
  `category` varchar(50) NOT NULL,
  `start_time` varchar(50) NOT NULL,
  `end_time` varchar(50) NOT NULL,
  PRIMARY KEY (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_time_slots`
--

LOCK TABLES `meal_time_slots` WRITE;
/*!40000 ALTER TABLE `meal_time_slots` DISABLE KEYS */;
INSERT INTO `meal_time_slots` VALUES ('breakfast','05:30 PM','07:00 PM'),('lunch','10:00 PM','12:00 AM'),('snacks','05:30 PM','07:30 PM');
/*!40000 ALTER TABLE `meal_time_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `item_id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `category` enum('Breakfast','Lunch','Snacks') NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `available_qty` int DEFAULT '0',
  `is_active` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,'/uploads/1780911774892.jpg','Lunch','RICE',10.00,266,'ACTIVE','2026-06-08 09:13:24'),(2,'/uploads/1780911681638.jpg','Lunch','Rice',6.00,93,'ACTIVE','2026-06-08 09:37:04'),(9,'/uploads/1780936225232.jpg','Breakfast','TEA',4.00,499,'ACTIVE','2026-06-08 16:30:25'),(10,'','Lunch','Egg Curry',18.00,45,'ACTIVE','2026-06-11 07:47:13'),(12,'/uploads/1781166538814.jpg','Breakfast','Omelette',10.00,50,'ACTIVE','2026-06-11 08:28:58'),(13,'','Snacks','Masala Dosa',60.00,10,'ACTIVE','2026-06-14 17:12:27');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text,
  `item_name` varchar(150) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'SPECIAL_MENU','WEEKEND MEAL',NULL,'Fried Rice',70.00,'/uploads/1781110881597.jpg','2026-06-10 17:01:23'),(2,'ANNOUNCEMENT','Tommorow Canteen Closed','Examination',NULL,NULL,NULL,'2026-06-10 17:02:19'),(3,'ANNOUNCEMENT','Tomorrow Kunch Before 2:30','Due to Retirement',NULL,NULL,NULL,'2026-06-10 18:17:46'),(4,'SPECIAL_MENU','BIRIYANI',NULL,'Biriyani',140.00,'/uploads/1781115491707.jpg','2026-06-10 18:18:13'),(5,'SPECIAL_MENU','Special Menu',NULL,'Maharaja Thali',250.00,'/uploads/1781163591564.jpg','2026-06-11 07:40:42'),(6,'ANNOUNCEMENT','Canteen Closed','Examination',NULL,NULL,NULL,'2026-06-11 12:41:12');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `item_id` bigint NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `quantity` int DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `fk_orderitems_order` (`order_id`),
  KEY `fk_orderitems_menuitem` (`item_id`),
  CONSTRAINT `fk_orderitems_menuitem` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`item_id`),
  CONSTRAINT `fk_orderitems_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,'RICE',1,10.00,10.00),(2,2,1,'RICE',1,10.00,10.00),(3,3,1,'RICE',1,10.00,10.00),(4,4,1,'RICE',2,10.00,20.00),(5,5,1,'RICE',2,10.00,20.00),(6,6,1,'RICE',2,10.00,20.00),(7,7,1,'RICE',2,10.00,20.00),(8,8,1,'RICE',2,10.00,20.00),(9,9,1,'RICE',2,10.00,20.00),(10,10,1,'RICE',2,10.00,20.00),(11,10,2,'DAL',1,6.00,6.00),(12,11,1,'RICE',2,10.00,20.00),(13,11,2,'DAL',1,6.00,6.00),(14,12,1,'RICE',2,10.00,20.00),(15,13,1,'RICE',1,10.00,10.00),(16,13,2,'DAL',1,6.00,6.00),(17,14,9,'TEA',1,4.00,4.00),(18,15,9,'TEA',2,4.00,8.00),(19,16,1,'RICE',1,10.00,10.00),(20,16,2,'DAL',1,6.00,6.00),(21,17,1,'RICE',1,10.00,10.00),(22,17,2,'DAL',1,6.00,6.00),(23,18,9,'TEA',1,4.00,4.00),(24,19,1,'RICE',20,10.00,200.00),(25,19,2,'DAL',17,6.00,102.00),(26,20,1,'RICE',1,10.00,10.00),(27,20,2,'DAL',1,6.00,6.00),(28,21,9,'TEA',1,4.00,4.00),(29,22,1,'RICE',1,10.00,10.00),(30,22,2,'DAL',1,6.00,6.00),(31,23,1,'RICE',1,10.00,10.00),(32,23,2,'DAL',1,6.00,6.00),(33,24,1,'RICE',4,10.00,40.00),(34,24,2,'DAL',3,6.00,18.00),(35,25,1,'RICE',6,10.00,60.00),(36,25,2,'DAL',3,6.00,18.00),(37,26,1,'RICE',4,10.00,40.00),(38,26,2,'DAL',1,6.00,6.00),(39,27,1,'RICE',4,10.00,40.00),(40,27,2,'DAL',1,6.00,6.00),(41,28,1,'RICE',1,10.00,10.00),(42,29,1,'RICE',2,10.00,20.00),(43,29,2,'DAL',1,6.00,6.00),(44,30,1,'RICE',2,10.00,20.00),(45,30,2,'DAL',1,6.00,6.00),(46,31,9,'TEA',1,4.00,4.00),(47,32,1,'RICE',1,10.00,10.00),(48,32,2,'Rice',1,6.00,6.00),(49,32,10,'Egg Curry',1,18.00,18.00),(50,33,1,'RICE',1,10.00,10.00),(51,33,2,'Rice',1,6.00,6.00),(52,33,10,'Egg Curry',1,18.00,18.00),(53,34,1,'RICE',3,10.00,30.00),(54,34,2,'Rice',2,6.00,12.00),(55,34,10,'Egg Curry',1,18.00,18.00),(56,35,1,'RICE',2,10.00,20.00),(57,35,2,'Rice',1,6.00,6.00),(58,35,10,'Egg Curry',1,18.00,18.00),(59,36,1,'RICE',2,10.00,20.00),(60,36,2,'Rice',1,6.00,6.00),(61,36,10,'Egg Curry',1,18.00,18.00),(62,37,1,'RICE',1,10.00,10.00),(63,38,1,'RICE',1,10.00,10.00),(64,38,2,'Rice',1,6.00,6.00),(65,38,10,'Egg Curry',1,18.00,18.00),(66,39,1,'RICE',1,10.00,10.00),(67,39,2,'Rice',1,6.00,6.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `employee_id` bigint NOT NULL,
  `category` varchar(50) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_mode` varchar(50) NOT NULL,
  `payment_status` enum('PENDING','SUCCESS','FAILED') DEFAULT 'PENDING',
  `order_status` enum('COUPON_GENERATED','REDEEMED','CANCELLED') DEFAULT 'COUPON_GENERATED',
  `coupon_code` varchar(50) DEFAULT NULL,
  `qr_code_path` varchar(255) DEFAULT NULL,
  `pickup_time` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_employee` (`employee_id`),
  CONSTRAINT `fk_orders_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,'Lunch',10.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780941946188','/qr/CPN1780941946188.png',NULL,'2026-06-08 18:05:46','2026-06-08 18:05:46'),(2,2,'Lunch',10.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780941964390','/qr/CPN1780941964390.png',NULL,'2026-06-08 18:06:04','2026-06-08 18:06:04'),(3,2,'Lunch',10.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780942105298','/qr/CPN1780942105298.png',NULL,'2026-06-08 18:08:25','2026-06-08 18:08:25'),(4,2,'Lunch',20.00,'WALLET','SUCCESS','REDEEMED','CPN1780942133890','/qr/CPN1780942133890.png',NULL,'2026-06-08 18:08:53','2026-06-10 17:41:36'),(5,2,'Lunch',20.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780942271438','/qr/CPN1780942271438.png',NULL,'2026-06-08 18:11:11','2026-06-08 18:11:11'),(6,2,'Lunch',20.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780942312689','/qr/CPN1780942312689.png',NULL,'2026-06-08 18:11:52','2026-06-08 18:11:52'),(7,2,'Lunch',20.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780942875817','/qr/CPN1780942875817.png',NULL,'2026-06-08 18:21:15','2026-06-08 18:21:15'),(8,2,'Lunch',20.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780943280025','/qr/CPN1780943280025.png',NULL,'2026-06-08 18:28:00','2026-06-08 18:28:00'),(9,2,'Lunch',20.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780944180198','/qr/CPN1780944180198.png',NULL,'2026-06-08 18:43:00','2026-06-08 18:43:00'),(10,2,'Lunch',26.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780944213268','/qr/CPN1780944213268.png',NULL,'2026-06-08 18:43:33','2026-06-08 18:43:33'),(11,2,'Lunch',26.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780986341135','/qr/CPN1780986341135.png',NULL,'2026-06-09 06:25:41','2026-06-09 06:25:41'),(12,2,'Lunch',20.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780986599695','/qr/CPN1780986599695.png',NULL,'2026-06-09 06:29:59','2026-06-09 06:29:59'),(13,2,'Lunch',16.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780989963452','/qr/CPN1780989963452.png',NULL,'2026-06-09 07:26:03','2026-06-09 07:26:03'),(14,2,'Lunch',4.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780990009992','/qr/CPN1780990009992.png',NULL,'2026-06-09 07:26:49','2026-06-09 07:26:49'),(15,2,'Lunch',8.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1780993468473','/qr/CPN1780993468473.png',NULL,'2026-06-09 08:24:28','2026-06-09 08:24:28'),(16,2,'Lunch',16.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1781002533858','/qr/CPN1781002533858.png',NULL,'2026-06-09 10:55:33','2026-06-09 10:55:33'),(17,2,'Lunch',16.00,'WALLET','SUCCESS','COUPON_GENERATED','CPN1781078828005','/qr/CPN1781078828005.png',NULL,'2026-06-10 08:07:08','2026-06-10 08:07:08'),(18,2,'Lunch',4.00,'Wallet','SUCCESS','COUPON_GENERATED','CPN1781099809469','/qr/CPN1781099809469.png',NULL,'2026-06-10 13:56:49','2026-06-10 13:56:49'),(19,5,'Lunch',302.00,'Cash','SUCCESS','COUPON_GENERATED','CPN1781100429252','/qr/CPN1781100429252.png',NULL,'2026-06-10 14:07:09','2026-06-10 14:07:09'),(20,5,'Lunch',16.00,'Cash','SUCCESS','COUPON_GENERATED','CPN1781100780887','/qr/CPN1781100780887.png',NULL,'2026-06-10 14:13:00','2026-06-10 14:13:00'),(21,5,'Lunch',4.00,'Scan QR','SUCCESS','COUPON_GENERATED','CPN1781101740141','/qr/CPN1781101740141.png',NULL,'2026-06-10 14:29:00','2026-06-10 14:29:00'),(22,2,'Lunch',16.00,'Wallet','SUCCESS','COUPON_GENERATED','CPN1781106678326','/qr/CPN1781106678326.png',NULL,'2026-06-10 15:51:18','2026-06-10 15:51:18'),(23,5,'Lunch',16.00,'Cash','SUCCESS','COUPON_GENERATED','CPN1781106906096','/qr/CPN1781106906096.png',NULL,'2026-06-10 15:55:06','2026-06-10 15:55:06'),(24,2,'Lunch',58.00,'Wallet','SUCCESS','REDEEMED','CPN1781112981826','/qr/CPN1781112981826.png',NULL,'2026-06-10 17:36:21','2026-06-10 17:41:36'),(25,2,'Lunch',78.00,'Wallet','SUCCESS','COUPON_GENERATED','CPN1781113628150','/qr/CPN1781113628150.png',NULL,'2026-06-10 17:47:08','2026-06-10 17:47:08'),(26,5,'Lunch',46.00,'Cash','SUCCESS','COUPON_GENERATED','CPN1781114531240','/qr/CPN1781114531240.png',NULL,'2026-06-10 18:02:11','2026-06-10 18:02:11'),(27,5,'Lunch',46.00,'Cash','SUCCESS','COUPON_GENERATED','CPN1781114684597','/qr/CPN1781114684597.png',NULL,'2026-06-10 18:04:44','2026-06-10 18:04:44'),(28,2,'Lunch',10.00,'Wallet','SUCCESS','COUPON_GENERATED','CPN1781157033621','/qr/CPN1781157033621.png',NULL,'2026-06-11 05:50:33','2026-06-11 05:50:33'),(29,5,'Lunch',26.00,'Cash','SUCCESS','COUPON_GENERATED','CPN1781157101501','/qr/CPN1781157101501.png',NULL,'2026-06-11 05:51:41','2026-06-11 05:51:41'),(30,5,'Lunch',26.00,'Cash','SUCCESS','COUPON_GENERATED','CPN1781157114511','/qr/CPN1781157114511.png',NULL,'2026-06-11 05:51:54','2026-06-11 05:51:54'),(31,2,'Lunch',4.00,'Wallet','SUCCESS','REDEEMED','CPN1781179617035','/qr/CPN1781179617035.png',NULL,'2026-06-11 12:06:57','2026-06-12 10:15:45'),(32,5,'Lunch',34.00,'Scan QR','SUCCESS','REDEEMED','CPN1781180311113','/qr/CPN1781180311113.png',NULL,'2026-06-11 12:18:31','2026-06-12 07:06:00'),(33,3,'Lunch',34.00,'Wallet','SUCCESS','COUPON_GENERATED','CPN1781252293814','/qr/CPN1781252293814.png',NULL,'2026-06-12 08:18:13','2026-06-12 08:18:13'),(34,6,'Lunch',60.00,'Wallet','SUCCESS','REDEEMED','CPN1781258978992','/qr/CPN1781258978992.png',NULL,'2026-06-12 10:09:38','2026-06-12 10:10:51'),(35,6,'Lunch',44.00,'Wallet','SUCCESS','REDEEMED','CPN1781259502407','/qr/CPN1781259502407.png',NULL,'2026-06-12 10:18:22','2026-06-12 10:19:24'),(36,6,'Lunch',44.00,'Wallet','SUCCESS','REDEEMED','CPN1781259773670','/qr/CPN1781259773670.png',NULL,'2026-06-12 10:22:53','2026-06-12 10:24:18'),(37,6,'Lunch',10.00,'Wallet','SUCCESS','REDEEMED','CPN1781260167114','/qr/CPN1781260167114.png',NULL,'2026-06-12 10:29:27','2026-06-12 10:31:24'),(38,2,'Lunch',34.00,'Wallet','SUCCESS','COUPON_GENERATED','CPN1781457909682','/qr/CPN1781457909682.png',NULL,'2026-06-14 17:25:09','2026-06-14 17:25:09'),(39,5,'Lunch',16.00,'Cash','SUCCESS','COUPON_GENERATED','CPN1781626354622','/qr/CPN1781626354622.png',NULL,'2026-06-16 16:12:34','2026-06-16 16:12:34');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` varchar(20) NOT NULL,
  `order_id` bigint NOT NULL,
  `employee_id` bigint NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `payment_status` enum('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'SUCCESS',
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payment_order` (`order_id`),
  KEY `fk_payment_employee` (`employee_id`),
  CONSTRAINT `fk_payment_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES ('PAY0001',15,2,8.00,'Wallet','SUCCESS','2026-06-09 13:54:28',NULL,'2026-06-09 08:24:28','2026-06-09 08:24:28'),('PAY0002',16,2,16.00,'Wallet','SUCCESS','2026-06-09 16:25:33',NULL,'2026-06-09 10:55:33','2026-06-09 10:55:33'),('PAY0003',17,2,16.00,'Wallet','SUCCESS','2026-06-10 13:37:08',NULL,'2026-06-10 08:07:08','2026-06-10 08:07:08'),('PAY0004',18,2,4.00,'Wallet','SUCCESS','2026-06-10 19:26:49',NULL,'2026-06-10 13:56:49','2026-06-10 13:56:49'),('PAY0005',19,5,302.00,'Cash','SUCCESS','2026-06-10 19:37:09',NULL,'2026-06-10 14:07:09','2026-06-10 14:07:09'),('PAY0006',20,5,16.00,'Cash','SUCCESS','2026-06-10 19:43:00',NULL,'2026-06-10 14:13:00','2026-06-10 14:13:00'),('PAY0007',21,5,4.00,'Scan QR','SUCCESS','2026-06-10 19:59:00',NULL,'2026-06-10 14:29:00','2026-06-10 14:29:00'),('PAY0008',22,2,16.00,'Wallet','SUCCESS','2026-06-10 21:21:18',NULL,'2026-06-10 15:51:18','2026-06-10 15:51:18'),('PAY0009',23,5,16.00,'Cash','SUCCESS','2026-06-10 21:25:06',NULL,'2026-06-10 15:55:06','2026-06-10 15:55:06'),('PAY0010',24,2,58.00,'Wallet','SUCCESS','2026-06-10 23:06:21',NULL,'2026-06-10 17:36:21','2026-06-10 17:36:21'),('PAY0011',25,2,78.00,'Wallet','SUCCESS','2026-06-10 23:17:08',NULL,'2026-06-10 17:47:08','2026-06-10 17:47:08'),('PAY0012',26,5,46.00,'Cash','SUCCESS','2026-06-10 23:32:11',NULL,'2026-06-10 18:02:11','2026-06-10 18:02:11'),('PAY0013',27,5,46.00,'Cash','SUCCESS','2026-06-10 23:34:44',NULL,'2026-06-10 18:04:44','2026-06-10 18:04:44'),('PAY0014',28,2,10.00,'Wallet','SUCCESS','2026-06-11 11:20:33',NULL,'2026-06-11 05:50:33','2026-06-11 05:50:33'),('PAY0015',29,5,26.00,'Cash','SUCCESS','2026-06-11 11:21:41',NULL,'2026-06-11 05:51:41','2026-06-11 05:51:41'),('PAY0016',30,5,26.00,'Cash','SUCCESS','2026-06-11 11:21:54',NULL,'2026-06-11 05:51:54','2026-06-11 05:51:54'),('PAY0017',31,2,4.00,'Wallet','SUCCESS','2026-06-11 17:36:57',NULL,'2026-06-11 12:06:57','2026-06-11 12:06:57'),('PAY0018',32,5,34.00,'Scan QR','SUCCESS','2026-06-11 17:48:31',NULL,'2026-06-11 12:18:31','2026-06-11 12:18:31'),('PAY0019',33,3,34.00,'Wallet','SUCCESS','2026-06-12 13:48:13',NULL,'2026-06-12 08:18:13','2026-06-12 08:18:13'),('PAY0020',34,6,60.00,'Wallet','SUCCESS','2026-06-12 15:39:39',NULL,'2026-06-12 10:09:39','2026-06-12 10:09:39'),('PAY0021',35,6,44.00,'Wallet','SUCCESS','2026-06-12 15:48:22',NULL,'2026-06-12 10:18:22','2026-06-12 10:18:22'),('PAY0022',36,6,44.00,'Wallet','SUCCESS','2026-06-12 15:52:53',NULL,'2026-06-12 10:22:53','2026-06-12 10:22:53'),('PAY0023',37,6,10.00,'Wallet','SUCCESS','2026-06-12 15:59:27',NULL,'2026-06-12 10:29:27','2026-06-12 10:29:27'),('PAY0024',38,2,34.00,'Wallet','SUCCESS','2026-06-14 22:55:09',NULL,'2026-06-14 17:25:09','2026-06-14 17:25:09'),('PAY0025',39,5,16.00,'Cash','SUCCESS','2026-06-16 21:42:34',NULL,'2026-06-16 16:12:34','2026-06-16 16:12:34');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_inventory`
--

DROP TABLE IF EXISTS `store_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_inventory` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_code` varchar(30) NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `category` varchar(100) NOT NULL,
  `unit` varchar(30) NOT NULL,
  `current_stock` decimal(10,2) DEFAULT '0.00',
  `minimum_stock` decimal(10,2) DEFAULT '0.00',
  `unit_cost` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_code` (`item_code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_inventory`
--

LOCK TABLES `store_inventory` WRITE;
/*!40000 ALTER TABLE `store_inventory` DISABLE KEYS */;
INSERT INTO `store_inventory` VALUES (1,'R01','Rice - Miniket','Grains','Kg',350.00,100.00,45.00,'2026-06-10 12:33:20','2026-06-15 16:00:20'),(2,'D01','Dal - ','Grains','Kg',90.00,10.00,160.00,'2026-06-10 17:50:11','2026-06-10 17:53:32'),(3,'V01','Potato','Vegetables','Kg',20.00,5.00,25.00,'2026-06-11 12:26:30','2026-06-11 12:29:19');
/*!40000 ALTER TABLE `store_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_issues`
--

DROP TABLE IF EXISTS `store_issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_issues` (
  `issue_id` int NOT NULL AUTO_INCREMENT,
  `item_code` varchar(30) NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `issued_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`issue_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_issues`
--

LOCK TABLES `store_issues` WRITE;
/*!40000 ALTER TABLE `store_issues` DISABLE KEYS */;
INSERT INTO `store_issues` VALUES (1,'R01','Rice - Miniket',35.00,'Stock Issued','2026-06-11 12:25:04'),(2,'R01','Rice - Miniket',50.00,'Stock Issued','2026-06-15 16:00:20');
/*!40000 ALTER TABLE `store_issues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_purchases`
--

DROP TABLE IF EXISTS `store_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_purchases` (
  `purchase_id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) DEFAULT NULL,
  `item_code` varchar(30) NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `category` varchar(100) NOT NULL,
  `unit` varchar(30) NOT NULL,
  `supplier_name` varchar(150) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_cost` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `invoice_path` varchar(255) DEFAULT NULL,
  `purchase_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`purchase_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_purchases`
--

LOCK TABLES `store_purchases` WRITE;
/*!40000 ALTER TABLE `store_purchases` DISABLE KEYS */;
INSERT INTO `store_purchases` VALUES (1,'INVOICE007','R01','Rice - Miniket','Grains','Kg','H.R. AGRO FOODS',500.00,45.00,22500.00,'/uploads/1781096193058.jpg','2026-06-10 18:26:33','2026-06-10 12:56:33'),(2,'INVOICE))@','D01','Dal - ','Grains','Kg','SAMRAT AGRO INDUSTRIES',100.00,160.00,16000.00,'/uploads/1781113926203.jpg','2026-06-10 23:22:06','2026-06-10 17:52:06'),(3,'IN005','V01','Potato','Vegetables','Kg','KCK FOODS',20.00,25.00,500.00,'/uploads/1781180959861.jpg','2026-06-11 17:59:19','2026-06-11 12:29:19');
/*!40000 ALTER TABLE `store_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet_transactions`
--

DROP TABLE IF EXISTS `wallet_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet_transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` bigint NOT NULL,
  `type` enum('credit','debit') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `title` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `wallet_transactions_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet_transactions`
--

LOCK TABLES `wallet_transactions` WRITE;
/*!40000 ALTER TABLE `wallet_transactions` DISABLE KEYS */;
INSERT INTO `wallet_transactions` VALUES (1,2,'credit',1000.00,'Admin Recharge','2026-06-02 04:30:00'),(2,2,'debit',80.00,'Meal Coupon (Wallet)','2026-06-02 06:13:00'),(3,2,'debit',30.00,'Meal Coupon (Wallet)','2026-06-01 06:12:00'),(4,2,'credit',500.00,'Admin Recharge','2026-05-30 03:50:00'),(5,2,'debit',20.00,'Meal Coupon (Wallet)','2026-05-29 11:05:00'),(6,2,'debit',4.00,'Meal Coupon (Wallet)','2026-06-10 13:56:49'),(7,3,'credit',100.00,'Admin Recharge','2026-06-10 15:37:22'),(8,2,'debit',16.00,'Meal Coupon (Wallet)','2026-06-10 15:51:18'),(9,6,'credit',300.00,'Admin Recharge','2026-06-10 17:33:38'),(10,2,'debit',58.00,'Meal Coupon (Wallet)','2026-06-10 17:36:21'),(11,2,'debit',78.00,'Meal Coupon (Wallet)','2026-06-10 17:47:08'),(12,3,'credit',10.00,'Admin Recharge','2026-06-10 18:08:08'),(13,2,'credit',10.25,'Admin Recharge','2026-06-10 18:16:07'),(14,2,'debit',54.25,'Admin Deduction','2026-06-10 18:16:27'),(15,2,'debit',290.00,'Admin Deduction','2026-06-10 18:25:03'),(16,2,'debit',10.00,'Meal Coupon (Wallet)','2026-06-11 05:50:33'),(17,2,'credit',400.00,'Admin Recharge','2026-06-11 12:05:51'),(18,2,'debit',4.00,'Meal Coupon (Wallet)','2026-06-11 12:06:57'),(19,6,'debit',60.00,'Meal Coupon (Wallet)','2026-06-12 10:09:39'),(20,6,'debit',44.00,'Meal Coupon (Wallet)','2026-06-12 10:18:22'),(21,6,'debit',44.00,'Meal Coupon (Wallet)','2026-06-12 10:22:53'),(22,6,'debit',10.00,'Meal Coupon (Wallet)','2026-06-12 10:29:27'),(23,2,'debit',34.00,'Meal Coupon (Wallet)','2026-06-14 17:25:09'),(24,2,'credit',20.00,'Admin Recharge','2026-06-15 15:59:05'),(25,9,'credit',100.00,'Admin Recharge','2026-06-21 16:01:45');
/*!40000 ALTER TABLE `wallet_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `wallet_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` bigint NOT NULL,
  `balance` decimal(12,2) DEFAULT '0.00',
  `signature` varchar(255) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`wallet_id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
INSERT INTO `wallets` VALUES (1,1,1000.00,'7600afdbae7846465bb682c65badd003e2df1bdd12a961e7cb76e55837e68c73','2026-06-10 12:23:03'),(2,2,382.00,'621dd0327b27912f805001c9ce94c264f0fb565a668dbdcca4bf5a40dedb5846','2026-06-15 15:59:05'),(3,3,310.00,'bf7a34daf9757e20b85b61f82e4366f2f87ce4de39fbf9b4573fd82af6511b1b','2026-06-10 18:08:08'),(4,5,0.00,'766ac1103c9f4ebec7621237b1690d25ea6f2c46268c940e93f3832b7360340b','2026-06-10 14:04:14'),(5,6,142.00,'704a27c50f66f22685b11b0d2a7e89408963727bb5cbf91b3d3d905a057ec598','2026-06-12 10:29:27'),(7,8,0.00,'d4fca1b77bb507c9686bb287d72667459ae2a1ede393b37d0e54ea5d2854f616','2026-06-12 06:18:19'),(8,9,100.00,'fee94867e31f02cd9c6d0b4c68e49d0db334396b7eb2bfcf4fff867327b0d26c','2026-06-21 16:01:44');
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-22  0:47:16
