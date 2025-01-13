-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 26, 2024 at 08:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gtg`
--

-- --------------------------------------------------------

--
-- Table structure for table `bags`
--

CREATE TABLE `bags` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `pickUpTimeStart` datetime DEFAULT NULL,
  `pickUpTimeEnd` datetime DEFAULT NULL,
  `priceBefore` decimal(10,2) DEFAULT NULL,
  `priceAfter` decimal(10,2) DEFAULT NULL,
  `addedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `partner_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bags`
--

INSERT INTO `bags` (`id`, `name`, `description`, `quantity`, `pickUpTimeStart`, `pickUpTimeEnd`, `priceBefore`, `priceAfter`, `addedAt`, `partner_id`) VALUES
(1, 'Bag of Fresh Apples', 'A bag of fresh, organic apples for sale.', 50, '2024-11-30 12:00:00', NULL, 30.00, 25.00, '2024-11-25 18:31:59', 1),
(2, 'Grocery Bag', 'A grocery bag filled with essentials like milk, bread, and eggs.', 100, '2024-11-30 14:00:00', NULL, 20.00, 18.00, '2024-11-25 18:31:59', 2),
(3, 'Gourmet Bread Basket', 'A basket of assorted gourmet breads including sourdough and baguettes.', 30, '2024-11-30 10:00:00', NULL, 15.00, 12.00, '2024-11-25 18:31:59', 4),
(4, 'Luxury Coffee Beans', 'Premium coffee beans freshly ground for a rich brew.', 70, '2024-11-30 09:00:00', NULL, 40.00, 35.00, '2024-11-25 18:31:59', 3),
(5, 'Organic Vegetables', 'Fresh organic vegetables straight from the farm.', 80, '2024-11-30 13:00:00', NULL, 25.00, 20.00, '2024-11-25 18:31:59', 5),
(6, 'burger bag', '1 delicious burger & 1 Pepsi can', 4, '2024-11-26 09:23:00', NULL, 100.00, 50.00, '2024-11-26 07:18:33', 1),
(7, 'burger bag', '1 delicious burger & 1 Pepsi can', 4, '2024-11-26 09:23:00', NULL, 100.00, 50.00, '2024-11-26 07:21:40', 1),
(8, 'burger bag', '1 delicious burger & 1 Pepsi can', 4, '2024-11-26 09:23:00', NULL, 100.00, 50.00, '2024-11-26 07:23:00', 1),
(9, 'taha', 'retty', 5, '2024-11-26 09:24:00', NULL, 56.00, 4.00, '2024-11-26 07:24:36', 1),
(10, 'potato', 'rt', 1, '2024-11-21 09:31:00', NULL, 300.00, 100.00, '2024-11-26 07:32:04', 2),
(11, 'potato', 'rt', 1, '2024-11-21 09:31:00', NULL, 300.00, 100.00, '2024-11-26 07:34:02', 2),
(12, 'ytyui', 'truytu', 1, '2024-11-26 09:37:00', NULL, 667.00, 567.00, '2024-11-26 07:37:34', 2),
(13, 'gfhhg', 'ggfjhj', 1, '4345-05-06 17:06:00', NULL, 77.00, 56.00, '2024-11-26 07:39:57', 2),
(14, 'gfhhg', 'ggfjhj', 1, '4345-05-06 17:06:00', NULL, 77.00, 56.00, '2024-11-26 07:41:47', 2),
(15, 'gfhhg', 'ggfjhj', 1, '4345-05-06 17:06:00', NULL, 77.00, 56.00, '2024-11-26 07:43:38', 2),
(16, 'gfhhg', 'ggfjhj', 1, '4345-05-06 17:06:00', NULL, 77.00, 56.00, '2024-11-26 07:46:16', 2),
(17, 'TAHA Moataz Ali ', 'dfd', 1, '2024-11-26 20:50:00', '2024-11-26 23:38:00', 200.00, 100.00, '2024-11-26 09:40:12', 2),
(18, 'taha', 'fgdf', 1, '2024-11-16 14:16:00', '2024-11-01 14:16:00', 45.00, 345.00, '2024-11-26 12:16:42', 5),
(19, 'soap', 'weerrtyruy', 12, '2024-11-28 04:12:00', '2024-11-26 18:12:00', 300.00, 200.00, '2024-11-26 14:12:45', 1),
(20, 'glb;gmfnfhj', 'dfghfjhgj', 1, '2024-11-26 16:21:00', '2024-11-26 16:18:00', 5563.00, 4563456.00, '2024-11-26 14:16:59', 1);

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `sender_id`, `message`, `created_at`) VALUES
(3, 3, 'wetre', '2024-11-25 20:03:48'),
(4, 2, 'ertyryu', '2024-11-25 20:09:34'),
(5, 2, 'rrtyurty', '2024-11-25 20:10:11'),
(6, 2, 'retyru', '2024-11-25 20:11:05'),
(7, 5, 'sfddf', '2024-11-26 12:23:15'),
(8, 5, 'gtryrjtyu', '2024-11-26 14:00:28'),
(9, 5, 'dsgfdg', '2024-11-26 18:56:51');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(20) NOT NULL,
  `order_id` int(11) NOT NULL,
  `partner_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('paid','unpaid','cancelled') DEFAULT 'unpaid',
  `issued_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `due_date` date NOT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoice_number`, `order_id`, `partner_id`, `amount`, `status`, `issued_at`, `due_date`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, '222', 1, 1, 200.00, 'paid', '2024-11-26 14:39:08', '2024-11-30', '2024-11-21 14:39:08', '2024-11-26 14:40:14', '2024-11-26 14:42:10');

-- --------------------------------------------------------

--
-- Stand-in structure for view `invoice_details`
-- (See below for the actual view)
--
CREATE TABLE `invoice_details` (
`invoice_id` int(11)
,`invoice_number` varchar(20)
,`amount` decimal(10,2)
,`status` enum('paid','unpaid','cancelled')
,`issued_at` timestamp
,`due_date` date
,`paid_at` timestamp
,`order_id` int(11)
,`order_code` varchar(20)
,`partner_name` varchar(100)
);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `status` enum('reserved','pickup','cancelled') NOT NULL,
  `orderQuantity` int(11) NOT NULL,
  `orderCode` varchar(20) DEFAULT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `addedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `bag_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `partner_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `status`, `orderQuantity`, `orderCode`, `totalPrice`, `addedAt`, `bag_id`, `user_id`, `partner_id`) VALUES
(1, 'pickup', 20, '#46573', 200.00, '2024-11-26 14:33:53', 1, 2, 1);

--
-- Triggers `orders`
--
DELIMITER $$
CREATE TRIGGER `update_invoice_status` AFTER UPDATE ON `orders` FOR EACH ROW BEGIN
    IF NEW.status = 'pickup' THEN
        UPDATE invoices
        SET status = 'paid'
        WHERE invoices.order_id = NEW.id;
    ELSE
        UPDATE invoices
        SET status = 'unpaid'
        WHERE invoices.order_id = NEW.id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `order_details`
-- (See below for the actual view)
--
CREATE TABLE `order_details` (
`order_id` int(11)
,`status` enum('reserved','pickup','cancelled')
,`orderQuantity` int(11)
,`orderCode` varchar(20)
,`totalPrice` decimal(10,2)
,`addedAt` timestamp
,`user_name` varchar(50)
,`partner_name` varchar(100)
,`bag_name` varchar(100)
);

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `id` int(11) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `number` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `location` point DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `partners`
--

INSERT INTO `partners` (`id`, `photo`, `name`, `email`, `category`, `number`, `password`, `address`, `zip_code`, `city`, `country`, `location`) VALUES
(1, 'partner1.jpg', 'John Doe', 'john.doe@example.com', 'Restaurant', '+1234567890', '1', '123 Main St', '10001', 'New York', 'USA', 0x0000000001010000005e4bc8073d5b4440aaf1d24d628052c0),
(2, 'partner2.jpg', 'Alice Smith', 'alice.smith@example.com', 'Grocery Store', '+1987654321', 'hashed_password_2', '456 Oak St', '20002', 'Los Angeles', 'USA', 0x000000000101000000f46c567dae0641404182e2c7988f5dc0),
(3, 'partner3.jpg', 'Bob Johnson', 'bob.johnson@example.com', 'Cafe', '+1122334455', 'hashed_password_3', '789 Pine St', '30003', 'Chicago', 'USA', 0x0000000001010000000e4faf9465f0444055c1a8a44ee855c0),
(4, 'partner4.jpg', 'Emily Davis', 'emily.davis@example.com', 'Bakery', '+1456789123', 'hashed_password_4', '101 Maple St', '40004', 'San Francisco', 'USA', 0x000000000101000000d0d556ec2fe3424050fc1873d79a5ec0),
(5, 'partner5.jpg', 'Michael Brown', 'tahamoataz5@gmail.com', 'Retail', '+1555443322', '123', '202 Birch St', '50005', 'Miami', 'USA', 0x000000000101000000fb5c6dc5fec23940dcd78173460c54c0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `photo`, `firstName`, `lastName`, `email`, `password`, `age`, `birthdate`, `gender`) VALUES
(1, NULL, 'John', 'Doe', 'john.doe@example.com', 'password123', 30, '1993-05-15', 'male'),
(2, NULL, 'Jane', 'Smith', 'jane.smith@example.com', 'password456', 25, '1998-08-22', 'female');

-- --------------------------------------------------------

--
-- Structure for view `invoice_details`
--
DROP TABLE IF EXISTS `invoice_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `invoice_details`  AS SELECT `invoices`.`id` AS `invoice_id`, `invoices`.`invoice_number` AS `invoice_number`, `invoices`.`amount` AS `amount`, `invoices`.`status` AS `status`, `invoices`.`issued_at` AS `issued_at`, `invoices`.`due_date` AS `due_date`, `invoices`.`paid_at` AS `paid_at`, `orders`.`id` AS `order_id`, `orders`.`orderCode` AS `order_code`, `partners`.`name` AS `partner_name` FROM ((`invoices` join `orders` on(`invoices`.`order_id` = `orders`.`id`)) join `partners` on(`invoices`.`partner_id` = `partners`.`id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `order_details`
--
DROP TABLE IF EXISTS `order_details`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `order_details`  AS SELECT `orders`.`id` AS `order_id`, `orders`.`status` AS `status`, `orders`.`orderQuantity` AS `orderQuantity`, `orders`.`orderCode` AS `orderCode`, `orders`.`totalPrice` AS `totalPrice`, `orders`.`addedAt` AS `addedAt`, `users`.`firstName` AS `user_name`, `partners`.`name` AS `partner_name`, `bags`.`name` AS `bag_name` FROM (((`orders` join `users` on(`orders`.`user_id` = `users`.`id`)) join `partners` on(`orders`.`partner_id` = `partners`.`id`)) join `bags` on(`orders`.`bag_id` = `bags`.`id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bags`
--
ALTER TABLE `bags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `partner_id` (`partner_id`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `partner_id` (`partner_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderCode` (`orderCode`),
  ADD KEY `bag_id` (`bag_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `partner_id` (`partner_id`);

--
-- Indexes for table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bags`
--
ALTER TABLE `bags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `partners`
--
ALTER TABLE `partners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bags`
--
ALTER TABLE `bags`
  ADD CONSTRAINT `bags_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `complaints`
--
ALTER TABLE `complaints`
  ADD CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `partners` (`id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`bag_id`) REFERENCES `bags` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
