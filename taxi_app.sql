-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 11, 2023 at 05:30 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.0

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '0 = send, 1= receive, 2= view , 3 = sender delete, 4 = receiver delete, 5 = all delete',
  `message_type` int(1) NOT NULL DEFAULT 1 COMMENT '0 = text, 1 = file'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payment_detail`
--

CREATE TABLE `payment_detail` (
  `payment_id` int(11) NOT NULL,
  `card_id` int(11) NOT NULL DEFAULT 0,
  `payment_type` int(1) NOT NULL DEFAULT 1,
  `amt` varchar(25) NOT NULL DEFAULT '0',
  `discount_amt` varchar(25) NOT NULL DEFAULT '0',
  `driver_amt` varchar(25) NOT NULL DEFAULT '0',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `cancel_change` varchar(20) NOT NULL DEFAULT '0',
  `tax` varchar(20) NOT NULL DEFAULT '0',
  `status` int(1) NOT NULL DEFAULT 1,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_cars`
--

CREATE TABLE `user_cars` (
  `user_car_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `service_id` varchar(100) NOT NULL DEFAULT '',
  `car_number` varchar(30) NOT NULL DEFAULT '',
  `car_image` varchar(100) NOT NULL DEFAULT '',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = new added, 1= approved, 2 = delete',
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `select_service_id` int(11) NOT NULL DEFAULT 0,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
-- Indexes for table `chat_message`
--
ALTER TABLE `chat_message`
  ADD PRIMARY KEY (`chat_id`);

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
  MODIFY `bank_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_detail`
--
ALTER TABLE `booking_detail`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `car_brand`
--
ALTER TABLE `car_brand`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `car_model`
--
ALTER TABLE `car_model`
  MODIFY `model_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `car_series`
--
ALTER TABLE `car_series`
  MODIFY `series_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_message`
--
ALTER TABLE `chat_message`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `crad_payment`
--
ALTER TABLE `crad_payment`
  MODIFY `app_txn_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `doc_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `driver_document`
--
ALTER TABLE `driver_document`
  MODIFY `driver_doc_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_detail`
--
ALTER TABLE `payment_detail`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `price_detail`
--
ALTER TABLE `price_detail`
  MODIFY `price_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `request_detail`
--
ALTER TABLE `request_detail`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_detail`
--
ALTER TABLE `service_detail`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `user_car_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_detail`
--
ALTER TABLE `user_detail`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `zone_doc_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zone_list`
--
ALTER TABLE `zone_list`
  MODIFY `zone_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zone_wise_cars_service`
--
ALTER TABLE `zone_wise_cars_service`
  MODIFY `zone_service_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zone_wise_doc_link`
--
ALTER TABLE `zone_wise_doc_link`
  MODIFY `zone_link_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
