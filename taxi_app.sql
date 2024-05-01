-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 01, 2024 at 07:47 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taxi_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `bank_detail`
--

CREATE TABLE `bank_detail` (
  `bank_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `account_name` varchar(200) NOT NULL DEFAULT '',
  `bsb` varchar(100) NOT NULL DEFAULT '',
  `account_no` varchar(50) NOT NULL DEFAULT '',
  `bank_name` varchar(150) NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bank_detail`
--

INSERT INTO `bank_detail` (`bank_id`, `user_id`, `account_name`, `bsb`, `account_no`, `bank_name`, `created_date`, `status`) VALUES
(1, 5, 'A Patel', 'YT123456', '7894561230', 'SBI', '2023-12-20 10:32:26', 1);

-- --------------------------------------------------------

--
-- Table structure for table `booking_detail`
--

CREATE TABLE `booking_detail` (
  `booking_id` int(11) NOT NULL,
  `user_id` varchar(11) NOT NULL DEFAULT '',
  `pickup_lat` varchar(25) NOT NULL DEFAULT '0',
  `pickup_long` varchar(25) NOT NULL DEFAULT '0',
  `pickup_address` varchar(1000) NOT NULL DEFAULT '',
  `drop_lat` varchar(25) NOT NULL DEFAULT '0',
  `drop_long` varchar(25) NOT NULL DEFAULT '0',
  `drop_address` varchar(1000) NOT NULL DEFAULT '',
  `pickup_date` datetime NOT NULL DEFAULT current_timestamp(),
  `service_id` int(11) NOT NULL DEFAULT 0,
  `price_id` int(11) NOT NULL DEFAULT 0,
  `driver_id` varchar(11) NOT NULL DEFAULT '',
  `user_car_id` varchar(11) NOT NULL DEFAULT '',
  `request_driver_id` varchar(20) NOT NULL DEFAULT '',
  `total_distance` varchar(20) NOT NULL DEFAULT '0.0',
  `accpet_time` datetime DEFAULT NULL,
  `otp_code` varchar(10) NOT NULL DEFAULT '000000',
  `accpet_driver_id` varchar(11) NOT NULL DEFAULT '',
  `payment_id` varchar(11) NOT NULL DEFAULT '',
  `start_time` datetime DEFAULT NULL,
  `stop_time` datetime DEFAULT NULL,
  `taxi_amout` varchar(20) NOT NULL DEFAULT '0',
  `duration` varchar(10) NOT NULL DEFAULT '0',
  `est_total_distance` varchar(20) NOT NULL DEFAULT '0',
  `est_duration` varchar(20) NOT NULL DEFAULT '0',
  `toll_tax` varchar(20) NOT NULL DEFAULT '0',
  `is_toll_accpet` varchar(2) NOT NULL DEFAULT '0' COMMENT '0 = no, 1 = accept, 2 = reject',
  `tip_amount` varchar(20) NOT NULL DEFAULT '0',
  `booking_status` int(11) NOT NULL DEFAULT 0 COMMENT '0 = pennding, 1 = accpet, 2 = go user, 3 = user wait, 4 = start tip, 5 = complete, 6 - cancel, 7 - auto reject (driver not found)',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `is_driver_cancel` varchar(2) NOT NULL DEFAULT '',
  `driver_rating` varchar(5) NOT NULL DEFAULT '0',
  `driver_comment` text NOT NULL DEFAULT '',
  `user_rating` varchar(5) NOT NULL DEFAULT '0',
  `user_comment` text NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_detail`
--

INSERT INTO `booking_detail` (`booking_id`, `user_id`, `pickup_lat`, `pickup_long`, `pickup_address`, `drop_lat`, `drop_long`, `drop_address`, `pickup_date`, `service_id`, `price_id`, `driver_id`, `user_car_id`, `request_driver_id`, `total_distance`, `accpet_time`, `otp_code`, `accpet_driver_id`, `payment_id`, `start_time`, `stop_time`, `taxi_amout`, `duration`, `est_total_distance`, `est_duration`, `toll_tax`, `is_toll_accpet`, `tip_amount`, `booking_status`, `created_date`, `is_driver_cancel`, `driver_rating`, `driver_comment`, `user_rating`, `user_comment`, `status`) VALUES
(1, '6', '21.21213402948101', '72.82620765222546', 'Katargam, , Katargam, Surat, GJ, 395004', '21.19927164872126', '72.84239580711711', 'Ring Road, Ring Road, Railway Station Area, Surat, GJ, 395003', '2024-02-05 10:52:28', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '8', NULL, NULL, '0', '0', '2.65', '2.3800000000000003', '0', '0', '0', 0, '2024-02-05 10:52:28', '', '0', '', '0', '', 1),
(7, '6', '21.219287357984033', '72.83247223807003', 'Katargram Road, Katargram Road, Katargam, Surat, GJ, 395004', '21.214404562269934', '72.83126546590518', 'Katargam, , Katargam, Surat, GJ, 395003', '2024-02-08 10:11:15', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '14', NULL, '2024-02-08 10:12:20', '0', '0', '1.21', '2.185', '0', '0', '0', 7, '2024-02-08 10:11:15', '', '0', '', '0', '', 1),
(8, '6', '21.219287357984033', '72.83247223807003', 'Katargram Road, Katargram Road, Katargam, Surat, GJ, 395004', '21.214404562269934', '72.83126546590518', 'Katargam, , Katargam, Surat, GJ, 395003', '2024-02-08 10:15:03', 1, 1, '5', '1', '5', '2', '2024-02-08 10:15:13', '9276', '', '15', '2024-02-15 10:55:54', '2024-02-16 10:45:56', '14.464285714285715', '06:00', '1.21', '2.185', '10', '0', '0', 6, '2024-02-08 10:15:03', '1', '0', '', '0', '', 1),
(9, '6', '21.21928734999999', '72.83247223807003', 'Katargram Road, Katargram Road, Katargam, Surat, GJ, 395004', '21.222110928793327', '72.83111313409294', 'Katargam, , Katargam, Surat, GJ, 395004', '2024-02-17 16:52:56', 1, 1, '5', '1', '5', '0.0', '2024-02-17 16:53:08', '8903', '', '16', '2024-02-17 16:53:08', '2024-02-17 17:01:03', '0', '0', '0.53', '1.1', '0', '0', '0', 6, '2024-02-17 16:52:57', '0', '0', '', '0', '', 1),
(10, '6', '21.22410588613696', '72.81469999625666', 'Singanpor, , Singanpor, Surat, GJ, 395004', '21.200925688727487', '72.82902360964182', '5/392A, Kashkiwad Bhagal Road, 5/392A, Kashkiwad Bhagal Road, Haripura, Surat, GJ, 395003', '2024-02-17 17:02:45', 1, 1, '5', '1', '5', '0.0', '2024-02-17 17:03:00', '7184', '', '17', '2024-02-17 17:03:00', '2024-02-17 17:11:15', '0', '0', '3.83', '4.836666666666667', '0', '0', '0', 6, '2024-02-17 17:02:45', '0', '0', '', '0', '', 1),
(11, '6', '21.211767205434334', '72.79040326968716', 'Palanpur Patia, , Palanpur Patia, Surat, GJ, 395005', '21.215476885575278', '72.78577577609663', 'Sima Nagar, , Sima Nagar, Surat, GJ, 395005', '2024-02-17 17:18:34', 1, 1, '5', '1', '5', '0.0', '2024-02-17 17:18:45', '6130', '', '18', '2024-02-17 17:18:45', '2024-02-17 17:21:13', '0', '0', '1.31', '2.32', '0', '0', '0', 6, '2024-02-17 17:18:34', '0', '0', '', '0', '', 1),
(12, '6', '21.226405660399926', '72.82146572309813', 'Dabholi Char Rasta, Dabholi Char Rasta, Block B, Singanpor, Surat, GJ, 395004', '21.23075898503643', '72.82076791733411', '43, Dabholi Road, 43, Dabholi Road, Dabholi, Surat, GJ, 395004', '2024-02-17 17:22:26', 1, 1, '5', '1', '5', '0.0', '2024-02-17 17:22:41', '4554', '', '19', '2024-02-17 17:22:41', '2024-02-17 17:25:50', '0', '0', '0.57', '0.7216666666666666', '0', '0', '0', 6, '2024-02-17 17:22:27', '0', '0', '', '0', '', 1),
(13, '6', '21.228308644836947', '72.82382572075126', 'Katargam, , Katargam, Surat, GJ, 395004', '21.23302726220925', '72.82202768700226', 'Katargam, , Katargam, Surat, GJ, 395004', '2024-02-17 17:27:23', 1, 1, '5', '1', '5', '0.0', '2024-02-17 17:27:26', '6397', '', '20', '2024-02-17 17:27:26', '2024-02-17 17:32:50', '0', '0', '1.28', '2.3983333333333334', '0', '0', '0', 6, '2024-02-17 17:27:23', '0', '0', '', '0', '', 1),
(14, '6', '21.219440869023884', '72.8274140962255', 'Katargam, , Katargam, Surat, GJ, 395004', '21.22080105749508', '72.83483844889994', 'Swami Parmanand Marg, Swami Parmanand Marg, Katargam, Surat, GJ, 395003', '2024-02-17 18:23:20', 1, 1, '5', '1', '5', '0.0', '2024-02-17 18:23:26', '3556', '', '21', '2024-02-17 18:23:26', '2024-02-17 18:23:47', '0', '0', '1.33', '2.603333333333333', '0', '0', '0', 6, '2024-02-17 18:23:20', '0', '0', '', '0', '', 1),
(15, '6', '21.21703376759671', '72.81967401625431', 'Tunki, , Tunki, Surat, GJ, 395004', '21.217194544654113', '72.82784466967748', '91, Katagram Ambika Nagar Road, Block 2, 91, Katagram Ambika Nagar Road, Block 2, Katargam, Surat, GJ, 395004', '2024-02-17 18:32:46', 1, 1, '5', '1', '5', '0.0', '2024-02-17 18:32:50', '2837', '', '22', '2024-02-17 18:32:50', '2024-02-17 18:35:06', '0', '0', '1.32', '4.075', '0', '0', '0', 6, '2024-02-17 18:32:46', '0', '0', '', '0', '', 1),
(16, '6', '21.227973076712857', '72.81338368315512', 'Singanpor, , Singanpor, Surat, GJ, 395004', '21.219490159306602', '72.82487376397724', 'Katargam, , Katargam, Surat, GJ, 395004', '2024-02-17 18:35:59', 2, 2, '', '', '', '0.0', NULL, '000000', '', '23', NULL, '2024-02-17 18:36:00', '0', '0', '2.35', '3.6166666666666667', '0', '0', '0', 7, '2024-02-17 18:36:00', '', '0', '', '0', '', 1),
(17, '6', '21.227973076712857', '72.81338368315512', 'Singanpor, , Singanpor, Surat, GJ, 395004', '21.22921548284572', '72.81972620795315', 'Singanpor, , Singanpor, Surat, GJ, 395004', '2024-02-17 18:36:09', 1, 1, '5', '1', '5', '0.0', '2024-02-17 18:36:15', '8822', '', '24', '2024-02-17 18:36:15', '2024-02-17 18:36:27', '0', '0', '0.77', '2.0266666666666664', '0', '0', '0', 6, '2024-02-17 18:36:09', '0', '0', '', '0', '', 1),
(18, '6', '21.21928735', '72.83247223807003', 'Dabholi, , Dabholi, Surat, GJ, 395004', '21.21928735', '72.83247223807003', 'Jai Sreeram Road, Jai Sreeram Road, Kanteshwar Society 1, Katargam, Surat, GJ, 395004', '2024-02-18 09:19:27', 1, 1, '5', '1', '5', '2', '2024-02-18 09:19:31', '7398', '', '25', '2024-02-19 11:00:14', '2024-02-19 11:37:54', '17.291666666666664', '37:40', '1.02', '1.5066666666666668', '10', '0', '0', 5, '2024-02-18 09:19:27', '', '0', '', '0', '', 1),
(19, '6', '21.18209667614693', '72.82938621428364', 'Udhana Darwaja, Surat, India, 395002 ', '21.188488525124367', '72.83495601786215', 'Salabatpura, Surat, India, 395002 ', '2024-04-04 08:31:39', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '26', NULL, '2024-04-04 08:32:44', '0', '0', '1.7626', '7.819999999999999', '0', '0', '0', 7, '2024-04-04 08:31:39', '', '0', '', '0', '', 1),
(20, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.185470187790425', '72.83314702110174', 'Rustampura, Salawatpura Main Road, Surat, India, 395002 ', '2024-04-04 08:34:05', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '27', NULL, '2024-04-04 08:35:10', '0', '0', '2.9159', '12.68333333333333', '0', '0', '0', 7, '2024-04-04 08:34:05', '', '0', '', '0', '', 1),
(21, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.201545244427518', '72.83400391395989', 'Mahidhar Pura, Mahindra Pura Main Road, Surat, India, 395003 ', '2024-04-04 08:47:39', 2, 2, '', '', '', '0.0', NULL, '000000', '', '28', NULL, '2024-04-04 08:47:39', '0', '0', '4.5729', '19.04666666666667', '0', '0', '0', 7, '2024-04-04 08:47:39', '', '0', '', '0', '', 1),
(22, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.185070695137302', '72.83290899458143', 'Rustampura, Salawatpura Main Road, Surat, India, 395002 ', '2024-04-04 08:50:02', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '29', NULL, '2024-04-04 08:51:07', '0', '0', '2.8426', '12.19666666666667', '0', '0', '0', 7, '2024-04-04 08:50:02', '', '0', '', '0', '', 1),
(23, '6', '21.176015286344114', '72.83024310722242', 'Udhana, Canal Road, Surat, India, 395017 ', '21.18285128330392', '72.83538446388835', 'Salabatpura, Surat, India, 395002 ', '2024-04-04 08:52:37', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '30', NULL, '2024-04-04 08:53:42', '0', '0', '1.2745', '6.476666666666667', '0', '0', '0', 7, '2024-04-04 08:52:37', '', '0', '', '0', '', 1),
(24, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.181297677625476', '72.8301955027095', 'Khatodara Wadi, Suman Desaiwadi Path, Surat, India, 395002 ', '2024-04-04 08:54:29', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '31', NULL, '2024-04-04 08:55:34', '0', '0', '1.7258', '7.116666666666666', '0', '0', '0', 7, '2024-04-04 08:54:29', '', '0', '', '0', '', 1),
(25, '6', '21.176281628370287', '72.83033831818591', 'Canal Road,Canal Road,Udhana,Surat,India,395017', '21.191595573420603', '21.191595573420603', 'Salabatpura,Salabatpura,Surat,India,395002', '2024-04-04 09:39:56', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '32', NULL, '2024-04-04 09:41:01', '0', '0', '3.0556', '12.365', '0', '0', '0', 7, '2024-04-04 09:39:56', '', '0', '', '0', '', 1),
(26, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.181652788160925', '72.83048113366222', 'Khatodara Wadi, Surat, India, 395002 ', '2024-04-07 10:51:51', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '33', NULL, '2024-04-07 10:52:56', '0', '0', '1.6912', '6.975', '0', '0', '0', 7, '2024-04-07 10:51:51', '', '0', '', '0', '', 1),
(27, '6', '21.171221019640218', '72.83090958009134', 'Udhana, Surat, India, 395017 ', '21.181475230967834', '72.83005268723309', 'Khatodara Wadi, Surat, India, 395002 ', '2024-04-07 10:53:14', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '34', NULL, '2024-04-07 10:54:19', '0', '0', '1.6419', '6.763333333333334', '0', '0', '0', 7, '2024-04-07 10:53:14', '', '0', '', '0', '', 1),
(29, '6', '21.171221019640218', '72.83090958009134', 'Udhana, Surat, India, 395017 ', '21.181342062997484', '72.83033831823964', 'Khatodara Wadi, Suman Desaiwadi Path, Surat, India, 395002 ', '2024-04-07 10:57:01', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '36', NULL, '2024-04-07 10:57:08', '0', '0', '1.5677', '6.446666666666667', '0', '0', '0', 7, '2024-04-07 10:57:01', '', '0', '', '0', '', 1),
(34, '6', '21.18049867072242', '72.82824369047268', 'Khatodara Wadi,Khatodara Wadi,Surat,India,395002', '21.178856258939476', '21.178856258939476', 'Bhatena,Bhatena,Surat,India,395002', '2024-04-07 13:30:25', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '41', NULL, '2024-04-07 13:31:30', '0', '0', '2.1958', '9.543333333333333', '0', '0', '0', 7, '2024-04-07 13:30:25', '', '0', '', '0', '', 1),
(35, '6', '21.170199999999944', '72.83110000000008', 'Udhana,Udhana,Surat,India,395017', '21.17930015532058', '21.17930015532058', 'Udhana Main Road,Udhana Main Road,Khatodara Wadi,Surat,India,395002', '2024-04-07 13:32:00', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '42', NULL, '2024-04-07 13:33:05', '0', '0', '1.3046', '5.34', '0', '0', '0', 7, '2024-04-07 13:32:00', '', '0', '', '0', '', 1),
(36, '6', '21.17992160872702', '72.82714877364475', '9, Sub Jail Pase Road,Sub Jail Pase Road,Khatodara Wadi,Surat,India,395002', '21.178945038312854', '21.178945038312854', 'Bhatena,Bhatena,Surat,India,395002', '2024-04-07 13:34:08', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '43', NULL, '2024-04-07 13:34:32', '0', '0', '2.2572', '9.773333333333333', '0', '0', '0', 7, '2024-04-07 13:34:08', '', '0', '', '0', '', 1),
(37, '6', '21.170199999999944', '72.83110000000008', 'Udhana,Udhana,Surat,India,395017', '21.182185454397', '21.182185454397', 'Udhana Darwaja,Udhana Darwaja,Surat,India,395002', '2024-04-07 13:37:28', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '44', NULL, '2024-04-07 13:37:52', '0', '0', '1.8974', '8.413333333333334', '0', '0', '0', 7, '2024-04-07 13:37:28', '', '0', '', '0', '', 1),
(38, '6', '21.170199999999944', '72.83110000000008', 'Udhana,Udhana,Surat,India,395017', '21.178501139656', '21.178501139656', 'Kharuwar Nagar Road,Kharuwar Nagar Road,Bhatena,Surat,India,395002', '2024-04-07 13:38:28', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '45', NULL, '2024-04-07 13:39:34', '0', '0', '1.6195', '6.756666666666666', '0', '0', '0', 7, '2024-04-07 13:38:29', '', '0', '', '0', '', 1),
(39, '6', '21.170199999999944', '72.83110000000008', 'Udhana,Udhana,Surat,India,395017', '21.179122595302392', '72.84033540153182', 'Bhatena,Bhatena,Surat,India,395002', '2024-04-07 13:42:39', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '46', NULL, '2024-04-07 13:42:47', '0', '0', '2.2733', '9.495000000000001', '0', '0', '0', 7, '2024-04-07 13:42:39', '', '0', '', '0', '', 1),
(40, '6', '21.17792407077966', '72.82800566395237', 'Khatodara Wadi,Khatodara Wadi,Surat,India,395002', '21.179788441223142', '72.84133510986639', '17, Jeevan Jot Cinema Road, Kunal Industrial Estate,Jeevan Jot Cinema Road,Bhatena,Surat,India,395002', '2024-04-07 13:48:44', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '47', NULL, '2024-04-07 13:49:03', '0', '0', '1.9983', '8.506666666666666', '0', '0', '0', 7, '2024-04-07 13:48:44', '', '0', '', '0', '', 1),
(41, '6', '21.1702', '72.83110000000001', 'Sub Jail Pase Road,Sub Jail Pase Road,Khatodara Wadi,Surat,India,395002', '21.1702', '72.83111', 'Bhatena,Bhatena,Surat,India,395002', '2024-04-07 13:49:28', 1, 1, '5', '1', '5', '2', '2024-04-07 13:49:35', '5028', '', '48', '2024-04-09 10:25:29', '2024-04-11 10:32:03', '82.88839285714288', '13:48:21', '2.2501', '9.333333333333334', '5', '0', '0', 6, '2024-04-07 13:49:28', '1', '0', '', '0', '', 1),
(43, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.179477715125493', '72.83362307414234', 'Udhana Darwaja, Surat, India, 395002 ', '2024-04-12 09:33:21', 1, 1, '5', '1', '5', '0.0', '2024-04-12 09:33:29', '8985', '', '50', '2024-04-12 09:33:29', '2024-04-12 09:38:33', '0', '0', '1.2798', '6.973333333333333', '0', '0', '0', 6, '2024-04-12 09:33:21', '0', '0', '', '0', '', 1),
(44, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.176547971402076', '72.83371828300717', 'Udhana, Udhana Magdalla Road, Surat, India, 395017 ', '2024-04-12 09:42:40', 1, 1, '5', '1', '5', '0.0', '2024-04-12 09:42:48', '7244', '', '51', '2024-04-12 09:42:48', '2024-04-12 09:44:37', '0', '0', '0.9282999999999999', '4.223333333333334', '0', '0', '0', 6, '2024-04-12 09:42:40', '0', '0', '', '0', '', 1),
(45, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.18085378520882', '72.83110000000008', 'Khatodara Wadi, Suman Desaiwadi Path, Surat, India, 395002 ', '2024-04-12 09:47:25', 1, 1, '5', '1', '5', '0.0', '2024-04-12 09:47:30', '7077', '', '52', '2024-04-12 09:47:30', '2024-04-12 09:49:24', '0', '0', '1.5849', '6.551666666666667', '0', '0', '0', 6, '2024-04-12 09:47:26', '0', '0', '', '0', '', 1),
(46, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.174949908048966', '72.8399545595351', 'Udhana, Surat, India, 394210 ', '2024-04-12 09:49:36', 1, 1, '5', '1', '5', '0.0', '2024-04-12 09:49:44', '4318', '', '53', '2024-04-12 09:49:44', '2024-04-12 09:51:02', '0', '0', '2.0407', '8.475', '0', '0', '0', 6, '2024-04-12 09:49:36', '1', '0', '', '0', '', 1),
(47, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.175127471044853', '72.83505122890614', 'Udhana, Surat, India, 395017 ', '2024-04-12 09:51:35', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '54', NULL, '2024-04-12 09:52:40', '0', '0', '0.8246', '3.598333333333334', '0', '0', '0', 7, '2024-04-12 09:51:35', '', '0', '', '0', '', 1),
(48, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.17592650493649', '72.83428954709188', 'Udhana, Surat, India, 395017 ', '2024-04-12 09:53:15', 1, 1, '5', '', '5', '0.0', NULL, '000000', '', '55', NULL, '2024-04-12 09:53:19', '0', '0', '0.8386', '3.78', '0', '0', '0', 7, '2024-04-12 09:53:15', '', '0', '', '0', '', 1),
(49, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.17139858914432', '72.84452465477904', 'Udhana, Surat, India, 394210 ', '2024-04-12 09:54:37', 1, 1, '5', '1', '5', '0.0', '2024-04-12 09:54:44', '3318', '', '56', '2024-04-12 09:54:44', '2024-04-12 09:55:48', '0', '0', '2.1008', '8.788333333333332', '0', '0', '0', 6, '2024-04-12 09:54:37', '0', '0', '', '0', '', 1),
(50, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.177968462179898', '72.83395630952748', 'Udhana, Udhana Main Road, Surat, India, 395017 ', '2024-04-12 09:56:16', 1, 1, '5', '1', '5', '0.0', '2024-04-12 09:56:19', '7349', '', '57', '2024-04-12 09:56:19', '2024-04-12 09:56:30', '0', '0', '1.0604', '4.371666666666667', '0', '0', '0', 6, '2024-04-12 09:56:16', '0', '0', '', '0', '', 1),
(51, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.176991876105124', '72.83538446388835', 'Bhatena, Udhana Main Road, Surat, India, 395002 ', '2024-04-12 09:56:40', 1, 1, '', '', '', '0.0', NULL, '000000', '', '58', NULL, '2024-04-12 09:56:40', '0', '0', '1.3505', '5.636666666666667', '0', '0', '0', 7, '2024-04-12 09:56:40', '', '0', '', '0', '', 1),
(52, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.176991876105124', '72.83538446388835', 'Bhatena, Udhana Main Road, Surat, India, 395002 ', '2024-04-12 09:56:48', 1, 1, '', '', '', '0.0', NULL, '000000', '', '59', NULL, '2024-04-12 09:56:48', '0', '0', '1.3505', '5.636666666666667', '0', '0', '0', 7, '2024-04-12 09:56:48', '', '0', '', '0', '', 1),
(53, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.181475232999787', '72.83871682468013', 'Bhatena, Surat, India, 395002 ', '2024-04-12 09:57:14', 1, 1, '', '', '', '0.0', NULL, '000000', '', '60', NULL, '2024-04-12 09:57:14', '0', '0', '1.8701', '7.923333333333333', '0', '0', '0', 7, '2024-04-12 09:57:14', '', '0', '', '0', '', 1),
(54, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.181475232999787', '72.83871682468013', 'Bhatena, Surat, India, 395002 ', '2024-04-12 09:57:35', 1, 1, '5', '1', '5', '0.0', '2024-04-12 09:57:43', '3281', '', '61', '2024-04-12 09:57:47', '2024-04-12 09:57:59', '0', '0', '1.8701', '7.923333333333333', '0', '0', '0', 6, '2024-04-12 09:57:35', '0', '0', '', '0', '', 1),
(55, '6', '21.170199999999944', '72.83110000000008', 'Udhana,Udhana,Surat,India,395017', '21.175571378618063', '72.83490841342973', 'Udhana,Udhana,Surat,India,395017', '2024-04-12 10:11:36', 1, 1, '', '', '', '0.0', NULL, '000000', '', '62', NULL, '2024-04-12 10:11:36', '0', '0', '0.8881', '3.851666666666667', '0', '0', '0', 7, '2024-04-12 10:11:36', '', '0', '', '0', '', 1),
(56, '6', '21.170199999999944', '72.83110000000008', 'Udhana,Udhana,Surat,India,395017', '21.176991876743767', '72.83481320238573', 'Udhana Main Road,Udhana Main Road,Udhana,Surat,India,395017', '2024-04-12 10:51:17', 1, 1, '5', '1', '5', '0.0', '2024-04-12 10:51:22', '9731', '', '63', '2024-04-12 10:51:29', '2024-04-12 10:51:41', '0', '0', '1.0712', '4.783333333333333', '0', '0', '0', 6, '2024-04-12 10:51:17', '0', '0', '', '0', '', 1),
(57, '6', '21.170199999999944', '72.83110000000008', 'Udhana, Surat, India, 395017 ', '21.177036266391852', '72.83481320238573', 'Udhana, Udhana Main Road, Surat, India, 395017 ', '2024-04-13 10:49:06', 1, 1, '5', '1', '5', '0.0', '2024-04-13 10:49:11', '4527', '', '64', '2024-04-19 10:49:56', '2024-04-19 11:06:25', '3', '0', '1.0749', '4.798333333333333', '0', '0', '0', 6, '2024-04-13 10:49:06', '1', '0', '', '0', '', 1),
(58, '6', '21.1701', '72.83111', 'Udhana,Udhana,Surat,India,395017', '21.1702', '72.83111', 'Bhatena,Bhatena,Surat,India,395002', '2024-04-13 11:34:05', 1, 1, '5', '1', '5', '2', '2024-04-13 11:34:08', '7180', '', '65', '2024-04-21 11:35:55', '2024-04-21 19:32:57', '3.9389880952380953', '07:57:02', '1.6195', '7.263333333333334', '0', '0', '0', 5, '2024-04-13 11:34:05', '', '4', '', '4', '', 1),
(59, '6', '21.1701', '72.83111', 'Udhana,Udhana,Surat,India,395017', '21.1702', '72.83111', 'Bhatena,Bhatena,Surat,India,395002', '2024-04-17 19:35:34', 1, 1, '5', '1', '5', '2', '2024-04-17 19:35:37', '4102', '', '66', '2024-04-21 19:35:49', '2024-04-21 19:35:53', '3.9345238095238093', '00:04', '2.3992', '10.07', '0', '0', '0', 5, '2024-04-17 19:35:34', '', '4', '', '5', '', 1),
(60, '6', '21.1701', '72.83111', 'Udhana,Udhana,Surat,India,395017', '21.1706', '72.83111', 'B-35, Kharuwar Nagar Road, Aanjada Nagar,Kharuwar Nagar Road,Bhatena,Surat,India,395002', '2024-04-17 19:42:17', 1, 1, '5', '1', '5', '2', '2024-04-17 19:42:22', '4652', '', '67', '2024-04-25 00:42:42', '2024-04-25 00:42:49', '3.9389880952380953', '00:07', '1.6195', '6.756666666666666', '0', '0', '0', 5, '2024-04-17 19:42:17', '', '3', '', '5', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `car_brand`
--

CREATE TABLE `car_brand` (
  `brand_id` int(11) NOT NULL,
  `brand_name` varchar(100) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '0 = inactive, 1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_brand`
--

INSERT INTO `car_brand` (`brand_id`, `brand_name`, `status`, `created_date`, `modify_date`) VALUES
(1, 'BMW', 1, '2023-12-21 10:24:22', '2023-12-21 10:24:22'),
(2, '0', 1, '2024-01-04 10:10:23', '2024-01-04 10:10:23');

-- --------------------------------------------------------

--
-- Table structure for table `car_model`
--

CREATE TABLE `car_model` (
  `model_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL DEFAULT 0,
  `model_name` varchar(100) NOT NULL DEFAULT '',
  `seat` int(2) NOT NULL DEFAULT 3,
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '0 = inactive, 1 = active, 2= delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_model`
--

INSERT INTO `car_model` (`model_id`, `brand_id`, `model_name`, `seat`, `status`, `created_date`, `modify_date`) VALUES
(1, 1, 'X3', 4, 1, '2023-12-21 10:25:02', '2023-12-21 10:25:02'),
(2, 1, 'X5', 4, 1, '2023-12-23 08:49:27', '2023-12-23 08:49:27'),
(3, 2, 'XZY', 7, 1, '2024-01-04 10:10:23', '2024-01-04 10:10:23');

-- --------------------------------------------------------

--
-- Table structure for table `car_series`
--

CREATE TABLE `car_series` (
  `series_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL DEFAULT 0,
  `model_id` int(11) NOT NULL DEFAULT 0,
  `series_name` varchar(100) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car_series`
--

INSERT INTO `car_series` (`series_id`, `brand_id`, `model_id`, `series_name`, `status`, `created_date`, `modify_date`) VALUES
(1, 1, 1, 'xLine', 1, '2023-12-21 10:26:19', '2023-12-21 10:26:19'),
(2, 1, 2, 'xLoin', 1, '2023-12-23 08:49:27', '2023-12-23 08:49:27'),
(3, 2, 3, 'YUR', 1, '2024-01-04 10:10:23', '2024-01-04 10:10:23');

-- --------------------------------------------------------

--
-- Table structure for table `chat_delete`
--

CREATE TABLE `chat_delete` (
  `d_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_delete`
--

INSERT INTO `chat_delete` (`d_id`, `user_id`, `receiver_id`, `created_date`) VALUES
(1, 3, 6, '2024-01-17 09:17:30'),
(2, 6, 3, '2024-01-17 09:17:21');

-- --------------------------------------------------------

--
-- Table structure for table `chat_message`
--

CREATE TABLE `chat_message` (
  `chat_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL DEFAULT 0,
  `receiver_id` int(11) NOT NULL DEFAULT 0,
  `message` text NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `receiver_date` datetime DEFAULT NULL,
  `modify_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = send, 1= receive, 2= view , 3 = sender delete, 4 = receiver delete, 5 = all delete',
  `message_type` int(1) NOT NULL DEFAULT 1 COMMENT '0 = text, 1 = file'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_message`
--

INSERT INTO `chat_message` (`chat_id`, `sender_id`, `receiver_id`, `message`, `created_date`, `receiver_date`, `modify_date`, `status`, `message_type`) VALUES
(23, 6, 3, 'Hi', '2024-01-12 10:44:24', NULL, '2024-01-13 08:58:16', 1, 0),
(24, 6, 3, '1', '2024-01-12 10:50:38', NULL, '2024-01-13 08:58:16', 1, 0),
(25, 6, 3, '2', '2024-01-12 10:51:19', NULL, '2024-01-13 08:58:16', 1, 0),
(26, 3, 6, '3', '2024-01-12 10:51:55', NULL, '2024-01-13 09:09:19', 1, 0),
(27, 3, 6, '4', '2024-01-12 10:52:00', NULL, '2024-01-13 09:09:19', 1, 0),
(28, 3, 6, '5', '2024-01-13 09:09:40', NULL, '2024-01-13 09:09:50', 1, 0),
(29, 3, 6, '6', '2024-01-13 09:09:55', NULL, '2024-01-13 09:10:12', 1, 0),
(30, 3, 6, '3', '2024-01-13 09:10:02', NULL, '2024-01-13 09:10:12', 1, 0),
(31, 6, 3, '4', '2024-01-13 09:10:20', NULL, '2024-01-13 09:10:24', 1, 0),
(32, 6, 3, '5', '2024-01-13 09:10:30', NULL, '2024-01-13 09:10:35', 1, 0),
(33, 6, 3, '7', '2024-01-13 09:10:39', NULL, '2024-01-13 09:11:31', 1, 0),
(34, 6, 3, '7', '2024-01-13 09:10:47', NULL, '2024-01-13 09:11:31', 1, 0),
(35, 6, 3, '6', '2024-01-13 09:10:53', NULL, '2024-01-13 09:11:31', 1, 0),
(36, 6, 3, '8', '2024-01-13 09:11:22', NULL, '2024-01-13 09:11:31', 1, 0),
(37, 3, 6, '10', '2024-01-13 09:11:35', NULL, '2024-01-13 09:11:39', 1, 0),
(38, 6, 3, '12', '2024-01-13 09:11:43', NULL, '2024-01-16 09:44:48', 1, 0),
(39, 3, 6, 'Hi', '2024-01-16 09:45:02', NULL, '2024-01-16 09:45:35', 1, 0),
(40, 6, 3, 'Good', '2024-01-16 09:45:47', NULL, '2024-01-16 09:46:14', 1, 0),
(41, 3, 6, '1234', '2024-01-16 09:45:55', NULL, '2024-01-16 09:46:16', 1, 0),
(42, 6, 3, '1', '2024-01-17 09:17:37', NULL, '2024-01-17 09:18:00', 1, 0),
(43, 3, 6, '2', '2024-01-17 09:18:04', NULL, '2024-01-17 09:24:08', 1, 0),
(44, 3, 6, '2', '2024-01-17 09:19:37', NULL, '2024-01-17 09:24:08', 1, 0),
(45, 3, 6, '3', '2024-01-17 09:23:15', NULL, '2024-01-17 09:24:08', 1, 0),
(46, 3, 6, '4', '2024-01-17 09:23:28', NULL, '2024-01-17 09:24:08', 1, 0),
(47, 3, 6, '5', '2024-01-17 09:24:14', NULL, '2024-01-17 09:24:27', 1, 0),
(48, 6, 3, 'Hi', '2024-01-17 09:24:34', NULL, '2024-01-17 09:24:42', 1, 0),
(49, 6, 3, '123', '2024-01-17 09:24:47', NULL, '2024-01-17 09:25:11', 1, 0),
(50, 6, 3, '12', '2024-01-17 09:24:53', NULL, '2024-01-17 09:25:11', 1, 0),
(51, 3, 6, '45', '2024-01-17 09:25:15', NULL, '2024-01-17 09:28:31', 1, 0),
(52, 3, 6, '456', '2024-01-17 09:25:30', NULL, '2024-01-17 09:28:31', 1, 0),
(53, 3, 6, '13', '2024-01-17 09:25:46', NULL, '2024-01-17 09:28:31', 1, 0),
(54, 3, 6, '16', '2024-01-17 09:27:53', NULL, '2024-01-17 09:28:31', 1, 0),
(55, 6, 3, '789', '2024-01-17 09:28:36', NULL, '2024-01-17 09:28:44', 1, 0),
(56, 6, 3, '423', '2024-01-17 09:28:41', NULL, '2024-01-17 09:28:44', 1, 0),
(57, 3, 6, 'ABCD', '2024-01-17 09:28:53', NULL, '2024-01-17 09:28:53', 0, 0),
(58, 5, 6, 'Hi', '2024-04-13 11:35:38', NULL, '2024-04-13 11:35:38', 0, 0),
(59, 6, 5, '1', '2024-04-13 11:35:43', NULL, '2024-04-16 22:45:15', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `contact_us_detail`
--

CREATE TABLE `contact_us_detail` (
  `contact_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(150) NOT NULL DEFAULT '',
  `subject` varchar(200) NOT NULL DEFAULT '',
  `message` varchar(5000) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = new message, 1 = read, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `crad_payment`
--

CREATE TABLE `crad_payment` (
  `app_txn_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL DEFAULT 0,
  `txt_status` int(11) NOT NULL DEFAULT 0 COMMENT '0 = processing, 1 = success, 2= fail, 3 = refund',
  `type` varchar(2) NOT NULL DEFAULT 's' COMMENT 's = sell, r = refund',
  `payload` text NOT NULL DEFAULT '',
  `proccess_amount` varchar(20) NOT NULL DEFAULT '0',
  `pay_type` int(1) NOT NULL DEFAULT 0 COMMENT '0 = full, 1 = upfront',
  `txn_id` varchar(30) NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `doc_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = personal , 2 = car',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '0 = inactive, 1 = active, 2 = delete',
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`doc_id`, `name`, `type`, `status`, `create_date`, `modify_date`) VALUES
(2, 'ID Card', 2, 2, '2023-11-13 12:07:54', '2023-11-15 11:11:19'),
(3, 'PAN ID', 2, 2, '2023-11-14 00:46:28', '2023-11-15 11:51:34'),
(4, 'ID Card Back Side', 1, 1, '2023-11-14 01:14:09', '2023-11-14 01:14:09'),
(5, 'P12', 2, 2, '2023-11-15 11:02:52', '2023-11-15 11:11:35'),
(6, 'Car PUC', 2, 1, '2023-11-28 10:18:29', '2023-11-28 10:18:29');

-- --------------------------------------------------------

--
-- Table structure for table `driver_document`
--

CREATE TABLE `driver_document` (
  `driver_doc_id` int(11) NOT NULL,
  `doc_id` int(11) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `doc_image` varchar(100) NOT NULL DEFAULT '',
  `expiry_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = new, 1 = delete, 2 = approved, 3 = unapproved, 4 = expriy in 15 day, 5 = expired',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `driver_document`
--

INSERT INTO `driver_document` (`driver_doc_id`, `doc_id`, `user_id`, `doc_image`, `expiry_date`, `status`, `created_date`, `modify_date`) VALUES
(16, 6, 5, 'car/20240430235755575572PKnTOawy.jpg', '2025-04-30 23:57:55', 0, '2024-04-30 23:57:55', '2024-04-30 23:57:55');

-- --------------------------------------------------------

--
-- Table structure for table `payment_detail`
--

CREATE TABLE `payment_detail` (
  `payment_id` int(11) NOT NULL,
  `card_id` varchar(11) NOT NULL DEFAULT '',
  `payment_type` int(1) NOT NULL DEFAULT 1,
  `amt` varchar(25) NOT NULL DEFAULT '0',
  `discount_amt` varchar(25) NOT NULL DEFAULT '0',
  `driver_amt` varchar(25) NOT NULL DEFAULT '0',
  `tax_amt` double NOT NULL DEFAULT 0,
  `ride_commission` double NOT NULL DEFAULT 0,
  `plusminus_amt` varchar(20) NOT NULL DEFAULT '0',
  `transaction_id` varchar(50) NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp(),
  `payment_date` datetime DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0 = pending, 1 = proccess, 2= done, 3 = fail',
  `pay_card_amt` varchar(25) NOT NULL DEFAULT '0',
  `pay_wallet_amt` varchar(25) NOT NULL DEFAULT '0',
  `pay_amt` varchar(25) NOT NULL DEFAULT '0',
  `front_pay_amount` varchar(25) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_detail`
--

INSERT INTO `payment_detail` (`payment_id`, `card_id`, `payment_type`, `amt`, `discount_amt`, `driver_amt`, `tax_amt`, `ride_commission`, `plusminus_amt`, `transaction_id`, `created_date`, `modify_date`, `payment_date`, `status`, `pay_card_amt`, `pay_wallet_amt`, `pay_amt`, `front_pay_amount`) VALUES
(1, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-02-05 10:23:10', '2024-02-05 10:23:10', NULL, 0, '0', '0', '0', '0'),
(2, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-02-05 10:25:39', '2024-02-05 10:25:39', NULL, 0, '0', '0', '0', '0'),
(3, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-02-05 10:27:11', '2024-02-05 10:27:11', NULL, 0, '0', '0', '0', '0'),
(4, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-02-05 10:28:06', '2024-02-05 10:28:06', NULL, 0, '0', '0', '0', '0'),
(5, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-02-05 10:31:38', '2024-02-05 10:31:38', NULL, 0, '0', '0', '0', '0'),
(6, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-02-05 10:32:49', '2024-02-05 10:32:49', NULL, 0, '0', '0', '0', '0'),
(7, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-02-05 10:50:37', '2024-02-05 10:50:37', NULL, 0, '0', '0', '0', '0'),
(8, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-02-05 10:52:28', '2024-02-05 10:52:28', NULL, 0, '0', '0', '0', '0'),
(9, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-08 09:28:14', '2024-02-08 09:28:14', NULL, 0, '0', '0', '0', '0'),
(10, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-08 09:30:03', '2024-02-08 09:30:03', NULL, 0, '0', '0', '0', '0'),
(11, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-08 09:32:13', '2024-02-08 09:32:13', NULL, 0, '0', '0', '0', '0'),
(12, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-08 09:34:21', '2024-02-08 09:34:21', NULL, 0, '0', '0', '0', '0'),
(13, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-08 10:07:37', '2024-02-08 10:07:37', NULL, 0, '0', '0', '0', '0'),
(14, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-08 10:11:15', '2024-02-08 10:11:15', NULL, 0, '0', '0', '0', '0'),
(15, '', 1, '14.464285714285715', '0', '2.22', 0.536, 12.24, '0', '', '2024-02-08 10:15:03', '2024-02-08 10:15:03', '2024-02-15 11:01:54', 1, '0', '0', '0', '0'),
(16, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-17 16:52:57', '2024-02-17 16:52:57', NULL, 0, '0', '0', '0', '0'),
(17, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-02-17 17:02:45', '2024-02-17 17:02:45', NULL, 0, '0', '0', '0', '0'),
(18, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-17 17:18:34', '2024-02-17 17:18:34', NULL, 0, '0', '0', '0', '0'),
(19, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-17 17:22:27', '2024-02-17 17:22:27', NULL, 0, '0', '0', '0', '0'),
(20, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-17 17:27:23', '2024-02-17 17:27:23', NULL, 0, '0', '0', '0', '0'),
(21, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-17 18:23:20', '2024-02-17 18:23:20', NULL, 0, '0', '0', '0', '0'),
(22, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-17 18:32:46', '2024-02-17 18:32:46', NULL, 0, '0', '0', '0', '0'),
(23, '', 1, '3', '0', '-0.29', 0.321, 2.97, '0', '', '2024-02-17 18:36:00', '2024-02-17 18:36:00', NULL, 0, '0', '0', '0', '0'),
(24, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-02-17 18:36:09', '2024-02-17 18:36:09', NULL, 0, '0', '0', '0', '0'),
(25, '', 1, '17.291666666666664', '0', '4.76', 0.875, 12.53, '0', '', '2024-02-18 09:19:27', '2024-02-18 09:19:27', '2024-02-19 11:37:54', 1, '0', '0', '0', '0'),
(26, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-04 08:31:39', '2024-04-04 08:31:39', NULL, 0, '0', '0', '0', '0'),
(27, '', 1, '7', '0', '3.83', 0.75, 2.42, '0', '', '2024-04-04 08:34:05', '2024-04-04 08:34:05', NULL, 0, '0', '0', '0', '0'),
(28, '', 1, '13', '0', '7.75', 1.393, 3.86, '0', '', '2024-04-04 08:47:39', '2024-04-04 08:47:39', NULL, 0, '0', '0', '0', '0'),
(29, '', 1, '7', '0', '3.83', 0.75, 2.42, '0', '', '2024-04-04 08:50:02', '2024-04-04 08:50:02', NULL, 0, '0', '0', '0', '0'),
(30, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-04 08:52:37', '2024-04-04 08:52:37', NULL, 0, '0', '0', '0', '0'),
(31, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-04 08:54:29', '2024-04-04 08:54:29', NULL, 0, '0', '0', '0', '0'),
(32, '', 1, '7', '0', '3.83', 0.75, 2.42, '0', '', '2024-04-04 09:39:56', '2024-04-04 09:39:56', NULL, 0, '0', '0', '0', '0'),
(33, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 10:51:51', '2024-04-07 10:51:51', NULL, 0, '0', '0', '0', '0'),
(34, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 10:53:14', '2024-04-07 10:53:14', NULL, 0, '0', '0', '0', '0'),
(35, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 10:55:17', '2024-04-07 10:55:17', NULL, 0, '0', '0', '0', '0'),
(36, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 10:57:01', '2024-04-07 10:57:01', NULL, 0, '0', '0', '0', '0'),
(37, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 11:12:26', '2024-04-07 11:12:26', NULL, 0, '0', '0', '0', '0'),
(38, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 11:22:34', '2024-04-07 11:22:34', NULL, 0, '0', '0', '0', '0'),
(39, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 11:24:44', '2024-04-07 11:24:44', NULL, 0, '0', '0', '0', '0'),
(40, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 11:26:35', '2024-04-07 11:26:35', NULL, 0, '0', '0', '0', '0'),
(41, '', 1, '7', '0', '3.83', 0.75, 2.42, '0', '', '2024-04-07 13:30:25', '2024-04-07 13:30:25', NULL, 0, '0', '0', '0', '0'),
(42, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 13:32:00', '2024-04-07 13:32:00', NULL, 0, '0', '0', '0', '0'),
(43, '', 1, '7', '0', '3.83', 0.75, 2.42, '0', '', '2024-04-07 13:34:08', '2024-04-07 13:34:08', NULL, 0, '0', '0', '0', '0'),
(44, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 13:37:28', '2024-04-07 13:37:28', NULL, 0, '0', '0', '0', '0'),
(45, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 13:38:29', '2024-04-07 13:38:29', NULL, 0, '0', '0', '0', '0'),
(46, '', 1, '7', '0', '3.83', 0.75, 2.42, '0', '', '2024-04-07 13:42:39', '2024-04-07 13:42:39', NULL, 0, '0', '0', '0', '0'),
(47, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-07 13:48:44', '2024-04-07 13:48:44', NULL, 0, '0', '0', '0', '0'),
(48, '', 1, '82.88839285714288', '0', '68.30', 9.347, 14.59, '0', '', '2024-04-07 13:49:28', '2024-04-07 13:49:28', '2024-04-10 00:13:50', 1, '0', '0', '0', '0'),
(49, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-08 10:41:56', '2024-04-08 10:41:56', NULL, 0, '0', '0', '0', '0'),
(50, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:33:21', '2024-04-12 09:33:21', NULL, 0, '0', '0', '0', '0'),
(51, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:42:40', '2024-04-12 09:42:40', NULL, 0, '0', '0', '0', '0'),
(52, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:47:26', '2024-04-12 09:47:26', NULL, 0, '0', '0', '0', '0'),
(53, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-04-12 09:49:36', '2024-04-12 09:49:36', NULL, 0, '0', '0', '0', '0'),
(54, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:51:35', '2024-04-12 09:51:35', NULL, 0, '0', '0', '0', '0'),
(55, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:53:15', '2024-04-12 09:53:15', NULL, 0, '0', '0', '0', '0'),
(56, '', 1, '6', '0', '3.02', 0.643, 2.34, '0', '', '2024-04-12 09:54:37', '2024-04-12 09:54:37', NULL, 0, '0', '0', '0', '0'),
(57, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:56:16', '2024-04-12 09:56:16', NULL, 0, '0', '0', '0', '0'),
(58, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:56:40', '2024-04-12 09:56:40', NULL, 0, '0', '0', '0', '0'),
(59, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:56:48', '2024-04-12 09:56:48', NULL, 0, '0', '0', '0', '0'),
(60, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:57:14', '2024-04-12 09:57:14', NULL, 0, '0', '0', '0', '0'),
(61, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 09:57:35', '2024-04-12 09:57:35', NULL, 0, '0', '0', '0', '0'),
(62, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 10:11:36', '2024-04-12 10:11:36', NULL, 0, '0', '0', '0', '0'),
(63, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-12 10:51:17', '2024-04-12 10:51:17', NULL, 0, '0', '0', '0', '0'),
(64, '', 1, '2', '0', '-0.19', 0.214, 1.98, '0', '', '2024-04-13 10:49:06', '2024-04-13 10:49:06', NULL, 0, '0', '0', '0', '0'),
(65, '', 1, '3.9389880952380953', '0', '1.75', 0.473, 2.19, '0', '', '2024-04-13 11:34:05', '2024-04-13 11:34:05', '2024-04-20 19:32:57', 1, '0', '0', '0', '0'),
(66, '', 1, '3.9345238095238093', '0', '1.74', 0.472, 2.19, '0', '', '2024-04-17 19:35:34', '2024-04-17 19:35:34', '2024-04-21 19:35:53', 1, '0', '0', '0', '0'),
(67, '', 1, '3.9389880952380953', '0', '1.75', 0.473, 2.19, '0', '', '2024-04-17 19:42:17', '2024-04-17 19:42:17', '2024-04-21 19:42:49', 1, '0', '0', '0', '0');

-- --------------------------------------------------------

--
-- Table structure for table `price_detail`
--

CREATE TABLE `price_detail` (
  `price_id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL DEFAULT 0,
  `service_id` varchar(20) NOT NULL DEFAULT '0',
  `base_charge` varchar(20) NOT NULL DEFAULT '0',
  `per_km_charge` varchar(20) NOT NULL DEFAULT '0',
  `per_min_charge` varchar(20) NOT NULL DEFAULT '0',
  `booking_charge` varchar(20) NOT NULL DEFAULT '0',
  `mini_fair` varchar(20) NOT NULL DEFAULT '0',
  `mini_km` varchar(20) NOT NULL DEFAULT '2',
  `cancel_charge` varchar(20) NOT NULL DEFAULT '0',
  `tax` varchar(20) NOT NULL DEFAULT '0',
  `status` int(1) NOT NULL DEFAULT 1,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `price_detail`
--

INSERT INTO `price_detail` (`price_id`, `zone_id`, `service_id`, `base_charge`, `per_km_charge`, `per_min_charge`, `booking_charge`, `mini_fair`, `mini_km`, `cancel_charge`, `tax`, `status`, `created_date`, `modify_date`) VALUES
(1, 2, '1', '2', '0.2', '0.1', '2', '2', '2', '2', '12', 1, '2023-11-28 10:20:17', '2023-11-28 10:20:17'),
(2, 2, '2', '2.5', '0.3', '0.2', '3', '3', '3', '3', '12', 1, '2023-11-28 10:20:17', '2023-11-28 10:20:17'),
(3, 3, '1', '6', '1', '1', '1.5', '10', '4', '1', '12', 1, '2023-12-02 12:18:57', '2023-12-02 12:18:57'),
(4, 3, '2', '7', '2', '2', '2.5', '12', '5', '1', '12', 1, '2023-12-02 12:18:57', '2023-12-02 12:18:57');

-- --------------------------------------------------------

--
-- Table structure for table `request_detail`
--

CREATE TABLE `request_detail` (
  `request_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL DEFAULT 0,
  `driver_id` int(11) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 0,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_detail`
--

CREATE TABLE `service_detail` (
  `service_id` int(11) NOT NULL,
  `service_name` varchar(40) NOT NULL DEFAULT '',
  `seat` varchar(5) NOT NULL DEFAULT '4',
  `color` varchar(10) NOT NULL DEFAULT '000000',
  `icon` varchar(100) NOT NULL DEFAULT '',
  `top_icon` varchar(100) NOT NULL DEFAULT '',
  `gender` varchar(10) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = inactive, 1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp(),
  `description` text NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_detail`
--

INSERT INTO `service_detail` (`service_id`, `service_name`, `seat`, `color`, `icon`, `top_icon`, `gender`, `status`, `created_date`, `modify_date`, `description`) VALUES
(1, 'GO RED', '5', '000000', 'service/20231117094101411CpBGrGRXSz.png', 'service/202311170947354735KOWhgBN75O.png', 'M,F', 1, '2023-11-16 10:32:40', '2023-11-17 09:47:35', 'GO123'),
(2, 'GO GREEN', '4', '00ff00', 'service/202311211455255525bV9LqKbA3I.png', 'service/202311211455255525foO2cKCPbd.png', 'M,F', 1, '2023-11-21 14:55:25', '2023-11-21 14:55:25', 'GO');

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plan`
--

CREATE TABLE `subscription_plan` (
  `plan_id` int(11) NOT NULL,
  `plan_name` varchar(200) NOT NULL DEFAULT '',
  `detail` text NOT NULL DEFAULT '',
  `days` int(4) NOT NULL DEFAULT 1,
  `amount` varchar(20) NOT NULL DEFAULT '0',
  `max_discount` varchar(20) NOT NULL DEFAULT '0',
  `max_ride` int(5) NOT NULL DEFAULT 0,
  `zone_id` int(11) NOT NULL DEFAULT 0,
  `service_id` varchar(20) NOT NULL DEFAULT '',
  `min_amount` varchar(20) NOT NULL DEFAULT '0',
  `discount_per` varchar(10) NOT NULL DEFAULT '0',
  `image` varchar(100) NOT NULL DEFAULT '',
  `user_type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = user, 2 = driver',
  `start_date` datetime NOT NULL DEFAULT current_timestamp(),
  `end_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_address`
--

CREATE TABLE `user_address` (
  `address_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `address` text NOT NULL,
  `lati` varchar(30) NOT NULL DEFAULT '0',
  `longi` varchar(30) NOT NULL DEFAULT '0',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 2 = delete',
  `tag_name` varchar(100) NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_cars`
--

CREATE TABLE `user_cars` (
  `user_car_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `series_id` varchar(100) NOT NULL,
  `car_number` varchar(30) NOT NULL DEFAULT '',
  `car_image` varchar(100) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = new added, 1= approved, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_cars`
--

INSERT INTO `user_cars` (`user_car_id`, `user_id`, `series_id`, `car_number`, `car_image`, `status`, `created_date`, `modify_date`) VALUES
(1, 5, '1', 'AA123', 'car/202312230847484748K2WbhjR4Og.jpg', 1, '2023-12-23 08:47:48', '2023-12-23 08:47:48'),
(2, 3, '1', '!@$12345', 'car/202312230849274927F6CGMLWl3j.jpg', 1, '2023-12-23 08:49:27', '2023-12-23 08:49:27'),
(3, 5, '1', 'XY123456', 'car/2024010410072372367He0c52zW.jpg', 1, '2024-01-04 10:07:23', '2024-01-04 10:07:23'),
(4, 5, '3', 'NT123456', 'car/202401041010231023LwqVYUHVHK.jpg', 1, '2024-01-04 10:10:23', '2024-01-04 10:10:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_detail`
--

CREATE TABLE `user_detail` (
  `user_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL DEFAULT '',
  `email` varchar(200) NOT NULL DEFAULT '',
  `gender` varchar(10) NOT NULL DEFAULT '',
  `mobile` varchar(15) NOT NULL DEFAULT '',
  `mobile_code` varchar(10) NOT NULL DEFAULT '',
  `password` varchar(200) NOT NULL DEFAULT '00000000',
  `user_type` int(1) NOT NULL DEFAULT 1 COMMENT '1 = user, 2 = driver, 4 = admin',
  `push_token` varchar(200) NOT NULL DEFAULT '',
  `auth_token` varchar(200) NOT NULL DEFAULT '',
  `device_source` varchar(10) NOT NULL DEFAULT 'i' COMMENT 'i = iOS, a = Android, w = web',
  `zone_id` int(11) NOT NULL DEFAULT 0,
  `select_service_id` varchar(100) NOT NULL DEFAULT '0',
  `expiry_date` datetime NOT NULL DEFAULT current_timestamp(),
  `is_block` int(1) NOT NULL DEFAULT 0 COMMENT ' 0 = unblock, 1 = block ',
  `lati` varchar(50) NOT NULL DEFAULT '0.0',
  `longi` varchar(50) NOT NULL DEFAULT '0.0',
  `reset_code` varchar(10) NOT NULL DEFAULT '000000',
  `image` varchar(100) NOT NULL DEFAULT '',
  `car_id` varchar(25) NOT NULL DEFAULT '',
  `seat` int(2) NOT NULL DEFAULT 0,
  `is_online` int(1) NOT NULL DEFAULT 0 COMMENT '0 = offline, 1 = online',
  `is_request_send` int(1) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 0 COMMENT ' 0 = not verify, 1 = not apporved, 2 = approved, 3 = on ride',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_detail`
--

INSERT INTO `user_detail` (`user_id`, `name`, `email`, `gender`, `mobile`, `mobile_code`, `password`, `user_type`, `push_token`, `auth_token`, `device_source`, `zone_id`, `select_service_id`, `expiry_date`, `is_block`, `lati`, `longi`, `reset_code`, `image`, `car_id`, `seat`, `is_online`, `is_request_send`, `status`, `created_date`, `modify_date`) VALUES
(1, 'admin', 'admin@admin.com', '', '', '', '123456', 4, '', 'RhswkFnGgiiMK9inBiwj', 'i', 0, '0', '2023-11-11 10:11:17', 0, '0.0', '0.0', '000000', '', '', 0, 0, 0, 1, '2023-11-11 10:11:17', '2024-02-02 10:29:51'),
(2, 'User1', 'user@gmail.com', 'M', '9876543212', '+91', '00000000', 1, '', 'pA6U4htAA2nsKIOBstOK12', 'i', 0, '0', '2023-11-18 17:58:15', 0, '0.0', '0.0', '000000', '', '', 0, 1, 0, 0, '2023-11-18 17:58:15', '2023-11-18 17:58:15'),
(3, 'Driver1', 'driver@gmail.com', 'm', '9876543211', '+91', '00000000', 2, '', '6fIynW09WNlTbSYr7ruM12', 'i', 2, '0,1', '2023-11-19 10:13:59', 0, '21.1702', '72.8311', '000000', 'profile/Invalid dateSdMzuZf7YR.jpg', '2', 0, 1, 0, 1, '2023-11-19 10:13:59', '2024-01-16 08:45:56'),
(5, 'Json Data', 'json@data.com', 'm', '9876543213', '+91', '00000000', 2, '', '6fIynW09WNlTbSYr7ruM', 'a', 2, '0,1', '2023-12-13 12:11:03', 0, '21.1702', '72.83111', '000000', 'profile/20231230112728272838x4DAzEtE.png', '1', 4, 1, 0, 1, '2023-12-13 12:11:03', '2024-04-16 22:39:44'),
(6, 'User1', '', '', '9876543210', '+91', '00000000', 1, '', 'pA6U4htAA2nsKIOBstOK', 'i', 0, '0', '2024-01-12 02:52:17', 0, '0.0', '0.0', '000000', 'profile/2024011410482648268CJ2mtvzEX.png', '', 0, 0, 0, 1, '2024-01-12 02:52:17', '2024-04-20 00:04:02');

-- --------------------------------------------------------

--
-- Table structure for table `user_notification`
--

CREATE TABLE `user_notification` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `notification_status` int(11) NOT NULL,
  `status_date` datetime NOT NULL DEFAULT current_timestamp(),
  `created_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `wallet_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `booking_id` varchar(20) NOT NULL DEFAULT '',
  `transaction_id` varchar(20) NOT NULL DEFAULT '',
  `amount` varchar(25) NOT NULL DEFAULT '0.0',
  `wallet_status` varchar(2) NOT NULL DEFAULT 'cr' COMMENT 'cr = credit, dr = debit',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 1 COMMENT '0 = recode, 1 = proccesing, 2 = done, 3 = fail, 4 = delete'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `zone_document`
--

CREATE TABLE `zone_document` (
  `zone_doc_id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL DEFAULT 0,
  `service_id` int(11) NOT NULL DEFAULT 0,
  `personal_doc` varchar(500) NOT NULL DEFAULT '',
  `car_doc` varchar(500) NOT NULL DEFAULT '',
  `required_personal_doc` varchar(500) NOT NULL DEFAULT '',
  `required_car_doc` varchar(500) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '0 = inactive, 1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zone_document`
--

INSERT INTO `zone_document` (`zone_doc_id`, `zone_id`, `service_id`, `personal_doc`, `car_doc`, `required_personal_doc`, `required_car_doc`, `status`, `created_date`, `modify_date`) VALUES
(1, 2, 1, '4', '6', '', '', 1, '2023-11-28 10:20:17', '2023-11-28 10:20:17'),
(2, 2, 2, '4', '6', '', '', 1, '2023-11-28 10:20:17', '2023-11-28 10:20:17'),
(3, 3, 1, '4', '6', '', '', 1, '2023-12-02 12:18:57', '2023-12-02 12:18:57'),
(4, 3, 2, '4', '6', '', '', 1, '2023-12-02 12:18:57', '2023-12-02 12:18:57');

-- --------------------------------------------------------

--
-- Table structure for table `zone_list`
--

CREATE TABLE `zone_list` (
  `zone_id` int(11) NOT NULL,
  `zone_name` varchar(100) NOT NULL DEFAULT '',
  `zone_json` text NOT NULL DEFAULT '[]',
  `city` varchar(100) NOT NULL DEFAULT '',
  `tax` varchar(10) NOT NULL DEFAULT '0',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = inactive, 1 = active, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zone_list`
--

INSERT INTO `zone_list` (`zone_id`, `zone_name`, `zone_json`, `city`, `tax`, `status`, `created_date`, `modify_date`) VALUES
(1, 'Surat', '[{\"lat\":21.234071405319412,\"lng\":72.78741790923924},{\"lat\":21.193103915519966,\"lng\":72.75171234283299},{\"lat\":21.122023996604224,\"lng\":72.76819183502049},{\"lat\":21.099604337748353,\"lng\":72.85539581451268},{\"lat\":21.13163138470797,\"lng\":72.93024017486424},{\"lat\":21.193103915519966,\"lng\":72.95152618560643},{\"lat\":21.236631495808417,\"lng\":72.91376068267674},{\"lat\":21.25839046976389,\"lng\":72.87393524322361},{\"lat\":21.262229955104054,\"lng\":72.81351043853611}]', 'Surat', '12', 2, '2023-11-28 10:09:23', '2023-11-28 10:09:23'),
(2, 'Surat', '[{\"lat\":21.25122247003966,\"lng\":72.76684190292423},{\"lat\":21.194895788101793,\"lng\":72.74212266464298},{\"lat\":21.118052067819878,\"lng\":72.75585557479923},{\"lat\":21.079615265628558,\"lng\":72.8258934165961},{\"lat\":21.120614167454328,\"lng\":72.98931504745548},{\"lat\":21.224341963397286,\"lng\":72.90691758651798},{\"lat\":21.284496302888716,\"lng\":72.88356526831052},{\"lat\":21.26786032663738,\"lng\":72.78194173315427}]', 'Surat', '12', 1, '2023-11-28 10:20:17', '2023-11-28 10:20:17'),
(3, 'Vipu', '[{\"lat\":37.36325328573653,\"lng\":-122.0300589375883},{\"lat\":37.3321391686025,\"lng\":-122.05924137167032},{\"lat\":37.300192853717434,\"lng\":-122.07915409139689},{\"lat\":37.30811243663259,\"lng\":-122.0032797627836},{\"lat\":37.342511973600786,\"lng\":-121.94697483114298},{\"lat\":37.362161780608204,\"lng\":-122.00602634481486}]', 'Vapi', '12', 1, '2023-12-02 12:18:57', '2023-12-02 12:18:57');

-- --------------------------------------------------------

--
-- Table structure for table `zone_wise_cars_service`
--

CREATE TABLE `zone_wise_cars_service` (
  `zone_service_id` int(11) NOT NULL,
  `zone_doc_id` int(11) NOT NULL DEFAULT 0,
  `user_car_id` int(11) NOT NULL DEFAULT 0,
  `service_provide` int(1) NOT NULL DEFAULT 0 COMMENT '0 = not provide, 1 = provide',
  `expiry_date` datetime NOT NULL DEFAULT current_timestamp(),
  `status_message` varchar(100) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '1 = active,',
  `created_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zone_wise_cars_service`
--

INSERT INTO `zone_wise_cars_service` (`zone_service_id`, `zone_doc_id`, `user_car_id`, `service_provide`, `expiry_date`, `status_message`, `status`, `created_date`) VALUES
(1, 1, 1, 1, '2026-02-10 10:36:51', '', 1, '2024-02-05 10:40:33');

-- --------------------------------------------------------

--
-- Table structure for table `zone_wise_doc_link`
--

CREATE TABLE `zone_wise_doc_link` (
  `zone_link_id` int(11) NOT NULL,
  `zone_doc_id` int(11) NOT NULL DEFAULT 0,
  `driver_doc_id` int(11) NOT NULL DEFAULT 0,
  `user_car_id` int(11) NOT NULL DEFAULT 0,
  `doc_status` int(11) NOT NULL DEFAULT 0 COMMENT '0 = new, 1 = delete, 2 = app 3 =unapprov, 4 = expiry in 15, 5 = expired',
  `linked_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zone_wise_doc_link`
--

INSERT INTO `zone_wise_doc_link` (`zone_link_id`, `zone_doc_id`, `driver_doc_id`, `user_car_id`, `doc_status`, `linked_date`) VALUES
(4, 1, 16, 1, 0, '2024-04-30 23:57:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bank_detail`
--
ALTER TABLE `bank_detail`
  ADD PRIMARY KEY (`bank_id`);

--
-- Indexes for table `booking_detail`
--
ALTER TABLE `booking_detail`
  ADD PRIMARY KEY (`booking_id`);

--
-- Indexes for table `car_brand`
--
ALTER TABLE `car_brand`
  ADD PRIMARY KEY (`brand_id`);

--
-- Indexes for table `car_model`
--
ALTER TABLE `car_model`
  ADD PRIMARY KEY (`model_id`);

--
-- Indexes for table `car_series`
--
ALTER TABLE `car_series`
  ADD PRIMARY KEY (`series_id`);

--
-- Indexes for table `chat_delete`
--
ALTER TABLE `chat_delete`
  ADD PRIMARY KEY (`d_id`);

--
-- Indexes for table `chat_message`
--
ALTER TABLE `chat_message`
  ADD PRIMARY KEY (`chat_id`);

--
-- Indexes for table `contact_us_detail`
--
ALTER TABLE `contact_us_detail`
  ADD PRIMARY KEY (`contact_id`);

--
-- Indexes for table `crad_payment`
--
ALTER TABLE `crad_payment`
  ADD PRIMARY KEY (`app_txn_id`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`doc_id`);

--
-- Indexes for table `driver_document`
--
ALTER TABLE `driver_document`
  ADD PRIMARY KEY (`driver_doc_id`);

--
-- Indexes for table `payment_detail`
--
ALTER TABLE `payment_detail`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indexes for table `price_detail`
--
ALTER TABLE `price_detail`
  ADD PRIMARY KEY (`price_id`);

--
-- Indexes for table `request_detail`
--
ALTER TABLE `request_detail`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `service_detail`
--
ALTER TABLE `service_detail`
  ADD PRIMARY KEY (`service_id`);

--
-- Indexes for table `subscription_plan`
--
ALTER TABLE `subscription_plan`
  ADD PRIMARY KEY (`plan_id`);

--
-- Indexes for table `user_address`
--
ALTER TABLE `user_address`
  ADD PRIMARY KEY (`address_id`);

--
-- Indexes for table `user_cars`
--
ALTER TABLE `user_cars`
  ADD PRIMARY KEY (`user_car_id`);

--
-- Indexes for table `user_detail`
--
ALTER TABLE `user_detail`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_notification`
--
ALTER TABLE `user_notification`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`wallet_id`);

--
-- Indexes for table `zone_document`
--
ALTER TABLE `zone_document`
  ADD PRIMARY KEY (`zone_doc_id`);

--
-- Indexes for table `zone_list`
--
ALTER TABLE `zone_list`
  ADD PRIMARY KEY (`zone_id`);

--
-- Indexes for table `zone_wise_cars_service`
--
ALTER TABLE `zone_wise_cars_service`
  ADD PRIMARY KEY (`zone_service_id`);

--
-- Indexes for table `zone_wise_doc_link`
--
ALTER TABLE `zone_wise_doc_link`
  ADD PRIMARY KEY (`zone_link_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bank_detail`
--
ALTER TABLE `bank_detail`
  MODIFY `bank_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `booking_detail`
--
ALTER TABLE `booking_detail`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `car_brand`
--
ALTER TABLE `car_brand`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `car_model`
--
ALTER TABLE `car_model`
  MODIFY `model_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `car_series`
--
ALTER TABLE `car_series`
  MODIFY `series_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `chat_delete`
--
ALTER TABLE `chat_delete`
  MODIFY `d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chat_message`
--
ALTER TABLE `chat_message`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `contact_us_detail`
--
ALTER TABLE `contact_us_detail`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crad_payment`
--
ALTER TABLE `crad_payment`
  MODIFY `app_txn_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `doc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `driver_document`
--
ALTER TABLE `driver_document`
  MODIFY `driver_doc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `payment_detail`
--
ALTER TABLE `payment_detail`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `price_detail`
--
ALTER TABLE `price_detail`
  MODIFY `price_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `request_detail`
--
ALTER TABLE `request_detail`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_detail`
--
ALTER TABLE `service_detail`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `subscription_plan`
--
ALTER TABLE `subscription_plan`
  MODIFY `plan_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_address`
--
ALTER TABLE `user_address`
  MODIFY `address_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_cars`
--
ALTER TABLE `user_cars`
  MODIFY `user_car_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_detail`
--
ALTER TABLE `user_detail`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_notification`
--
ALTER TABLE `user_notification`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wallet`
--
ALTER TABLE `wallet`
  MODIFY `wallet_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zone_document`
--
ALTER TABLE `zone_document`
  MODIFY `zone_doc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `zone_list`
--
ALTER TABLE `zone_list`
  MODIFY `zone_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `zone_wise_cars_service`
--
ALTER TABLE `zone_wise_cars_service`
  MODIFY `zone_service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `zone_wise_doc_link`
--
ALTER TABLE `zone_wise_doc_link`
  MODIFY `zone_link_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
