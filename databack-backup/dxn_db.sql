-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 10, 2026 at 06:39 AM
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
-- Database: `dxn_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `line1` varchar(191) NOT NULL,
  `country` varchar(191) NOT NULL DEFAULT 'Nepal',
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `addressType` enum('HOME','OFFICE','OTHER') NOT NULL DEFAULT 'HOME',
  `landmark` varchar(191) DEFAULT NULL,
  `municipalityId` int(11) NOT NULL,
  `provinceId` int(11) NOT NULL,
  `wardNo` int(11) NOT NULL,
  `districtId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`id`, `userId`, `fullName`, `phone`, `line1`, `country`, `isDefault`, `createdAt`, `updatedAt`, `addressType`, `landmark`, `municipalityId`, `provinceId`, `wardNo`, `districtId`) VALUES
(1, 3, 'Bikesh Kumar Gupta', '9876452312', 'Kathmandu', 'Nepal', 1, '2026-08-07 16:46:27.659', '2026-08-09 09:33:54.255', 'HOME', NULL, 391, 3, 1, 34),
(3, 1, 'Test User', '9800000000', 'Test Tole Street', 'Nepal', 1, '2026-08-09 07:09:53.017', '2026-08-09 07:09:53.017', 'OFFICE', 'Near Test Landmark', 358, 3, 1, 30),
(4, 1, 'District Test', '9811111111', 'Lakeside Road', 'Nepal', 0, '2026-08-09 08:33:53.550', '2026-08-09 08:33:53.550', 'HOME', NULL, 498, 4, 1, 45),
(5, 1, 'Kathmandu Override Test', '9822222222', 'New Baneshwor', 'Nepal', 0, '2026-08-09 09:14:02.593', '2026-08-09 09:14:02.593', 'HOME', NULL, 391, 3, 1, 34);

-- --------------------------------------------------------

--
-- Table structure for table `addressbook`
--

CREATE TABLE `addressbook` (
  `id` int(11) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `level` enum('PROVINCE','DISTRICT','MUNICIPALITY') NOT NULL,
  `name` varchar(191) NOT NULL,
  `municipalityType` enum('METROPOLITAN','SUB_METROPOLITAN','MUNICIPALITY','RURAL_MUNICIPALITY') DEFAULT NULL,
  `wardCount` int(11) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addressbook`
--

INSERT INTO `addressbook` (`id`, `parentId`, `level`, `name`, `municipalityType`, `wardCount`, `sortOrder`, `createdAt`) VALUES
(1, NULL, 'PROVINCE', 'Koshi Province', NULL, NULL, 0, '2026-08-09 07:03:34.118'),
(2, NULL, 'PROVINCE', 'Madhesh Province', NULL, NULL, 0, '2026-08-09 07:03:34.135'),
(3, NULL, 'PROVINCE', 'Bagmati Province', NULL, NULL, 0, '2026-08-09 07:03:34.153'),
(4, NULL, 'PROVINCE', 'Gandaki Province', NULL, NULL, 0, '2026-08-09 07:03:34.243'),
(5, NULL, 'PROVINCE', 'Lumbini Province', NULL, NULL, 0, '2026-08-09 07:03:34.310'),
(6, NULL, 'PROVINCE', 'Karnali Province', NULL, NULL, 0, '2026-08-09 07:03:34.362'),
(7, NULL, 'PROVINCE', 'Sudurpaschim Province', NULL, NULL, 0, '2026-08-09 07:03:34.408'),
(8, 1, 'DISTRICT', 'Bhojpur', NULL, NULL, 0, '2026-08-09 07:03:34.425'),
(9, 1, 'DISTRICT', 'Dhankuta', NULL, NULL, 0, '2026-08-09 07:03:34.465'),
(10, 1, 'DISTRICT', 'Ilam', NULL, NULL, 0, '2026-08-09 07:03:34.492'),
(11, 1, 'DISTRICT', 'Jhapa', NULL, NULL, 0, '2026-08-09 07:03:34.531'),
(12, 1, 'DISTRICT', 'Khotang', NULL, NULL, 0, '2026-08-09 07:03:34.557'),
(13, 1, 'DISTRICT', 'Morang', NULL, NULL, 0, '2026-08-09 07:03:34.592'),
(14, 1, 'DISTRICT', 'Okhaldhunga', NULL, NULL, 0, '2026-08-09 07:03:34.628'),
(15, 1, 'DISTRICT', 'Pachthar', NULL, NULL, 0, '2026-08-09 07:03:34.662'),
(16, 1, 'DISTRICT', 'Sankhuwasabha', NULL, NULL, 0, '2026-08-09 07:03:34.689'),
(17, 1, 'DISTRICT', 'Solukhumbu', NULL, NULL, 0, '2026-08-09 07:03:34.741'),
(18, 1, 'DISTRICT', 'Sunsari', NULL, NULL, 0, '2026-08-09 07:03:34.769'),
(19, 1, 'DISTRICT', 'Taplejung', NULL, NULL, 0, '2026-08-09 07:03:34.816'),
(20, 1, 'DISTRICT', 'Terhathum', NULL, NULL, 0, '2026-08-09 07:03:34.867'),
(21, 1, 'DISTRICT', 'Udayapur', NULL, NULL, 0, '2026-08-09 07:03:34.948'),
(22, 2, 'DISTRICT', 'Parsa', NULL, NULL, 0, '2026-08-09 07:03:34.969'),
(23, 2, 'DISTRICT', 'Bara', NULL, NULL, 0, '2026-08-09 07:03:35.003'),
(24, 2, 'DISTRICT', 'Rautahat', NULL, NULL, 0, '2026-08-09 07:03:35.028'),
(25, 2, 'DISTRICT', 'Sarlahi', NULL, NULL, 0, '2026-08-09 07:03:35.068'),
(26, 2, 'DISTRICT', 'Siraha', NULL, NULL, 0, '2026-08-09 07:03:35.127'),
(27, 2, 'DISTRICT', 'Dhanusha', NULL, NULL, 0, '2026-08-09 07:03:35.409'),
(28, 2, 'DISTRICT', 'Saptari', NULL, NULL, 0, '2026-08-09 07:03:35.451'),
(29, 2, 'DISTRICT', 'Mahottari', NULL, NULL, 0, '2026-08-09 07:03:35.486'),
(30, 3, 'DISTRICT', 'Bhaktapur', NULL, NULL, 0, '2026-08-09 07:03:35.512'),
(31, 3, 'DISTRICT', 'Chitwan', NULL, NULL, 0, '2026-08-09 07:03:35.551'),
(32, 3, 'DISTRICT', 'Dhading', NULL, NULL, 0, '2026-08-09 07:03:35.575'),
(33, 3, 'DISTRICT', 'Dolakha', NULL, NULL, 0, '2026-08-09 07:03:35.615'),
(34, 3, 'DISTRICT', 'Kathmandu', NULL, NULL, 0, '2026-08-09 07:03:35.642'),
(35, 3, 'DISTRICT', 'Kavrepalanchok', NULL, NULL, 0, '2026-08-09 07:03:35.679'),
(36, 3, 'DISTRICT', 'Lalitpur', NULL, NULL, 0, '2026-08-09 07:03:35.717'),
(37, 3, 'DISTRICT', 'Makwanpur', NULL, NULL, 0, '2026-08-09 07:03:35.753'),
(38, 3, 'DISTRICT', 'Nuwakot', NULL, NULL, 0, '2026-08-09 07:03:35.781'),
(39, 3, 'DISTRICT', 'Ramechap', NULL, NULL, 0, '2026-08-09 07:03:35.825'),
(40, 3, 'DISTRICT', 'Rasuwa', NULL, NULL, 0, '2026-08-09 07:03:35.852'),
(41, 3, 'DISTRICT', 'Sindhuli', NULL, NULL, 0, '2026-08-09 07:03:35.878'),
(42, 3, 'DISTRICT', 'Sindhupalchok', NULL, NULL, 0, '2026-08-09 07:03:35.920'),
(43, 4, 'DISTRICT', 'Baglung', NULL, NULL, 0, '2026-08-09 07:03:35.942'),
(44, 4, 'DISTRICT', 'Gorkha', NULL, NULL, 0, '2026-08-09 07:03:35.983'),
(45, 4, 'DISTRICT', 'Kaski', NULL, NULL, 0, '2026-08-09 07:03:36.030'),
(46, 4, 'DISTRICT', 'Lamjung', NULL, NULL, 0, '2026-08-09 07:03:36.708'),
(47, 4, 'DISTRICT', 'Manang', NULL, NULL, 0, '2026-08-09 07:03:36.771'),
(48, 4, 'DISTRICT', 'Mustang', NULL, NULL, 0, '2026-08-09 07:03:36.860'),
(49, 4, 'DISTRICT', 'Myagdi', NULL, NULL, 0, '2026-08-09 07:03:36.944'),
(50, 4, 'DISTRICT', 'Nawalpur', NULL, NULL, 0, '2026-08-09 07:03:37.476'),
(51, 4, 'DISTRICT', 'Parwat', NULL, NULL, 0, '2026-08-09 07:03:38.007'),
(52, 4, 'DISTRICT', 'Syangja', NULL, NULL, 0, '2026-08-09 07:03:38.470'),
(53, 4, 'DISTRICT', 'Tanahun', NULL, NULL, 0, '2026-08-09 07:03:38.602'),
(54, 5, 'DISTRICT', 'Kapilvastu', NULL, NULL, 0, '2026-08-09 07:03:38.800'),
(55, 5, 'DISTRICT', 'Parasi', NULL, NULL, 0, '2026-08-09 07:03:38.932'),
(56, 5, 'DISTRICT', 'Rupandehi', NULL, NULL, 0, '2026-08-09 07:03:39.115'),
(57, 5, 'DISTRICT', 'Arghakhanchi', NULL, NULL, 0, '2026-08-09 07:03:39.234'),
(58, 5, 'DISTRICT', 'Gulmi', NULL, NULL, 0, '2026-08-09 07:03:39.348'),
(59, 5, 'DISTRICT', 'Palpa', NULL, NULL, 0, '2026-08-09 07:03:39.484'),
(60, 5, 'DISTRICT', 'Dang', NULL, NULL, 0, '2026-08-09 07:03:39.589'),
(61, 5, 'DISTRICT', 'Pyuthan', NULL, NULL, 0, '2026-08-09 07:03:39.740'),
(62, 5, 'DISTRICT', 'Rolpa', NULL, NULL, 0, '2026-08-09 07:03:39.796'),
(63, 5, 'DISTRICT', 'Eastern Rukum', NULL, NULL, 0, '2026-08-09 07:03:39.936'),
(64, 5, 'DISTRICT', 'Banke', NULL, NULL, 0, '2026-08-09 07:03:39.960'),
(65, 5, 'DISTRICT', 'Bardiya', NULL, NULL, 0, '2026-08-09 07:03:39.980'),
(66, 6, 'DISTRICT', 'Western Rukum', NULL, NULL, 0, '2026-08-09 07:03:40.005'),
(67, 6, 'DISTRICT', 'Salyan', NULL, NULL, 0, '2026-08-09 07:03:40.026'),
(68, 6, 'DISTRICT', 'Dolpa', NULL, NULL, 0, '2026-08-09 07:03:40.054'),
(69, 6, 'DISTRICT', 'Humla', NULL, NULL, 0, '2026-08-09 07:03:40.074'),
(70, 6, 'DISTRICT', 'Jumla', NULL, NULL, 0, '2026-08-09 07:03:40.098'),
(71, 6, 'DISTRICT', 'Kalikot', NULL, NULL, 0, '2026-08-09 07:03:40.130'),
(72, 6, 'DISTRICT', 'Mugu', NULL, NULL, 0, '2026-08-09 07:03:40.223'),
(73, 6, 'DISTRICT', 'Surkhet', NULL, NULL, 0, '2026-08-09 07:03:40.258'),
(74, 6, 'DISTRICT', 'Dailekh', NULL, NULL, 0, '2026-08-09 07:03:40.287'),
(75, 6, 'DISTRICT', 'Jajarkot', NULL, NULL, 0, '2026-08-09 07:03:40.311'),
(76, 7, 'DISTRICT', 'Darchula', NULL, NULL, 0, '2026-08-09 07:03:40.337'),
(77, 7, 'DISTRICT', 'Bajhang', NULL, NULL, 0, '2026-08-09 07:03:40.369'),
(78, 7, 'DISTRICT', 'Bajura', NULL, NULL, 0, '2026-08-09 07:03:40.394'),
(79, 7, 'DISTRICT', 'Baitadi', NULL, NULL, 0, '2026-08-09 07:03:40.430'),
(80, 7, 'DISTRICT', 'Doti', NULL, NULL, 0, '2026-08-09 07:03:40.515'),
(81, 7, 'DISTRICT', 'Acham', NULL, NULL, 0, '2026-08-09 07:03:40.549'),
(82, 7, 'DISTRICT', 'Dadeldhura', NULL, NULL, 0, '2026-08-09 07:03:40.576'),
(83, 7, 'DISTRICT', 'Kanchanpur', NULL, NULL, 0, '2026-08-09 07:03:40.604'),
(84, 7, 'DISTRICT', 'Kailali', NULL, NULL, 0, '2026-08-09 07:03:40.630'),
(85, 8, 'MUNICIPALITY', 'Shadanand Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:40.704'),
(86, 8, 'MUNICIPALITY', 'Bhojpur Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:40.777'),
(87, 8, 'MUNICIPALITY', 'Hatuwagadhi Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:40.812'),
(88, 8, 'MUNICIPALITY', 'Ramprasad Rai Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:40.837'),
(89, 8, 'MUNICIPALITY', 'Aamchok Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:03:40.862'),
(90, 8, 'MUNICIPALITY', 'Tyamke Maiyum Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:40.892'),
(91, 8, 'MUNICIPALITY', 'Arun Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:40.971'),
(92, 8, 'MUNICIPALITY', 'Pauwadungma Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:40.998'),
(93, 8, 'MUNICIPALITY', 'Salpasilichho Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:41.032'),
(94, 9, 'MUNICIPALITY', 'Dhankuta Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:41.059'),
(95, 9, 'MUNICIPALITY', 'Pakhribas Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:41.104'),
(96, 9, 'MUNICIPALITY', 'Mahalaxmi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:41.123'),
(97, 9, 'MUNICIPALITY', 'Sangurigadhi Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:03:41.162'),
(98, 9, 'MUNICIPALITY', 'Chaubise Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:41.188'),
(99, 9, 'MUNICIPALITY', 'Sahidbhumi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:41.221'),
(100, 9, 'MUNICIPALITY', 'Chhathar Jorpati Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:41.244'),
(101, 10, 'MUNICIPALITY', 'Suryodaya Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:41.268'),
(102, 10, 'MUNICIPALITY', 'Ilam Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:41.298'),
(103, 10, 'MUNICIPALITY', 'Deumai Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:41.321'),
(104, 10, 'MUNICIPALITY', 'Maijogmai Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:41.358'),
(105, 10, 'MUNICIPALITY', 'Phakphokthum Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:41.411'),
(106, 10, 'MUNICIPALITY', 'Mai Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:41.482'),
(107, 10, 'MUNICIPALITY', 'Chulachuli Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:41.510'),
(108, 10, 'MUNICIPALITY', 'Rong Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:41.549'),
(109, 10, 'MUNICIPALITY', 'Mangsebung Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:41.614'),
(110, 10, 'MUNICIPALITY', 'Sandakpur Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:41.644'),
(111, 11, 'MUNICIPALITY', 'Mechinagar Municipality', 'MUNICIPALITY', 15, 0, '2026-08-09 07:03:41.681'),
(112, 11, 'MUNICIPALITY', 'Birtamod Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:41.743'),
(113, 11, 'MUNICIPALITY', 'Damak Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:41.791'),
(114, 11, 'MUNICIPALITY', 'Bhadrapur Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:41.818'),
(115, 11, 'MUNICIPALITY', 'Shivasatakshi Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:41.857'),
(116, 11, 'MUNICIPALITY', 'Arjundhara Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:41.883'),
(117, 11, 'MUNICIPALITY', 'Gauradaha Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:41.918'),
(118, 11, 'MUNICIPALITY', 'Kankai Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:41.946'),
(119, 11, 'MUNICIPALITY', 'Kamal Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:42.021'),
(120, 11, 'MUNICIPALITY', 'Buddha Shanti Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:42.071'),
(121, 11, 'MUNICIPALITY', 'Kachankawal Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:42.111'),
(122, 11, 'MUNICIPALITY', 'Jhapa Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:42.139'),
(123, 11, 'MUNICIPALITY', 'Barhadashi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:42.170'),
(124, 11, 'MUNICIPALITY', 'Gaurigunj Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:42.195'),
(125, 11, 'MUNICIPALITY', 'Haldibari Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:42.229'),
(126, 12, 'MUNICIPALITY', 'Diktel Rupakot Majhuwagadhi Municipality', 'MUNICIPALITY', 15, 0, '2026-08-09 07:03:42.255'),
(127, 12, 'MUNICIPALITY', 'Halesi Tuwachung Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:42.295'),
(128, 12, 'MUNICIPALITY', 'Khotehang Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:42.322'),
(129, 12, 'MUNICIPALITY', 'Diprung Chuichumma Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:42.358'),
(130, 12, 'MUNICIPALITY', 'Aiselukharka Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:42.386'),
(131, 12, 'MUNICIPALITY', 'Jantedhunga Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:42.423'),
(132, 12, 'MUNICIPALITY', 'Kepilasgadhi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:42.448'),
(133, 12, 'MUNICIPALITY', 'Barahpokhari Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:42.485'),
(134, 12, 'MUNICIPALITY', 'Rawa Besi Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:42.513'),
(135, 12, 'MUNICIPALITY', 'Sakela Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:42.550'),
(136, 13, 'MUNICIPALITY', 'Sundar Haraicha Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:42.597'),
(137, 13, 'MUNICIPALITY', 'Belbari Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:42.698'),
(138, 13, 'MUNICIPALITY', 'Pathari Shanischare Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:42.743'),
(139, 13, 'MUNICIPALITY', 'Ratuwamai Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:42.845'),
(140, 13, 'MUNICIPALITY', 'Urlabari Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:42.949'),
(141, 13, 'MUNICIPALITY', 'Rangeli Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:43.003'),
(142, 13, 'MUNICIPALITY', 'Sunawarshi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:43.167'),
(143, 13, 'MUNICIPALITY', 'Letang Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:43.203'),
(144, 13, 'MUNICIPALITY', 'Biratnagar Metropolitan City', 'METROPOLITAN', 19, 0, '2026-08-09 07:03:43.241'),
(145, 13, 'MUNICIPALITY', 'Jahada Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:43.272'),
(146, 13, 'MUNICIPALITY', 'Budi Ganga Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:43.306'),
(147, 13, 'MUNICIPALITY', 'Katahari Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:43.333'),
(148, 13, 'MUNICIPALITY', 'Dhanpalthan Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:43.369'),
(149, 13, 'MUNICIPALITY', 'Kanepokhari Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:43.400'),
(150, 13, 'MUNICIPALITY', 'Gramthan Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:43.437'),
(151, 13, 'MUNICIPALITY', 'Kerabari Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:03:43.465'),
(152, 13, 'MUNICIPALITY', 'Miklajung Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:43.493'),
(153, 14, 'MUNICIPALITY', 'Siddhicharan Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:43.529'),
(154, 14, 'MUNICIPALITY', 'Khiji Demba Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:43.558'),
(155, 14, 'MUNICIPALITY', 'Chisankhugadhi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:43.599'),
(156, 14, 'MUNICIPALITY', 'Molung Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:43.630'),
(157, 14, 'MUNICIPALITY', 'Sunkoshi Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:03:43.668'),
(158, 14, 'MUNICIPALITY', 'Champadevi Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:03:43.732'),
(159, 14, 'MUNICIPALITY', 'Manebhanjyang Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:43.759'),
(160, 14, 'MUNICIPALITY', 'Likhu Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:43.799'),
(161, 15, 'MUNICIPALITY', 'Phidim Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:43.848'),
(162, 15, 'MUNICIPALITY', 'Miklajung Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:43.940'),
(163, 15, 'MUNICIPALITY', 'Phalgunanda Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:44.024'),
(164, 15, 'MUNICIPALITY', 'Hilihang Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:44.122'),
(165, 15, 'MUNICIPALITY', 'Phalelung Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:44.220'),
(166, 15, 'MUNICIPALITY', 'Yangwarak Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:44.336'),
(167, 15, 'MUNICIPALITY', 'Kummayak Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:44.375'),
(168, 15, 'MUNICIPALITY', 'Tumbewa Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:44.404'),
(169, 16, 'MUNICIPALITY', 'Khandbari Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:44.442'),
(170, 16, 'MUNICIPALITY', 'Chainpur Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:44.485'),
(171, 16, 'MUNICIPALITY', 'Dharmadevi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:44.511'),
(172, 16, 'MUNICIPALITY', 'Panchkhapan Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:44.533'),
(173, 16, 'MUNICIPALITY', 'Madi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:44.573'),
(174, 16, 'MUNICIPALITY', 'Makalu Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:44.601'),
(175, 16, 'MUNICIPALITY', 'Silichong Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:44.642'),
(176, 16, 'MUNICIPALITY', 'Sabhapokhari Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:44.673'),
(177, 16, 'MUNICIPALITY', 'Chichila Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:44.709'),
(178, 16, 'MUNICIPALITY', 'BhotKhola Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:44.771'),
(179, 17, 'MUNICIPALITY', 'Solu Dudhkunda Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:44.806'),
(180, 17, 'MUNICIPALITY', 'Mapya Dudhkoshi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:44.848'),
(181, 17, 'MUNICIPALITY', 'Necha Salyan Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:44.877'),
(182, 17, 'MUNICIPALITY', 'Thulung Dudhkoshi Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:44.909'),
(183, 17, 'MUNICIPALITY', 'Maha Kulung Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:44.945'),
(184, 17, 'MUNICIPALITY', 'Sotang Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:45.001'),
(185, 17, 'MUNICIPALITY', 'Khumbu PasangLhamu Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:45.050'),
(186, 17, 'MUNICIPALITY', 'Likhu Pike Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:45.085'),
(187, 18, 'MUNICIPALITY', 'BarahaKshetra Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:45.211'),
(188, 18, 'MUNICIPALITY', 'Inaruwa Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:45.320'),
(189, 18, 'MUNICIPALITY', 'Duhabi Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:45.388'),
(190, 18, 'MUNICIPALITY', 'Ramdhuni Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:45.453'),
(191, 18, 'MUNICIPALITY', 'Itahari Sub-Metropolitan City', 'SUB_METROPOLITAN', 20, 0, '2026-08-09 07:03:45.489'),
(192, 18, 'MUNICIPALITY', 'Dharan Sub-Metropolitan City', 'SUB_METROPOLITAN', 20, 0, '2026-08-09 07:03:45.520'),
(193, 18, 'MUNICIPALITY', 'Koshi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:45.558'),
(194, 18, 'MUNICIPALITY', 'Harinagar Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:45.582'),
(195, 18, 'MUNICIPALITY', 'Bhokraha Narsingh Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:45.622'),
(196, 18, 'MUNICIPALITY', 'Dewangunj Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:45.653'),
(197, 18, 'MUNICIPALITY', 'Gadhi Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:45.687'),
(198, 18, 'MUNICIPALITY', 'Barju Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:45.722'),
(199, 19, 'MUNICIPALITY', 'Phungling Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:45.763'),
(200, 19, 'MUNICIPALITY', 'Sirijangha Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:45.818'),
(201, 19, 'MUNICIPALITY', 'Aathrai Triveni Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:45.841'),
(202, 19, 'MUNICIPALITY', 'Pathibhara Yangwarak Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:45.875'),
(203, 19, 'MUNICIPALITY', 'Meringden Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:45.906'),
(204, 19, 'MUNICIPALITY', 'Sidingwa Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:45.942'),
(205, 19, 'MUNICIPALITY', 'Phaktanglung Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:45.978'),
(206, 19, 'MUNICIPALITY', 'Maiwa Khola Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:46.010'),
(207, 19, 'MUNICIPALITY', 'Mikwa Khola Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:46.039'),
(208, 20, 'MUNICIPALITY', 'Myanglung Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:46.072'),
(209, 20, 'MUNICIPALITY', 'Laligurans Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:46.100'),
(210, 20, 'MUNICIPALITY', 'Aathrai Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:46.141'),
(211, 20, 'MUNICIPALITY', 'Phedap Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:46.166'),
(212, 20, 'MUNICIPALITY', 'Chhathar Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:46.218'),
(213, 20, 'MUNICIPALITY', 'Menchayayem Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:46.243'),
(214, 21, 'MUNICIPALITY', 'Triyuga Municipality', 'MUNICIPALITY', 16, 0, '2026-08-09 07:03:46.286'),
(215, 21, 'MUNICIPALITY', 'Katari Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:46.312'),
(216, 21, 'MUNICIPALITY', 'Chaudandigadhi Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:46.408'),
(217, 21, 'MUNICIPALITY', 'Belaka Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:46.538'),
(218, 21, 'MUNICIPALITY', 'Udayapurgadhi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:46.639'),
(219, 21, 'MUNICIPALITY', 'Rautamai Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:46.699'),
(220, 21, 'MUNICIPALITY', 'Tapli Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:46.758'),
(221, 21, 'MUNICIPALITY', 'Limchungbung Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:46.797'),
(222, 22, 'MUNICIPALITY', 'Birgunj Metropolitan City', 'METROPOLITAN', 32, 0, '2026-08-09 07:03:46.856'),
(223, 22, 'MUNICIPALITY', 'Bahudarmai Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:46.887'),
(224, 22, 'MUNICIPALITY', 'Parsagadhi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:46.956'),
(225, 22, 'MUNICIPALITY', 'Pokhariya Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:46.989'),
(226, 22, 'MUNICIPALITY', 'Bindabasini Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:47.025'),
(227, 22, 'MUNICIPALITY', 'Dhobini Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:47.050'),
(228, 22, 'MUNICIPALITY', 'Chhipaharmai Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:47.090'),
(229, 22, 'MUNICIPALITY', 'Jagarnathpur Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:47.115'),
(230, 22, 'MUNICIPALITY', 'Jirabhawani Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:47.175'),
(231, 22, 'MUNICIPALITY', 'Kalikamai Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:47.219'),
(232, 22, 'MUNICIPALITY', 'Pakaha Mainpur Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:47.248'),
(233, 22, 'MUNICIPALITY', 'Paterwa Sugauli Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:47.288'),
(234, 22, 'MUNICIPALITY', 'Sakhuwa Prasauni Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:47.317'),
(235, 22, 'MUNICIPALITY', 'Thori Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:47.358'),
(236, 23, 'MUNICIPALITY', 'Kalaiya Sub-Metropolitan City', 'SUB_METROPOLITAN', 27, 0, '2026-08-09 07:03:47.389'),
(237, 23, 'MUNICIPALITY', 'Jitpur Simara Sub-Metropolitan City', 'SUB_METROPOLITAN', 24, 0, '2026-08-09 07:03:47.430'),
(238, 23, 'MUNICIPALITY', 'Kolhabi Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:47.460'),
(239, 23, 'MUNICIPALITY', 'Nijgadh Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:03:47.508'),
(240, 23, 'MUNICIPALITY', 'Mahagadhimai Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:47.628'),
(241, 23, 'MUNICIPALITY', 'Simaraungadh Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:47.803'),
(242, 23, 'MUNICIPALITY', 'Pacharauta Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:47.980'),
(243, 23, 'MUNICIPALITY', 'Pheta Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:48.043'),
(244, 23, 'MUNICIPALITY', 'Bishrampur Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:48.086'),
(245, 23, 'MUNICIPALITY', 'Prasauni Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:48.115'),
(246, 23, 'MUNICIPALITY', 'Adarsh Kotwal Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:48.146'),
(247, 23, 'MUNICIPALITY', 'Karaiyamai Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:48.212'),
(248, 23, 'MUNICIPALITY', 'Devtal Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:48.288'),
(249, 23, 'MUNICIPALITY', 'Parwanipur Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:48.336'),
(250, 23, 'MUNICIPALITY', 'Baragadhi Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:48.401'),
(251, 23, 'MUNICIPALITY', 'Suwarna Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:48.484'),
(252, 24, 'MUNICIPALITY', 'Baudhimai Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:48.524'),
(253, 24, 'MUNICIPALITY', 'Brindaban Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:48.552'),
(254, 24, 'MUNICIPALITY', 'Chandrapur Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:48.583'),
(255, 24, 'MUNICIPALITY', 'Dewahi Gonahi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:48.618'),
(256, 24, 'MUNICIPALITY', 'Gadhimai Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:48.647'),
(257, 24, 'MUNICIPALITY', 'Guruda Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:48.677'),
(258, 24, 'MUNICIPALITY', 'Gaur Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:48.749'),
(259, 24, 'MUNICIPALITY', 'Gujara Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:48.785'),
(260, 24, 'MUNICIPALITY', 'Ishanath Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:48.854'),
(261, 24, 'MUNICIPALITY', 'Katahariya Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:49.008'),
(262, 24, 'MUNICIPALITY', 'Madhav Narayan Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:49.195'),
(263, 24, 'MUNICIPALITY', 'Maulapur Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:49.267'),
(264, 24, 'MUNICIPALITY', 'Paroha Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:49.294'),
(265, 24, 'MUNICIPALITY', 'Phatuwa Bijayapur Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:49.333'),
(266, 24, 'MUNICIPALITY', 'Rajdevi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:49.371'),
(267, 24, 'MUNICIPALITY', 'Rajpur Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:49.411'),
(268, 24, 'MUNICIPALITY', 'Durga Bhagwati Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:49.439'),
(269, 24, 'MUNICIPALITY', 'Yamunamai Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:49.492'),
(270, 25, 'MUNICIPALITY', 'Bagmati Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:49.526'),
(271, 25, 'MUNICIPALITY', 'Balara Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:49.563'),
(272, 25, 'MUNICIPALITY', 'Barahathwa Municipality', 'MUNICIPALITY', 18, 0, '2026-08-09 07:03:49.603'),
(273, 25, 'MUNICIPALITY', 'Godaita Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:49.643'),
(274, 25, 'MUNICIPALITY', 'Hariwan Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:49.668'),
(275, 25, 'MUNICIPALITY', 'Haripur Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:49.710'),
(276, 25, 'MUNICIPALITY', 'Haripurwa Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:49.735'),
(277, 25, 'MUNICIPALITY', 'Ishowrpur Municipality', 'MUNICIPALITY', 15, 0, '2026-08-09 07:03:49.772'),
(278, 25, 'MUNICIPALITY', 'Kabilasi Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:49.804'),
(279, 25, 'MUNICIPALITY', 'Lalbandi Municipality', 'MUNICIPALITY', 17, 0, '2026-08-09 07:03:49.840'),
(280, 25, 'MUNICIPALITY', 'Malangawa Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:49.866'),
(281, 25, 'MUNICIPALITY', 'Basbariya Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:49.923'),
(282, 25, 'MUNICIPALITY', 'Bisnu Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:49.940'),
(283, 25, 'MUNICIPALITY', 'Brahampuri Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:49.965'),
(284, 25, 'MUNICIPALITY', 'Chakraghatta Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:49.994'),
(285, 25, 'MUNICIPALITY', 'Chandranagar Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:50.692'),
(286, 25, 'MUNICIPALITY', 'Dhankaul Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:50.850'),
(287, 25, 'MUNICIPALITY', 'Kaudena Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:50.912'),
(288, 25, 'MUNICIPALITY', 'Parsa Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:50.949'),
(289, 25, 'MUNICIPALITY', 'Ramnagar Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:50.978'),
(290, 26, 'MUNICIPALITY', 'Lahan Municipality', 'MUNICIPALITY', 24, 0, '2026-08-09 07:03:51.011'),
(291, 26, 'MUNICIPALITY', 'Dhangadhimai Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:51.036'),
(292, 26, 'MUNICIPALITY', 'Siraha Municipality', 'MUNICIPALITY', 22, 0, '2026-08-09 07:03:51.074'),
(293, 26, 'MUNICIPALITY', 'Golbazar Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:03:51.109'),
(294, 26, 'MUNICIPALITY', 'Mirchaiya Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:51.139'),
(295, 26, 'MUNICIPALITY', 'Kalyanpur Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:51.187'),
(296, 26, 'MUNICIPALITY', 'Karjanha Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:51.254'),
(297, 26, 'MUNICIPALITY', 'Sukhipur Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:51.285'),
(298, 26, 'MUNICIPALITY', 'Bhagwanpur Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:51.323'),
(299, 26, 'MUNICIPALITY', 'Aurahi Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:51.371'),
(300, 26, 'MUNICIPALITY', 'Bishnupur Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:51.401'),
(301, 26, 'MUNICIPALITY', 'Bariyarpatti Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:51.447'),
(302, 26, 'MUNICIPALITY', 'Lakshmipur Patari Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:51.476'),
(303, 26, 'MUNICIPALITY', 'Naraha Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:51.518'),
(304, 26, 'MUNICIPALITY', 'SakhuwanankarKatti Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:51.552'),
(305, 26, 'MUNICIPALITY', 'Arnama Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:51.589'),
(306, 26, 'MUNICIPALITY', 'Navarajpur Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:51.617'),
(307, 27, 'MUNICIPALITY', 'Janakpurdham Sub-Metropolitan City', 'SUB_METROPOLITAN', 25, 0, '2026-08-09 07:03:51.655'),
(308, 27, 'MUNICIPALITY', 'Chhireshwarnath Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:51.684'),
(309, 27, 'MUNICIPALITY', 'Ganeshman Charnath Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:51.708'),
(310, 27, 'MUNICIPALITY', 'Dhanushadham Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:51.738'),
(311, 27, 'MUNICIPALITY', 'Nagarain Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:51.773'),
(312, 27, 'MUNICIPALITY', 'Bideha Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:51.798'),
(313, 27, 'MUNICIPALITY', 'Mithila Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:51.860'),
(314, 27, 'MUNICIPALITY', 'Sahidnagar Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:52.029'),
(315, 27, 'MUNICIPALITY', 'Sabaila Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:03:52.118'),
(316, 27, 'MUNICIPALITY', 'Kamala Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:52.181'),
(317, 27, 'MUNICIPALITY', 'MithilaBihari Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:52.308'),
(318, 27, 'MUNICIPALITY', 'Hansapur Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:52.426'),
(319, 27, 'MUNICIPALITY', 'Janaknandani Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:52.490'),
(320, 27, 'MUNICIPALITY', 'Bateshwar Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:52.524'),
(321, 27, 'MUNICIPALITY', 'Mukhiyapatti Musharniya Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:52.546'),
(322, 27, 'MUNICIPALITY', 'Lakshminya Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:52.583'),
(323, 27, 'MUNICIPALITY', 'Aaurahi Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:52.614'),
(324, 27, 'MUNICIPALITY', 'Dhanauji Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:52.655'),
(325, 28, 'MUNICIPALITY', 'Bodebarsain Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:52.681'),
(326, 28, 'MUNICIPALITY', 'Dakneshwori Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:52.719'),
(327, 28, 'MUNICIPALITY', 'Hanumannagar Kankalini Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:52.751'),
(328, 28, 'MUNICIPALITY', 'Kanchanrup Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:52.785'),
(329, 28, 'MUNICIPALITY', 'Khadak Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:52.813'),
(330, 28, 'MUNICIPALITY', 'Shambhunath Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:52.858'),
(331, 28, 'MUNICIPALITY', 'Saptakoshi Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:52.911'),
(332, 28, 'MUNICIPALITY', 'Surunga Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:53.018'),
(333, 28, 'MUNICIPALITY', 'Rajbiraj Municipality', 'MUNICIPALITY', 16, 0, '2026-08-09 07:03:53.132'),
(334, 28, 'MUNICIPALITY', 'Agnisaira Krishnasavaran Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:53.205'),
(335, 28, 'MUNICIPALITY', 'Balan-Bihul Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:53.241'),
(336, 28, 'MUNICIPALITY', 'Rajgadh Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:53.289'),
(337, 28, 'MUNICIPALITY', 'Bishnupur Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:53.363'),
(338, 28, 'MUNICIPALITY', 'Chhinnamasta Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:53.411'),
(339, 28, 'MUNICIPALITY', 'Mahadeva Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:53.436'),
(340, 28, 'MUNICIPALITY', 'Rupani Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:53.464'),
(341, 28, 'MUNICIPALITY', 'Tilathi Koiladi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:53.492'),
(342, 28, 'MUNICIPALITY', 'Tirhut Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:53.528'),
(343, 29, 'MUNICIPALITY', 'Aaurahi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:53.555'),
(344, 29, 'MUNICIPALITY', 'Balawa Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:53.592'),
(345, 29, 'MUNICIPALITY', 'Bardibas Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:53.624'),
(346, 29, 'MUNICIPALITY', 'Bhangaha Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:53.653'),
(347, 29, 'MUNICIPALITY', 'Gaushala Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:53.682'),
(348, 29, 'MUNICIPALITY', 'Jaleshor Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:53.725'),
(349, 29, 'MUNICIPALITY', 'Loharpatti Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:53.756'),
(350, 29, 'MUNICIPALITY', 'Manara Shiswa Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:53.787'),
(351, 29, 'MUNICIPALITY', 'Matihani Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:53.816'),
(352, 29, 'MUNICIPALITY', 'Ramgopalpur Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:53.853'),
(353, 29, 'MUNICIPALITY', 'Ekdara Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:53.878'),
(354, 29, 'MUNICIPALITY', 'Mahottari Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:53.942'),
(355, 29, 'MUNICIPALITY', 'Pipara Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:53.973'),
(356, 29, 'MUNICIPALITY', 'Samsi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:54.049'),
(357, 29, 'MUNICIPALITY', 'Sonama Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:54.113'),
(358, 30, 'MUNICIPALITY', 'Bhaktapur Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:54.178'),
(359, 30, 'MUNICIPALITY', 'Changunarayan Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:54.206'),
(360, 30, 'MUNICIPALITY', 'Suryabinayak Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:54.231'),
(361, 30, 'MUNICIPALITY', 'Madhyapur Thimi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:54.270'),
(362, 31, 'MUNICIPALITY', 'Bharatpur Metropolitan City', 'METROPOLITAN', 29, 0, '2026-08-09 07:03:54.290'),
(363, 31, 'MUNICIPALITY', 'Kalika Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:54.396'),
(364, 31, 'MUNICIPALITY', 'Khairhani Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:03:54.539'),
(365, 31, 'MUNICIPALITY', 'Madi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:54.582'),
(366, 31, 'MUNICIPALITY', 'Ratnagar Municipality', 'MUNICIPALITY', 16, 0, '2026-08-09 07:03:54.616'),
(367, 31, 'MUNICIPALITY', 'Rapti Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:03:54.641'),
(368, 31, 'MUNICIPALITY', 'Ichchhakamana Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:54.678'),
(369, 32, 'MUNICIPALITY', 'Dhunibeshi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:54.708'),
(370, 32, 'MUNICIPALITY', 'Nilkantha Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:54.743'),
(371, 32, 'MUNICIPALITY', 'Khaniyabas Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:54.770'),
(372, 32, 'MUNICIPALITY', 'Gajuri Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:54.813'),
(373, 32, 'MUNICIPALITY', 'Galchhi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:56.193'),
(374, 32, 'MUNICIPALITY', 'Gangajamuna Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:57.633'),
(375, 32, 'MUNICIPALITY', 'Jwalamukhi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:57.964'),
(376, 32, 'MUNICIPALITY', 'Thakre Rural Municipality', 'RURAL_MUNICIPALITY', 11, 0, '2026-08-09 07:03:58.161'),
(377, 32, 'MUNICIPALITY', 'Netrawati Dabjong Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:58.239'),
(378, 32, 'MUNICIPALITY', 'Benighat Rorang Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:03:58.293'),
(379, 32, 'MUNICIPALITY', 'Rubi Valley Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:58.324'),
(380, 32, 'MUNICIPALITY', 'Siddhalek Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:58.342'),
(381, 32, 'MUNICIPALITY', 'Tripurasundari Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:58.366'),
(382, 33, 'MUNICIPALITY', 'Bhimeswor Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:58.385'),
(383, 33, 'MUNICIPALITY', 'Jiri Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:58.411'),
(384, 33, 'MUNICIPALITY', 'Kalinchok Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:58.445'),
(385, 33, 'MUNICIPALITY', 'Melung Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:58.521'),
(386, 33, 'MUNICIPALITY', 'Bigu Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:58.565'),
(387, 33, 'MUNICIPALITY', 'Gaurishankar Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:58.599'),
(388, 33, 'MUNICIPALITY', 'Baiteshowr Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:58.624'),
(389, 33, 'MUNICIPALITY', 'Sailung Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:58.658'),
(390, 33, 'MUNICIPALITY', 'Tamakoshi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:58.688'),
(391, 34, 'MUNICIPALITY', 'Kathmandu Metropolitan City', 'METROPOLITAN', 32, 0, '2026-08-09 07:03:58.722'),
(392, 34, 'MUNICIPALITY', 'Gokarneshwar Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:58.756'),
(393, 34, 'MUNICIPALITY', 'Kirtipur Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:58.790'),
(394, 34, 'MUNICIPALITY', 'Kageshwari-Manohara Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:58.818'),
(395, 34, 'MUNICIPALITY', 'Chandragiri Municipality', 'MUNICIPALITY', 15, 0, '2026-08-09 07:03:58.858'),
(396, 34, 'MUNICIPALITY', 'Tokha Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:58.910'),
(397, 34, 'MUNICIPALITY', 'Tarakeshwar Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:58.935'),
(398, 34, 'MUNICIPALITY', 'Dakshinkali Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:59.055'),
(399, 34, 'MUNICIPALITY', 'Nagarjun Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:59.158'),
(400, 34, 'MUNICIPALITY', 'Budhalikantha Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:03:59.213'),
(401, 34, 'MUNICIPALITY', 'Shankharapur Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:03:59.263'),
(402, 35, 'MUNICIPALITY', 'Dhulikhel Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:59.317'),
(403, 35, 'MUNICIPALITY', 'Namobuddha Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:03:59.370'),
(404, 35, 'MUNICIPALITY', 'Panauti Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:59.395'),
(405, 35, 'MUNICIPALITY', 'Panchkhal Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:03:59.429'),
(406, 35, 'MUNICIPALITY', 'Banepa Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:59.455'),
(407, 35, 'MUNICIPALITY', 'Mandandeupur Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:03:59.490'),
(408, 35, 'MUNICIPALITY', 'Khani Khola Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:03:59.535'),
(409, 35, 'MUNICIPALITY', 'Chauri Deurali Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:59.571'),
(410, 35, 'MUNICIPALITY', 'Temal Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:03:59.597'),
(411, 35, 'MUNICIPALITY', 'Bethanchok Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:03:59.640'),
(412, 35, 'MUNICIPALITY', 'Bhumlu Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:03:59.670'),
(413, 35, 'MUNICIPALITY', 'Mahabharat Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:03:59.704'),
(414, 35, 'MUNICIPALITY', 'Roshi Rural Municipality', 'RURAL_MUNICIPALITY', 12, 0, '2026-08-09 07:03:59.761'),
(415, 36, 'MUNICIPALITY', 'Lalitpur Metropolitan City', 'METROPOLITAN', 29, 0, '2026-08-09 07:03:59.823'),
(416, 36, 'MUNICIPALITY', 'Mahalaxmi Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:03:59.871'),
(417, 36, 'MUNICIPALITY', 'Godawari Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:03:59.899'),
(418, 36, 'MUNICIPALITY', 'Konjyosom Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:03:59.967'),
(419, 36, 'MUNICIPALITY', 'Bagmati Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:00.029'),
(420, 36, 'MUNICIPALITY', 'Mahankal Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:00.246'),
(421, 37, 'MUNICIPALITY', 'Hetauda Sub-Metropolitan City', 'SUB_METROPOLITAN', 19, 0, '2026-08-09 07:04:00.436'),
(422, 37, 'MUNICIPALITY', 'Thaha Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:00.474'),
(423, 37, 'MUNICIPALITY', 'Bhimphedi Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:00.503'),
(424, 37, 'MUNICIPALITY', 'Makawanpurgadhi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:00.530'),
(425, 37, 'MUNICIPALITY', 'Manahari Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:00.569'),
(426, 37, 'MUNICIPALITY', 'Raksirang Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:00.706'),
(427, 37, 'MUNICIPALITY', 'Bakaiya Rural Municipality', 'RURAL_MUNICIPALITY', 12, 0, '2026-08-09 07:04:00.843'),
(428, 37, 'MUNICIPALITY', 'Bagmati Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:01.019'),
(429, 37, 'MUNICIPALITY', 'Kailash Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:04:01.237'),
(430, 37, 'MUNICIPALITY', 'Indrasarowar Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:01.686'),
(431, 38, 'MUNICIPALITY', 'Bidur Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:01.820'),
(432, 38, 'MUNICIPALITY', 'Belkotgadhi Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:01.964'),
(433, 38, 'MUNICIPALITY', 'Kakani Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:02.223'),
(434, 38, 'MUNICIPALITY', 'Panchakanya Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:02.460'),
(435, 38, 'MUNICIPALITY', 'Likhu Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:02.516'),
(436, 38, 'MUNICIPALITY', 'Dupcheshwar Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:02.639'),
(437, 38, 'MUNICIPALITY', 'Shivapuri Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:02.704'),
(438, 38, 'MUNICIPALITY', 'Tadi Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:02.735'),
(439, 38, 'MUNICIPALITY', 'Suryagadhi Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:02.793'),
(440, 38, 'MUNICIPALITY', 'Tarkeshwar Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:02.829'),
(441, 38, 'MUNICIPALITY', 'Kispang Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:02.869'),
(442, 38, 'MUNICIPALITY', 'Myagang Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:02.906'),
(443, 39, 'MUNICIPALITY', 'Manthali Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:02.945'),
(444, 39, 'MUNICIPALITY', 'Ramechhap Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:03.022'),
(445, 39, 'MUNICIPALITY', 'Umakunda Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:03.070'),
(446, 39, 'MUNICIPALITY', 'Khandadevi Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:03.132'),
(447, 39, 'MUNICIPALITY', 'Doramba Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:03.191'),
(448, 39, 'MUNICIPALITY', 'Gokulganga Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:03.219'),
(449, 39, 'MUNICIPALITY', 'LikhuTamakoshi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:03.253'),
(450, 39, 'MUNICIPALITY', 'Sunapati Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:03.282'),
(451, 40, 'MUNICIPALITY', 'Kalika Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:03.388'),
(452, 40, 'MUNICIPALITY', 'Gosaikunda Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:03.526'),
(453, 40, 'MUNICIPALITY', 'Naukunda Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:03.732'),
(454, 40, 'MUNICIPALITY', 'Parbatikunda Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:03.982'),
(455, 40, 'MUNICIPALITY', 'Uttargaya Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:04.016'),
(456, 41, 'MUNICIPALITY', 'Kamalamai Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:04.042'),
(457, 41, 'MUNICIPALITY', 'Dudhauli Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:04.076'),
(458, 41, 'MUNICIPALITY', 'Sunkoshi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:04.106'),
(459, 41, 'MUNICIPALITY', 'Hariharpurgadhi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:04.139'),
(460, 41, 'MUNICIPALITY', 'Tinpatan Rural Municipality', 'RURAL_MUNICIPALITY', 11, 0, '2026-08-09 07:04:04.163'),
(461, 41, 'MUNICIPALITY', 'Marin Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:04.210'),
(462, 41, 'MUNICIPALITY', 'Golanjor Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:04.238'),
(463, 41, 'MUNICIPALITY', 'Phikkal Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:04.277'),
(464, 41, 'MUNICIPALITY', 'Ghyanglekh Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:04.316'),
(465, 42, 'MUNICIPALITY', 'Chautara Sangachowkgadi Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:04.346'),
(466, 42, 'MUNICIPALITY', 'Bahrabise Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:04.373'),
(467, 42, 'MUNICIPALITY', 'Melamchi Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:04.418'),
(468, 42, 'MUNICIPALITY', 'Balephi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:04.455'),
(469, 42, 'MUNICIPALITY', 'Sunkoshi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:04.489'),
(470, 42, 'MUNICIPALITY', 'Indrawati Rural Municipality', 'RURAL_MUNICIPALITY', 12, 0, '2026-08-09 07:04:04.518'),
(471, 42, 'MUNICIPALITY', 'Jugal Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:04.566'),
(472, 42, 'MUNICIPALITY', 'Panchpokhari Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:04.804'),
(473, 42, 'MUNICIPALITY', 'Bhotekoshi Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:05.068'),
(474, 42, 'MUNICIPALITY', 'Lisankhu Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:05.193'),
(475, 42, 'MUNICIPALITY', 'Helambu Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:05.244'),
(476, 42, 'MUNICIPALITY', 'Tripurasundari Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:05.290'),
(477, 43, 'MUNICIPALITY', 'Baglung Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:05.326'),
(478, 43, 'MUNICIPALITY', 'Dhorpatan Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:05.366'),
(479, 43, 'MUNICIPALITY', 'Galkot Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:05.407'),
(480, 43, 'MUNICIPALITY', 'Jaimuni Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:05.447'),
(481, 43, 'MUNICIPALITY', 'Bareng Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:05.476'),
(482, 43, 'MUNICIPALITY', 'Khathekhola Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:05.523'),
(483, 43, 'MUNICIPALITY', 'Taman Khola Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:05.580'),
(484, 43, 'MUNICIPALITY', 'Tara Khola Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:05.664'),
(485, 43, 'MUNICIPALITY', 'Nishi Khola Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:05.739'),
(486, 43, 'MUNICIPALITY', 'Badigad Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:04:05.770'),
(487, 44, 'MUNICIPALITY', 'Gorkha Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:05.810'),
(488, 44, 'MUNICIPALITY', 'Palungtar Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:05.842'),
(489, 44, 'MUNICIPALITY', 'Sulikot Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:05.884'),
(490, 44, 'MUNICIPALITY', 'Siranchowk Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:05.915');
INSERT INTO `addressbook` (`id`, `parentId`, `level`, `name`, `municipalityType`, `wardCount`, `sortOrder`, `createdAt`) VALUES
(491, 44, 'MUNICIPALITY', 'Ajirkot Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:05.964'),
(492, 44, 'MUNICIPALITY', 'Chumnubri Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:06.183'),
(493, 44, 'MUNICIPALITY', 'Dharche Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:06.444'),
(494, 44, 'MUNICIPALITY', 'Bhimsen Thapa Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:06.516'),
(495, 44, 'MUNICIPALITY', 'Sahid Lakhan Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:06.613'),
(496, 44, 'MUNICIPALITY', 'Aarughat Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:04:06.633'),
(497, 44, 'MUNICIPALITY', 'Gandaki Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:06.718'),
(498, 45, 'MUNICIPALITY', 'Pokhara Metropolitan City', 'METROPOLITAN', 33, 0, '2026-08-09 07:04:06.786'),
(499, 45, 'MUNICIPALITY', 'Annapurna Rural Municipality', 'RURAL_MUNICIPALITY', 11, 0, '2026-08-09 07:04:06.820'),
(500, 45, 'MUNICIPALITY', 'Machhapuchchhre Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:06.861'),
(501, 45, 'MUNICIPALITY', 'Madi Rural Municipality', 'RURAL_MUNICIPALITY', 12, 0, '2026-08-09 07:04:06.889'),
(502, 45, 'MUNICIPALITY', 'Rupa Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:06.917'),
(503, 46, 'MUNICIPALITY', 'Besisahar Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:06.955'),
(504, 46, 'MUNICIPALITY', 'Madhya Nepal Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:06.984'),
(505, 46, 'MUNICIPALITY', 'Rainas Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:07.023'),
(506, 46, 'MUNICIPALITY', 'Sundarbazar Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:07.051'),
(507, 46, 'MUNICIPALITY', 'Dordi Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:07.089'),
(508, 46, 'MUNICIPALITY', 'Dudhpokhari Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:07.116'),
(509, 46, 'MUNICIPALITY', 'Kwhlosothar Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:07.209'),
(510, 46, 'MUNICIPALITY', 'Marsyangdi Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:07.460'),
(511, 47, 'MUNICIPALITY', 'Chame Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:07.534'),
(512, 47, 'MUNICIPALITY', 'Nason Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:07.601'),
(513, 47, 'MUNICIPALITY', 'NarpaBhumi Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:07.685'),
(514, 47, 'MUNICIPALITY', 'Manang Ngisyang Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:07.866'),
(515, 48, 'MUNICIPALITY', 'Gharpajhong Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:07.916'),
(516, 48, 'MUNICIPALITY', 'Thasang Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:07.942'),
(517, 48, 'MUNICIPALITY', 'Barhagaun Muktichhetra Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:07.971'),
(518, 48, 'MUNICIPALITY', 'Lomanthang Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:08.009'),
(519, 48, 'MUNICIPALITY', 'Lo-Ghekar Damodarkunda Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:08.039'),
(520, 49, 'MUNICIPALITY', 'Beni Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:08.077'),
(521, 49, 'MUNICIPALITY', 'Annapurna Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:08.105'),
(522, 49, 'MUNICIPALITY', 'Dhaulagiri Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:08.146'),
(523, 49, 'MUNICIPALITY', 'Mangala Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:08.173'),
(524, 49, 'MUNICIPALITY', 'Malika Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:08.211'),
(525, 49, 'MUNICIPALITY', 'Raghuganga Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:08.239'),
(526, 50, 'MUNICIPALITY', 'Kawasoti Municipality', 'MUNICIPALITY', 17, 0, '2026-08-09 07:04:08.280'),
(527, 50, 'MUNICIPALITY', 'Gaindakot Municipality', 'MUNICIPALITY', 18, 0, '2026-08-09 07:04:08.317'),
(528, 50, 'MUNICIPALITY', 'Devachuli Municipality', 'MUNICIPALITY', 17, 0, '2026-08-09 07:04:08.357'),
(529, 50, 'MUNICIPALITY', 'Madhya Bindu Municipality', 'MUNICIPALITY', 15, 0, '2026-08-09 07:04:08.610'),
(530, 50, 'MUNICIPALITY', 'Baudikali Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:08.644'),
(531, 50, 'MUNICIPALITY', 'Bulingtar Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:08.687'),
(532, 50, 'MUNICIPALITY', 'Binayi Tribeni Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:08.716'),
(533, 50, 'MUNICIPALITY', 'Hupsekot Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:08.756'),
(534, 51, 'MUNICIPALITY', 'Kushma Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:08.861'),
(535, 51, 'MUNICIPALITY', 'Phalewas Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:09.220'),
(536, 51, 'MUNICIPALITY', 'Jaljala Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:09.298'),
(537, 51, 'MUNICIPALITY', 'Paiyun Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:09.326'),
(538, 51, 'MUNICIPALITY', 'Mahashila Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:09.353'),
(539, 51, 'MUNICIPALITY', 'Modi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:09.398'),
(540, 51, 'MUNICIPALITY', 'Bihadi Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:09.426'),
(541, 52, 'MUNICIPALITY', 'Galyang Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:09.464'),
(542, 52, 'MUNICIPALITY', 'Chapakot Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:09.492'),
(543, 52, 'MUNICIPALITY', 'Putalibazar Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:09.530'),
(544, 52, 'MUNICIPALITY', 'Bheerkot Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:09.557'),
(545, 52, 'MUNICIPALITY', 'Waling Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:09.661'),
(546, 52, 'MUNICIPALITY', 'Arjun Chaupari Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:09.988'),
(547, 52, 'MUNICIPALITY', 'Aandhikhola Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:10.018'),
(548, 52, 'MUNICIPALITY', 'Kaligandaki Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:10.058'),
(549, 52, 'MUNICIPALITY', 'Phedikhola Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:10.087'),
(550, 52, 'MUNICIPALITY', 'Harinas Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:10.115'),
(551, 52, 'MUNICIPALITY', 'Biruwa Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:10.433'),
(552, 53, 'MUNICIPALITY', 'Bhanu Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:10.615'),
(553, 53, 'MUNICIPALITY', 'Bhimad Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:10.677'),
(554, 53, 'MUNICIPALITY', 'Byas Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:10.716'),
(555, 53, 'MUNICIPALITY', 'Suklagandaki Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:10.745'),
(556, 53, 'MUNICIPALITY', 'AnbuKhaireni Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:10.785'),
(557, 53, 'MUNICIPALITY', 'Devghat Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:10.822'),
(558, 53, 'MUNICIPALITY', 'Bandipur Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:10.880'),
(559, 53, 'MUNICIPALITY', 'Rishing Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:10.992'),
(560, 53, 'MUNICIPALITY', 'Ghiring Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:11.058'),
(561, 53, 'MUNICIPALITY', 'Myagde Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:11.089'),
(562, 54, 'MUNICIPALITY', 'Kapilvastu Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:11.130'),
(563, 54, 'MUNICIPALITY', 'Banganga Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:11.160'),
(564, 54, 'MUNICIPALITY', 'Buddhabhumi Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:11.190'),
(565, 54, 'MUNICIPALITY', 'Shivaraj Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:11.256'),
(566, 54, 'MUNICIPALITY', 'Krishnanagar Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:11.297'),
(567, 54, 'MUNICIPALITY', 'Maharajgunj Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:11.360'),
(568, 54, 'MUNICIPALITY', 'Mayadevi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:11.388'),
(569, 54, 'MUNICIPALITY', 'Yashodhara Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:11.410'),
(570, 54, 'MUNICIPALITY', 'Suddhodan Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:11.437'),
(571, 54, 'MUNICIPALITY', 'Bijaynagar Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:11.470'),
(572, 55, 'MUNICIPALITY', 'Bardaghat Municipality', 'MUNICIPALITY', 16, 0, '2026-08-09 07:04:11.520'),
(573, 55, 'MUNICIPALITY', 'Ramgram Municipality', 'MUNICIPALITY', 18, 0, '2026-08-09 07:04:11.608'),
(574, 55, 'MUNICIPALITY', 'Sunwal Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:11.813'),
(575, 55, 'MUNICIPALITY', 'Susta Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:11.916'),
(576, 55, 'MUNICIPALITY', 'Palhi Nandan Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:11.945'),
(577, 55, 'MUNICIPALITY', 'Pratappur Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:11.985'),
(578, 55, 'MUNICIPALITY', 'Sarawal Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:12.046'),
(579, 56, 'MUNICIPALITY', 'Butwal Sub-Metropolitan City', 'SUB_METROPOLITAN', 19, 0, '2026-08-09 07:04:12.170'),
(580, 56, 'MUNICIPALITY', 'Devdaha Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:12.208'),
(581, 56, 'MUNICIPALITY', 'Lumbini Sanskritik Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:12.245'),
(582, 56, 'MUNICIPALITY', 'Sainamaina Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:12.288'),
(583, 56, 'MUNICIPALITY', 'Siddharthanagar Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:12.346'),
(584, 56, 'MUNICIPALITY', 'Tilottama Municipality', 'MUNICIPALITY', 17, 0, '2026-08-09 07:04:12.387'),
(585, 56, 'MUNICIPALITY', 'Gaidahawa Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:12.428'),
(586, 56, 'MUNICIPALITY', 'Kanchan Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:12.461'),
(587, 56, 'MUNICIPALITY', 'Kotahimai Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:12.500'),
(588, 56, 'MUNICIPALITY', 'Marchawari Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:12.531'),
(589, 56, 'MUNICIPALITY', 'Mayadevi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:12.576'),
(590, 56, 'MUNICIPALITY', 'Omsatiya Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:12.605'),
(591, 56, 'MUNICIPALITY', 'Rohini Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:12.646'),
(592, 56, 'MUNICIPALITY', 'Sammarimai Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:12.739'),
(593, 56, 'MUNICIPALITY', 'Siyari Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:13.240'),
(594, 56, 'MUNICIPALITY', 'Suddodhan Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:14.014'),
(595, 57, 'MUNICIPALITY', 'Sandhikharka Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:14.200'),
(596, 57, 'MUNICIPALITY', 'Sitganga Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:14.255'),
(597, 57, 'MUNICIPALITY', 'Bhumikasthan Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:14.329'),
(598, 57, 'MUNICIPALITY', 'Chhatradev Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:14.423'),
(599, 57, 'MUNICIPALITY', 'Panini Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:14.535'),
(600, 57, 'MUNICIPALITY', 'Malarani Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:14.584'),
(601, 58, 'MUNICIPALITY', 'Resunga Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:14.632'),
(602, 58, 'MUNICIPALITY', 'Musikot Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:14.668'),
(603, 58, 'MUNICIPALITY', 'Rurukshetra Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:14.706'),
(604, 58, 'MUNICIPALITY', 'Chhatrakot Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:14.750'),
(605, 58, 'MUNICIPALITY', 'Gulmidarbar Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:14.791'),
(606, 58, 'MUNICIPALITY', 'Chandrakot Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:14.822'),
(607, 58, 'MUNICIPALITY', 'Satyawati Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:14.858'),
(608, 58, 'MUNICIPALITY', 'Dhurkot Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:15.008'),
(609, 58, 'MUNICIPALITY', 'Kaligandaki Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:15.047'),
(610, 58, 'MUNICIPALITY', 'Isma Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:15.077'),
(611, 58, 'MUNICIPALITY', 'Malika Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:15.142'),
(612, 58, 'MUNICIPALITY', 'Madane Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:15.318'),
(613, 59, 'MUNICIPALITY', 'Tansen Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:15.347'),
(614, 59, 'MUNICIPALITY', 'Rampur Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:15.402'),
(615, 59, 'MUNICIPALITY', 'Rainadevi Chhahara Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:15.431'),
(616, 59, 'MUNICIPALITY', 'Ripdikot Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:15.472'),
(617, 59, 'MUNICIPALITY', 'Bagnaskali Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:15.509'),
(618, 59, 'MUNICIPALITY', 'Rambha Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:15.550'),
(619, 59, 'MUNICIPALITY', 'Purbakhola Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:15.578'),
(620, 59, 'MUNICIPALITY', 'Nisdi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:15.669'),
(621, 59, 'MUNICIPALITY', 'Mathagadhi Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:15.756'),
(622, 59, 'MUNICIPALITY', 'Tinahu Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:15.845'),
(623, 60, 'MUNICIPALITY', 'Ghorahi Sub-Metropolitan City', 'SUB_METROPOLITAN', 19, 0, '2026-08-09 07:04:15.933'),
(624, 60, 'MUNICIPALITY', 'Tulsipur Sub-Metropolitan City', 'SUB_METROPOLITAN', 19, 0, '2026-08-09 07:04:15.981'),
(625, 60, 'MUNICIPALITY', 'Lamahi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:16.101'),
(626, 60, 'MUNICIPALITY', 'Gadhawa Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:16.223'),
(627, 60, 'MUNICIPALITY', 'Rajpur Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:16.306'),
(628, 60, 'MUNICIPALITY', 'Shantinagar Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:16.375'),
(629, 60, 'MUNICIPALITY', 'Rapti Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:16.440'),
(630, 60, 'MUNICIPALITY', 'Banglachuli Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:16.490'),
(631, 60, 'MUNICIPALITY', 'Dangisharan Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:16.530'),
(632, 60, 'MUNICIPALITY', 'Babai Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:16.560'),
(633, 61, 'MUNICIPALITY', 'Sworgadwari Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:16.602'),
(634, 61, 'MUNICIPALITY', 'Pyuthan Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:16.632'),
(635, 61, 'MUNICIPALITY', 'Mandavi Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:16.673'),
(636, 61, 'MUNICIPALITY', 'Sarumarani Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:16.712'),
(637, 61, 'MUNICIPALITY', 'Ayirawati Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:16.753'),
(638, 61, 'MUNICIPALITY', 'Mallarani Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:16.780'),
(639, 61, 'MUNICIPALITY', 'Jhimruk Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:16.822'),
(640, 61, 'MUNICIPALITY', 'Naubahini Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:16.847'),
(641, 61, 'MUNICIPALITY', 'Gaumukhi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:16.887'),
(642, 62, 'MUNICIPALITY', 'Rolpa Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:16.925'),
(643, 62, 'MUNICIPALITY', 'Runtigadi Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:16.966'),
(644, 62, 'MUNICIPALITY', 'Triveni Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:17.107'),
(645, 62, 'MUNICIPALITY', 'Sunil Smiriti Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:17.403'),
(646, 62, 'MUNICIPALITY', 'Lungri Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:17.478'),
(647, 62, 'MUNICIPALITY', 'Sunchhahari Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:17.515'),
(648, 62, 'MUNICIPALITY', 'Thawang Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:17.607'),
(649, 62, 'MUNICIPALITY', 'Madi Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:17.958'),
(650, 62, 'MUNICIPALITY', 'GangaDev Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:18.130'),
(651, 62, 'MUNICIPALITY', 'Pariwartan Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:18.259'),
(652, 63, 'MUNICIPALITY', 'Putha Uttarganga Rural Municipality', 'RURAL_MUNICIPALITY', 14, 0, '2026-08-09 07:04:19.161'),
(653, 63, 'MUNICIPALITY', 'Bhume Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:19.318'),
(654, 63, 'MUNICIPALITY', 'Sisne Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:19.426'),
(655, 64, 'MUNICIPALITY', 'Nepalgunj Sub-Metropolitan City', 'SUB_METROPOLITAN', 23, 0, '2026-08-09 07:04:19.729'),
(656, 64, 'MUNICIPALITY', 'Kohalpur Municipality', 'MUNICIPALITY', 15, 0, '2026-08-09 07:04:19.812'),
(657, 64, 'MUNICIPALITY', 'Rapti-Sonari Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:19.925'),
(658, 64, 'MUNICIPALITY', 'Narainapur Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:20.488'),
(659, 64, 'MUNICIPALITY', 'Duduwa Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:20.854'),
(660, 64, 'MUNICIPALITY', 'Janaki Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:20.883'),
(661, 64, 'MUNICIPALITY', 'Khajura Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:20.922'),
(662, 64, 'MUNICIPALITY', 'Baijanath Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:20.954'),
(663, 65, 'MUNICIPALITY', 'Gulariya Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:20.987'),
(664, 65, 'MUNICIPALITY', 'Rajapur Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:21.026'),
(665, 65, 'MUNICIPALITY', 'Madhuwan Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:21.051'),
(666, 65, 'MUNICIPALITY', 'Thakurbaba Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:21.088'),
(667, 65, 'MUNICIPALITY', 'Basgadhi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:21.113'),
(668, 65, 'MUNICIPALITY', 'Barbardiya Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:21.150'),
(669, 65, 'MUNICIPALITY', 'Badhaiyatal Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:21.185'),
(670, 65, 'MUNICIPALITY', 'Geruwa Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:21.208'),
(671, 66, 'MUNICIPALITY', 'Aathabiskot Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:21.237'),
(672, 66, 'MUNICIPALITY', 'Musikot Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:21.275'),
(673, 66, 'MUNICIPALITY', 'Chaurjahari Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:21.299'),
(674, 66, 'MUNICIPALITY', 'SaniBheri Rural Municipality', 'RURAL_MUNICIPALITY', 11, 0, '2026-08-09 07:04:21.332'),
(675, 66, 'MUNICIPALITY', 'Triveni Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:04:21.359'),
(676, 66, 'MUNICIPALITY', 'Banphikot Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:04:21.394'),
(677, 67, 'MUNICIPALITY', 'Kumakh Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:21.420'),
(678, 67, 'MUNICIPALITY', 'Kalimati Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:21.453'),
(679, 67, 'MUNICIPALITY', 'Chhatreshwari Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:21.482'),
(680, 67, 'MUNICIPALITY', 'Darma Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:21.507'),
(681, 67, 'MUNICIPALITY', 'Kapurkot Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:21.540'),
(682, 67, 'MUNICIPALITY', 'Triveni Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:21.565'),
(683, 67, 'MUNICIPALITY', 'Siddha Kumakh Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:21.611'),
(684, 67, 'MUNICIPALITY', 'Bagchaur Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:21.630'),
(685, 67, 'MUNICIPALITY', 'Shaarda Municipality', 'MUNICIPALITY', 15, 0, '2026-08-09 07:04:21.772'),
(686, 67, 'MUNICIPALITY', 'Bangad Kupinde Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:21.844'),
(687, 68, 'MUNICIPALITY', 'Mudkechula Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:21.947'),
(688, 68, 'MUNICIPALITY', 'Kaike Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:22.033'),
(689, 68, 'MUNICIPALITY', 'She Phoksundo Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:22.081'),
(690, 68, 'MUNICIPALITY', 'Jagadulla Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:22.121'),
(691, 68, 'MUNICIPALITY', 'Dolpo Buddha Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:22.160'),
(692, 68, 'MUNICIPALITY', 'Chharka Tongsong Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:22.193'),
(693, 68, 'MUNICIPALITY', 'Thuli Bheri Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:22.253'),
(694, 68, 'MUNICIPALITY', 'Tripurasundari Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:22.280'),
(695, 69, 'MUNICIPALITY', 'Simkot Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:22.307'),
(696, 69, 'MUNICIPALITY', 'Sarkegad Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:22.343'),
(697, 69, 'MUNICIPALITY', 'Adanchuli Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:22.376'),
(698, 69, 'MUNICIPALITY', 'Kharpunath Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:22.432'),
(699, 69, 'MUNICIPALITY', 'Tanjakot Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:22.478'),
(700, 69, 'MUNICIPALITY', 'Chankheli Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:22.518'),
(701, 69, 'MUNICIPALITY', 'Namkha Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:22.559'),
(702, 70, 'MUNICIPALITY', 'Tatopani Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:22.605'),
(703, 70, 'MUNICIPALITY', 'Patarasi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:22.653'),
(704, 70, 'MUNICIPALITY', 'Tila Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:22.700'),
(705, 70, 'MUNICIPALITY', 'Kanaka Sundari Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:22.740'),
(706, 70, 'MUNICIPALITY', 'Sinja Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:22.805'),
(707, 70, 'MUNICIPALITY', 'Hima Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:22.832'),
(708, 70, 'MUNICIPALITY', 'Guthichaur Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:22.889'),
(709, 70, 'MUNICIPALITY', 'Chandannath Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:22.949'),
(710, 71, 'MUNICIPALITY', 'Khandachakra Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:23.260'),
(711, 71, 'MUNICIPALITY', 'Raskot Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:23.285'),
(712, 71, 'MUNICIPALITY', 'Tilagufa Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:23.310'),
(713, 71, 'MUNICIPALITY', 'Narharinath Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:23.346'),
(714, 71, 'MUNICIPALITY', 'Palata Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:23.371'),
(715, 71, 'MUNICIPALITY', 'Shubha Kalika Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:23.406'),
(716, 71, 'MUNICIPALITY', 'Sanni Triveni Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:23.436'),
(717, 71, 'MUNICIPALITY', 'Pachaljharana Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:23.458'),
(718, 71, 'MUNICIPALITY', 'Mahawai Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:23.495'),
(719, 72, 'MUNICIPALITY', 'Khatyad Rural Municipality', 'RURAL_MUNICIPALITY', 11, 0, '2026-08-09 07:04:23.523'),
(720, 72, 'MUNICIPALITY', 'Soru Rural Municipality', 'RURAL_MUNICIPALITY', 11, 0, '2026-08-09 07:04:23.559'),
(721, 72, 'MUNICIPALITY', 'Mugum Karmarong Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:23.587'),
(722, 72, 'MUNICIPALITY', 'Chhayanath Rara Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:23.624'),
(723, 73, 'MUNICIPALITY', 'Simta Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:23.656'),
(724, 73, 'MUNICIPALITY', 'Barahatal Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:04:23.681'),
(725, 73, 'MUNICIPALITY', 'Chaukune Rural Municipality', 'RURAL_MUNICIPALITY', 10, 0, '2026-08-09 07:04:23.716'),
(726, 73, 'MUNICIPALITY', 'Chingad Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:23.741'),
(727, 73, 'MUNICIPALITY', 'Gurbhakot Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:23.778'),
(728, 73, 'MUNICIPALITY', 'Birendranagar Municipality', 'MUNICIPALITY', 16, 0, '2026-08-09 07:04:23.803'),
(729, 73, 'MUNICIPALITY', 'Bheriganga Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:23.845'),
(730, 73, 'MUNICIPALITY', 'Panchapuri Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:23.878'),
(731, 73, 'MUNICIPALITY', 'Lekbeshi Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:23.911'),
(732, 74, 'MUNICIPALITY', 'Dullu Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:23.938'),
(733, 74, 'MUNICIPALITY', 'Gurans Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:23.974'),
(734, 74, 'MUNICIPALITY', 'Bhairabi Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:24.012'),
(735, 74, 'MUNICIPALITY', 'Naumule Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:24.042'),
(736, 74, 'MUNICIPALITY', 'Mahabu Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:24.070'),
(737, 74, 'MUNICIPALITY', 'Thantikandh Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:24.099'),
(738, 74, 'MUNICIPALITY', 'Bhagawatimai Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:24.132'),
(739, 74, 'MUNICIPALITY', 'Dungeshwar Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:24.183'),
(740, 74, 'MUNICIPALITY', 'Aathabis Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:24.355'),
(741, 74, 'MUNICIPALITY', 'Narayan Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:24.398'),
(742, 74, 'MUNICIPALITY', 'Chamunda Bindrasaini Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:24.432'),
(743, 75, 'MUNICIPALITY', 'Chhedagad Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:24.460'),
(744, 75, 'MUNICIPALITY', 'Bheri Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:24.491'),
(745, 75, 'MUNICIPALITY', 'Nalgad Municipality', 'MUNICIPALITY', 13, 0, '2026-08-09 07:04:24.533'),
(746, 75, 'MUNICIPALITY', 'Junichande Rural Municipality', 'RURAL_MUNICIPALITY', 11, 0, '2026-08-09 07:04:24.562'),
(747, 75, 'MUNICIPALITY', 'Kuse Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:24.599'),
(748, 75, 'MUNICIPALITY', 'Barekot Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:24.632'),
(749, 75, 'MUNICIPALITY', 'Shivalaya Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:24.682'),
(750, 76, 'MUNICIPALITY', 'Mahakali Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:24.707'),
(751, 76, 'MUNICIPALITY', 'Shailyashikhar Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:24.752'),
(752, 76, 'MUNICIPALITY', 'Naugad Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:24.771'),
(753, 76, 'MUNICIPALITY', 'Malikarjun Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:24.807'),
(754, 76, 'MUNICIPALITY', 'Marma Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:24.831'),
(755, 76, 'MUNICIPALITY', 'Lekam Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:24.891'),
(756, 76, 'MUNICIPALITY', 'Duhun Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:24.933'),
(757, 76, 'MUNICIPALITY', 'Vyans Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:24.979'),
(758, 76, 'MUNICIPALITY', 'Apihimal Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:25.010'),
(759, 77, 'MUNICIPALITY', 'Jayaprithvi Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:25.131'),
(760, 77, 'MUNICIPALITY', 'Bungal Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:25.155'),
(761, 77, 'MUNICIPALITY', 'Kedarsyu Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:25.193'),
(762, 77, 'MUNICIPALITY', 'Thalara Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:25.219'),
(763, 77, 'MUNICIPALITY', 'Bitthadchir Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:25.257'),
(764, 77, 'MUNICIPALITY', 'Chhabis Pathibhera Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:25.288'),
(765, 77, 'MUNICIPALITY', 'Khaptadchhanna Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:25.584'),
(766, 77, 'MUNICIPALITY', 'Masta Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:25.637'),
(767, 77, 'MUNICIPALITY', 'Durgathali Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:25.671'),
(768, 77, 'MUNICIPALITY', 'Talkot Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:25.701'),
(769, 77, 'MUNICIPALITY', 'Surma Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:25.742'),
(770, 77, 'MUNICIPALITY', 'Saipal Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:25.779'),
(771, 78, 'MUNICIPALITY', 'Badimalika Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:25.805'),
(772, 78, 'MUNICIPALITY', 'Triveni Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:25.843'),
(773, 78, 'MUNICIPALITY', 'Budhiganga Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:25.876'),
(774, 78, 'MUNICIPALITY', 'Budhinanda Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:25.957'),
(775, 78, 'MUNICIPALITY', 'Khaptad Chhededaha Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:25.978'),
(776, 78, 'MUNICIPALITY', 'Swami Kartik Khapar Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:26.017'),
(777, 78, 'MUNICIPALITY', 'Jagannath Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:26.050'),
(778, 78, 'MUNICIPALITY', 'Himali Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:26.078'),
(779, 78, 'MUNICIPALITY', 'Gaumul Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:26.106'),
(780, 79, 'MUNICIPALITY', 'Dashrathchanda Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:26.141'),
(781, 79, 'MUNICIPALITY', 'Patan Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:26.172'),
(782, 79, 'MUNICIPALITY', 'Melauli Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:26.203'),
(783, 79, 'MUNICIPALITY', 'Purchaudi Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:26.231'),
(784, 79, 'MUNICIPALITY', 'Dogdakedar Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:26.276'),
(785, 79, 'MUNICIPALITY', 'Dilashaini Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:26.296'),
(786, 79, 'MUNICIPALITY', 'Sigas Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:26.332'),
(787, 79, 'MUNICIPALITY', 'Pancheshwar Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:26.358'),
(788, 79, 'MUNICIPALITY', 'Surnaya Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:26.396'),
(789, 79, 'MUNICIPALITY', 'Shivanath Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:26.425'),
(790, 80, 'MUNICIPALITY', 'Dipayal Silgadhi Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:26.466'),
(791, 80, 'MUNICIPALITY', 'Shikhar Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:26.501'),
(792, 80, 'MUNICIPALITY', 'Aadarsha Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:26.544'),
(793, 80, 'MUNICIPALITY', 'Purbichauki Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:26.571'),
(794, 80, 'MUNICIPALITY', 'K.I.Singh Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:26.735'),
(795, 80, 'MUNICIPALITY', 'Jorayal Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:26.830'),
(796, 80, 'MUNICIPALITY', 'Sayal Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:26.924'),
(797, 80, 'MUNICIPALITY', 'Bogatan-Phudsil Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:27.007'),
(798, 80, 'MUNICIPALITY', 'Badikedar Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:27.083'),
(799, 81, 'MUNICIPALITY', 'Ramaroshan Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:27.146'),
(800, 81, 'MUNICIPALITY', 'Chaurpati Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:27.163'),
(801, 81, 'MUNICIPALITY', 'Turmakhand Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:27.190'),
(802, 81, 'MUNICIPALITY', 'Mellekh Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:27.213'),
(803, 81, 'MUNICIPALITY', 'Dhakari Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:27.250'),
(804, 81, 'MUNICIPALITY', 'Bannigadi Jayagad Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:27.288'),
(805, 81, 'MUNICIPALITY', 'Mangalsen Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:27.540'),
(806, 81, 'MUNICIPALITY', 'Kamalbazar Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:28.679'),
(807, 81, 'MUNICIPALITY', 'Sanfebagar Municipality', 'MUNICIPALITY', 14, 0, '2026-08-09 07:04:29.707'),
(808, 81, 'MUNICIPALITY', 'Panchadewal Binayak Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:29.796'),
(809, 82, 'MUNICIPALITY', 'Navadurga Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:29.885'),
(810, 82, 'MUNICIPALITY', 'Aalitaal Rural Municipality', 'RURAL_MUNICIPALITY', 8, 0, '2026-08-09 07:04:29.977'),
(811, 82, 'MUNICIPALITY', 'Ganyapadhura Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:30.028'),
(812, 82, 'MUNICIPALITY', 'Bhageshwar Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:30.128'),
(813, 82, 'MUNICIPALITY', 'Ajaymeru Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:30.190'),
(814, 82, 'MUNICIPALITY', 'Amargadhi Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:30.275'),
(815, 82, 'MUNICIPALITY', 'Parshuram Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:30.302'),
(816, 83, 'MUNICIPALITY', 'Bhimdatta Municipality', 'MUNICIPALITY', 19, 0, '2026-08-09 07:04:30.426'),
(817, 83, 'MUNICIPALITY', 'Punarbas Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:30.467'),
(818, 83, 'MUNICIPALITY', 'Bedkot Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:30.499'),
(819, 83, 'MUNICIPALITY', 'Mahakali Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:30.539'),
(820, 83, 'MUNICIPALITY', 'Shuklaphanta Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:30.567'),
(821, 83, 'MUNICIPALITY', 'Belauri Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:30.607'),
(822, 83, 'MUNICIPALITY', 'Krishnapur Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:30.634'),
(823, 83, 'MUNICIPALITY', 'Laljhadi Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:30.672'),
(824, 83, 'MUNICIPALITY', 'Beldandi Rural Municipality', 'RURAL_MUNICIPALITY', 5, 0, '2026-08-09 07:04:30.704'),
(825, 84, 'MUNICIPALITY', 'Janaki Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:30.730'),
(826, 84, 'MUNICIPALITY', 'Kailari Rural Municipality', 'RURAL_MUNICIPALITY', 9, 0, '2026-08-09 07:04:30.766'),
(827, 84, 'MUNICIPALITY', 'Joshipur Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:30.793'),
(828, 84, 'MUNICIPALITY', 'Bardagoriya Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:30.857'),
(829, 84, 'MUNICIPALITY', 'Mohanyal Rural Municipality', 'RURAL_MUNICIPALITY', 7, 0, '2026-08-09 07:04:30.917'),
(830, 84, 'MUNICIPALITY', 'Chure Rural Municipality', 'RURAL_MUNICIPALITY', 6, 0, '2026-08-09 07:04:30.961'),
(831, 84, 'MUNICIPALITY', 'Tikapur Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:30.988'),
(832, 84, 'MUNICIPALITY', 'Ghodaghodi Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:31.029'),
(833, 84, 'MUNICIPALITY', 'Lamkichuha Municipality', 'MUNICIPALITY', 10, 0, '2026-08-09 07:04:31.059'),
(834, 84, 'MUNICIPALITY', 'Bhajni Municipality', 'MUNICIPALITY', 9, 0, '2026-08-09 07:04:31.092'),
(835, 84, 'MUNICIPALITY', 'Godawari Municipality', 'MUNICIPALITY', 12, 0, '2026-08-09 07:04:31.152'),
(836, 84, 'MUNICIPALITY', 'Gauriganga Municipality', 'MUNICIPALITY', 11, 0, '2026-08-09 07:04:31.180'),
(837, 84, 'MUNICIPALITY', 'Dhangadhi Sub-Metropolitan City', 'SUB_METROPOLITAN', 19, 0, '2026-08-09 07:04:31.218');

-- --------------------------------------------------------

--
-- Table structure for table `attribute`
--

CREATE TABLE `attribute` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `type` enum('TEXT','COLOR') NOT NULL DEFAULT 'TEXT',
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attribute`
--

INSERT INTO `attribute` (`id`, `name`, `slug`, `type`, `sortOrder`, `createdAt`, `updatedAt`) VALUES
(1, 'Color', 'color', 'COLOR', 0, '2026-08-07 14:44:13.944', '2026-08-08 06:08:14.035'),
(2, 'Pack Size', 'pack-size', 'TEXT', 1, '2026-08-07 14:44:14.008', '2026-08-07 14:44:14.008'),
(3, 'Color Icon', 'color-icon', 'COLOR', 0, '2026-08-07 16:51:26.081', '2026-08-07 16:51:26.081');

-- --------------------------------------------------------

--
-- Table structure for table `attributevalue`
--

CREATE TABLE `attributevalue` (
  `id` int(11) NOT NULL,
  `attributeId` int(11) NOT NULL,
  `value` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `colorHex` varchar(191) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attributevalue`
--

INSERT INTO `attributevalue` (`id`, `attributeId`, `value`, `slug`, `colorHex`, `sortOrder`, `createdAt`) VALUES
(1, 1, 'Green', 'green', '#22c55e', 2, '2026-08-07 14:44:14.036'),
(2, 1, 'Brown', 'brown', '#6f4518', 0, '2026-08-07 14:44:14.036'),
(3, 1, 'Black', 'black', '#1c1917', 1, '2026-08-07 14:44:14.036'),
(4, 2, 'Medium', 'medium', NULL, 1, '2026-08-07 14:44:14.339'),
(5, 2, 'Large', 'large', NULL, 2, '2026-08-07 14:44:14.339'),
(6, 2, 'Small', 'small', NULL, 0, '2026-08-07 14:44:14.339'),
(7, 3, 'Black', 'black', '#000000', 0, '2026-08-09 06:34:48.480'),
(8, 1, 'Red', 'red', NULL, 0, '2026-08-09 07:03:10.432'),
(9, 1, 'Blue', 'blue', NULL, 1, '2026-08-09 07:03:10.432');

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE `brand` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `banner` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `websiteUrl` varchar(191) DEFAULT NULL,
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDescription` varchar(191) DEFAULT NULL,
  `metaKeywords` varchar(191) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`id`, `name`, `slug`, `logo`, `banner`, `description`, `websiteUrl`, `metaTitle`, `metaDescription`, `metaKeywords`, `sortOrder`, `isFeatured`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Vitalis Naturals', 'vitalis-naturals', '/uploads/brands/vitalis-naturals-logo.jpg', '/uploads/brands/vitalis-naturals-banner.jpg', 'Vitalis Naturals formulates natural wellness products with quality ingredients you can trust.', NULL, NULL, NULL, NULL, 0, 1, 'ACTIVE', '2026-08-07 14:44:08.526', '2026-08-09 07:03:01.904', NULL),
(2, 'PureLeaf Organics', 'pureleaf-organics', '/uploads/brands/pureleaf-organics-logo.jpg', '/uploads/brands/pureleaf-organics-banner.jpg', 'PureLeaf Organics formulates natural wellness products with quality ingredients you can trust.', NULL, NULL, NULL, NULL, 1, 1, 'ACTIVE', '2026-08-07 14:44:08.560', '2026-08-09 07:03:01.935', NULL),
(3, 'GreenSpore Labs', 'greenspore-labs', '/uploads/brands/greenspore-labs-logo.jpg', '/uploads/brands/greenspore-labs-banner.jpg', 'GreenSpore Labs formulates natural wellness products with quality ingredients you can trust.', NULL, NULL, NULL, NULL, 2, 1, 'ACTIVE', '2026-08-07 14:44:08.594', '2026-08-09 07:03:01.968', NULL),
(4, 'EverWell Wellness', 'everwell-wellness', '/uploads/brands/everwell-wellness-logo.jpg', '/uploads/brands/everwell-wellness-banner.jpg', 'EverWell Wellness formulates natural wellness products with quality ingredients you can trust.', NULL, NULL, NULL, NULL, 3, 0, 'ACTIVE', '2026-08-07 14:44:08.632', '2026-08-09 07:03:02.018', NULL),
(5, 'NutriCore', 'nutricore', '/uploads/brands/nutricore-logo.jpg', '/uploads/brands/nutricore-banner.jpg', 'NutriCore formulates natural wellness products with quality ingredients you can trust.', NULL, NULL, NULL, NULL, 4, 0, 'INACTIVE', '2026-08-07 14:44:08.657', '2026-08-09 07:03:02.046', NULL),
(6, 'HerbalRoot Co.', 'herbalroot-co', '/uploads/brands/herbalroot-co-logo.jpg', '/uploads/brands/herbalroot-co-banner.jpg', 'HerbalRoot Co. formulates natural wellness products with quality ingredients you can trust.', NULL, NULL, NULL, NULL, 5, 0, 'ACTIVE', '2026-08-07 14:44:08.792', '2026-08-09 07:03:02.084', NULL),
(7, 'AquaBloom', 'aquabloom', '/uploads/brands/aquabloom-logo.jpg', '/uploads/brands/aquabloom-banner.jpg', 'AquaBloom formulates natural wellness products with quality ingredients you can trust.', NULL, NULL, NULL, NULL, 6, 0, 'ACTIVE', '2026-08-07 14:44:08.920', '2026-08-09 07:03:02.115', NULL),
(8, 'Solstice Health', 'solstice-health', '/uploads/brands/solstice-health-logo.jpg', '/uploads/brands/solstice-health-banner.jpg', 'Solstice Health formulates natural wellness products with quality ingredients you can trust.', NULL, NULL, NULL, NULL, 7, 0, 'ACTIVE', '2026-08-07 14:44:09.020', '2026-08-09 07:03:02.151', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `userId`, `createdAt`, `updatedAt`) VALUES
(2, 3, '2026-08-07 16:45:12.656', '2026-08-07 16:45:12.656'),
(3, 1, '2026-08-08 02:28:42.165', '2026-08-08 02:28:42.165');

-- --------------------------------------------------------

--
-- Table structure for table `cartitem`
--

CREATE TABLE `cartitem` (
  `id` int(11) NOT NULL,
  `cartId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `variantId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cartitem`
--

INSERT INTO `cartitem` (`id`, `cartId`, `productId`, `quantity`, `variantId`) VALUES
(31, 2, 22, 1, NULL),
(32, 3, 1, 12, NULL),
(33, 2, 1, 1, 53);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `parentCategoryId` int(11) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `bannerImage` varchar(191) DEFAULT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDescription` varchar(191) DEFAULT NULL,
  `metaKeywords` varchar(191) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `parentCategoryId`, `name`, `slug`, `description`, `image`, `bannerImage`, `icon`, `metaTitle`, `metaDescription`, `metaKeywords`, `sortOrder`, `isFeatured`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, NULL, 'Ganoderma Coffee', 'ganoderma-coffee', NULL, '/uploads/categories/ganoderma-coffee.jpg', '/uploads/categories/ganoderma-coffee-banner.jpg', NULL, NULL, NULL, NULL, 0, 1, 'ACTIVE', '2026-08-07 14:44:08.057', '2026-08-09 07:03:01.272', NULL),
(2, 1, '3-in-1 Coffee', 'coffee-3-in-1', NULL, '/uploads/categories/coffee-3-in-1.jpg', NULL, NULL, NULL, NULL, NULL, 0, 0, 'ACTIVE', '2026-08-07 14:44:08.091', '2026-08-09 07:03:01.334', NULL),
(3, 1, 'Black Coffee', 'coffee-black', NULL, '/uploads/categories/coffee-black.jpg', NULL, NULL, NULL, NULL, NULL, 1, 0, 'ACTIVE', '2026-08-07 14:44:08.168', '2026-08-09 07:03:01.377', NULL),
(4, NULL, 'Spirulina & Supplements', 'spirulina-supplements', NULL, '/uploads/categories/spirulina-supplements.jpg', '/uploads/categories/spirulina-supplements-banner.jpg', NULL, NULL, NULL, NULL, 1, 1, 'ACTIVE', '2026-08-07 14:44:08.207', '2026-08-09 07:03:01.469', NULL),
(5, 4, 'Tablets', 'spirulina-tablets', NULL, '/uploads/categories/spirulina-tablets.jpg', NULL, NULL, NULL, NULL, NULL, 0, 0, 'ACTIVE', '2026-08-07 14:44:08.237', '2026-08-09 07:03:01.504', NULL),
(6, 4, 'Capsules', 'spirulina-capsules', NULL, '/uploads/categories/spirulina-capsules.jpg', NULL, NULL, NULL, NULL, NULL, 1, 0, 'ACTIVE', '2026-08-07 14:44:08.271', '2026-08-09 07:03:01.533', NULL),
(7, NULL, 'Personal Care', 'personal-care', NULL, '/uploads/categories/personal-care.jpg', '/uploads/categories/personal-care-banner.jpg', NULL, NULL, NULL, NULL, 2, 0, 'ACTIVE', '2026-08-07 14:44:08.299', '2026-08-09 07:03:01.580', NULL),
(8, 7, 'Oral Care', 'personal-care-oral', NULL, '/uploads/categories/personal-care-oral.jpg', NULL, NULL, NULL, NULL, NULL, 0, 0, 'ACTIVE', '2026-08-07 14:44:08.336', '2026-08-09 07:03:01.622', NULL),
(9, 7, 'Hair Care', 'personal-care-hair', NULL, '/uploads/categories/personal-care-hair.jpg', NULL, NULL, NULL, NULL, NULL, 1, 0, 'ACTIVE', '2026-08-07 14:44:08.361', '2026-08-09 07:03:01.720', NULL),
(10, 7, 'Skin Care', 'personal-care-skin', NULL, '/uploads/categories/personal-care-skin.jpg', NULL, NULL, NULL, NULL, NULL, 2, 0, 'ACTIVE', '2026-08-07 14:44:08.394', '2026-08-09 07:03:01.742', NULL),
(11, NULL, 'Beverages', 'beverages', NULL, '/uploads/categories/beverages.jpg', '/uploads/categories/beverages-banner.jpg', NULL, NULL, NULL, NULL, 3, 0, 'ACTIVE', '2026-08-07 14:44:08.425', '2026-08-09 07:03:01.799', NULL),
(12, 11, 'Tea', 'beverages-tea', NULL, '/uploads/categories/beverages-tea.jpg', NULL, NULL, NULL, NULL, NULL, 0, 0, 'ACTIVE', '2026-08-07 14:44:08.461', '2026-08-09 07:03:01.836', NULL),
(13, 11, 'Juice', 'beverages-juice', NULL, '/uploads/categories/beverages-juice.jpg', NULL, NULL, NULL, NULL, NULL, 1, 0, 'ACTIVE', '2026-08-07 14:44:08.488', '2026-08-09 07:03:01.860', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `id` int(11) NOT NULL,
  `code` varchar(191) NOT NULL,
  `type` enum('PERCENT','FIXED') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `minOrderAmount` decimal(10,2) DEFAULT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`id`, `code`, `type`, `value`, `minOrderAmount`, `expiresAt`, `active`, `createdAt`) VALUES
(1, 'WELCOME10', 'PERCENT', 10.00, 1000.00, NULL, 1, '2026-08-07 14:44:08.029');

-- --------------------------------------------------------

--
-- Table structure for table `emailsettings`
--

CREATE TABLE `emailsettings` (
  `id` varchar(191) NOT NULL DEFAULT 'singleton',
  `enabled` tinyint(1) NOT NULL DEFAULT 0,
  `smtpHost` varchar(191) DEFAULT NULL,
  `smtpPort` int(11) NOT NULL DEFAULT 587,
  `smtpUser` varchar(191) DEFAULT NULL,
  `smtpPassword` varchar(191) DEFAULT NULL,
  `secure` tinyint(1) NOT NULL DEFAULT 0,
  `fromName` varchar(191) NOT NULL DEFAULT 'DXN',
  `fromEmail` varchar(191) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `emailsettings`
--

INSERT INTO `emailsettings` (`id`, `enabled`, `smtpHost`, `smtpPort`, `smtpUser`, `smtpPassword`, `secure`, `fromName`, `fromEmail`, `updatedAt`) VALUES
('singleton', 1, 'mail.omsok.com', 465, 'hello@omsok.com', 'OMSOK#@21^^??', 1, 'DXN', 'hello@omsok.com', '2026-08-08 02:35:44.770');

-- --------------------------------------------------------

--
-- Table structure for table `homebannerslide`
--

CREATE TABLE `homebannerslide` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `subtitle` varchar(191) DEFAULT NULL,
  `image` varchar(191) NOT NULL,
  `linkUrl` varchar(191) DEFAULT NULL,
  `buttonText` varchar(191) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `homebannerslide`
--

INSERT INTO `homebannerslide` (`id`, `title`, `subtitle`, `image`, `linkUrl`, `buttonText`, `sortOrder`, `active`, `createdAt`, `updatedAt`) VALUES
(1, 'Live Well with DXN', 'Ganoderma coffee, spirulina & natural wellness essentials', '/uploads/banners/bb1d632e-7960-4758-9225-f38c3658308b.jpg', '/shop', 'Shop Now', 0, 1, '2026-08-07 14:44:16.381', '2026-08-09 04:37:13.242'),
(2, 'Spirulina & Supplements', 'Boost your daily wellness routine', '/uploads/banners/43787835-f180-4456-86f8-0686f70142e2.jpg', '/shop?category=spirulina-supplements', 'Explore', 1, 1, '2026-08-07 14:44:16.405', '2026-08-09 04:37:37.153'),
(3, 'DXN Chilli Sauce', 'DXN Chilli Sauce', '/uploads/banners/6aa6e02b-6616-4728-a042-d04fa853f4a2.jpg', NULL, NULL, 2, 1, '2026-08-09 04:38:05.889', '2026-08-09 04:38:05.889');

-- --------------------------------------------------------

--
-- Table structure for table `invoicesettings`
--

CREATE TABLE `invoicesettings` (
  `id` varchar(191) NOT NULL DEFAULT 'singleton',
  `companyName` varchar(191) NOT NULL DEFAULT 'DXN',
  `addressLine1` varchar(191) DEFAULT NULL,
  `addressLine2` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `taxId` varchar(191) DEFAULT NULL,
  `footerNote` text DEFAULT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `invoicePrefix` varchar(191) NOT NULL DEFAULT 'INV-',
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoicesettings`
--

INSERT INTO `invoicesettings` (`id`, `companyName`, `addressLine1`, `addressLine2`, `phone`, `email`, `taxId`, `footerNote`, `logo`, `invoicePrefix`, `updatedAt`) VALUES
('singleton', '', 'Jalan Teknokrat 1, Cyber 3, 63000 Cyberjaya', NULL, '+603-60339800', 'info@dxn.com', '465721314987979', NULL, '/uploads/invoices/0cda8473-40a4-43ae-8481-c0dbef5c709c.png', 'INV-', '2026-08-08 03:09:36.878');

-- --------------------------------------------------------

--
-- Table structure for table `municipalityshippingrate`
--

CREATE TABLE `municipalityshippingrate` (
  `id` int(11) NOT NULL,
  `municipalityId` int(11) NOT NULL,
  `label` varchar(191) DEFAULT NULL,
  `rate` decimal(10,2) NOT NULL,
  `freeShippingMinOrder` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `municipalityshippingrate`
--

INSERT INTO `municipalityshippingrate` (`id`, `municipalityId`, `label`, `rate`, `freeShippingMinOrder`, `createdAt`, `updatedAt`) VALUES
(1, 391, NULL, 150.00, 8000.00, '2026-08-09 09:09:29.476', '2026-08-09 09:34:18.737'),
(2, 273, 'Rohuwa', 1200.00, NULL, '2026-08-09 09:31:38.473', '2026-08-09 09:31:38.473');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `message` varchar(191) NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `userId`, `message`, `read`, `createdAt`) VALUES
(3, 3, 'Your order BKS-20260807-JPNVSV has been placed and is now Processing.', 1, '2026-08-07 16:46:27.878'),
(4, 3, 'Your order BKS-20260808-SM67S4 has been placed and is now Processing.', 1, '2026-08-08 02:36:38.566'),
(5, 1, 'Your order BKS-20260808-SZXI33 has been placed and is now Processing.', 0, '2026-08-08 02:45:04.820'),
(6, 1, 'Your order BKS-20260808-SZXI33 has shipped via NCM.', 0, '2026-08-08 02:45:22.353'),
(7, 3, 'Your order BKS-20260808-SM67S4 has shipped via Sumit Gupta.', 1, '2026-08-08 02:57:11.088'),
(8, 3, 'Your order BKS-20260808-SM67S4 has been delivered.', 1, '2026-08-08 02:58:47.169'),
(9, 1, 'Your order BKS-20260808-2W81O6 has been placed and is now Processing.', 0, '2026-08-08 03:00:16.452'),
(10, 3, 'Your order BKS-20260808-ZEQADP has been placed and is now Processing.', 1, '2026-08-08 03:12:46.792'),
(11, 1, 'Your order BKS-20260808-WX7R7C has been placed and is now Processing.', 0, '2026-08-08 03:41:05.988'),
(12, 1, 'Your order BKS-20260808-WX7R7C has been cancelled.', 0, '2026-08-08 03:41:25.377'),
(14, 3, 'Your order BKS-20260808-9CIE8Z has been placed and is now Processing.', 1, '2026-08-08 06:11:02.219'),
(15, 3, 'Your order BKS-20260808-AS9CJQ has been placed and is now Processing.', 1, '2026-08-08 06:16:49.393'),
(16, 3, 'Your order BKS-20260808-AS9CJQ has shipped via Dharmendra Kumar Sharma.', 1, '2026-08-08 06:18:19.203'),
(17, 3, 'Your order BKS-20260808-AS9CJQ has been delivered.', 1, '2026-08-08 06:18:56.272'),
(18, 3, 'Your order BKS-20260809-455NL2 has been placed and is now Processing.', 1, '2026-08-09 04:13:45.209'),
(19, 3, 'Your order BKS-20260809-5KRHO2 has been placed and is now Processing.', 1, '2026-08-09 06:27:35.905'),
(20, 1, 'Your order BKS-20260809-DMS9TN has been placed and is now Processing.', 0, '2026-08-09 07:12:52.511'),
(21, 1, 'Your order BKS-20260809-9J071D has been placed and is now Processing.', 0, '2026-08-09 09:14:02.933');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `orderNumber` varchar(191) NOT NULL,
  `userId` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `line1` varchar(191) NOT NULL,
  `line2` varchar(191) DEFAULT NULL,
  `city` varchar(191) NOT NULL,
  `state` varchar(191) NOT NULL,
  `postalCode` varchar(191) NOT NULL,
  `country` varchar(191) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `couponId` int(11) DEFAULT NULL,
  `paymentMethod` enum('COD','ONLINE') NOT NULL,
  `paymentSubMethod` varchar(191) DEFAULT NULL,
  `paymentStatus` enum('PENDING','PAID','FAILED') NOT NULL DEFAULT 'PENDING',
  `paymentReference` varchar(191) DEFAULT NULL,
  `status` enum('PROCESSING','SHIPPED','DELIVERED','RETURNED','CANCELLED') NOT NULL DEFAULT 'PROCESSING',
  `trackingNumber` varchar(191) DEFAULT NULL,
  `courierName` varchar(191) DEFAULT NULL,
  `returnRequested` tinyint(1) NOT NULL DEFAULT 0,
  `returnReason` varchar(191) DEFAULT NULL,
  `refunded` tinyint(1) NOT NULL DEFAULT 0,
  `placedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `shippingFee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxLabel` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `orderNumber`, `userId`, `fullName`, `phone`, `email`, `line1`, `line2`, `city`, `state`, `postalCode`, `country`, `subtotal`, `discount`, `total`, `couponId`, `paymentMethod`, `paymentSubMethod`, `paymentStatus`, `paymentReference`, `status`, `trackingNumber`, `courierName`, `returnRequested`, `returnReason`, `refunded`, `placedAt`, `createdAt`, `updatedAt`, `shippingFee`, `tax`, `taxLabel`) VALUES
(2, 'BKS-20260807-JPNVSV', 3, 'Bikesh Kumar Gupta', '9876452312', 'bikeshguptabusiness@gmail.com', 'Kathmandu', 'Kalimati', 'Kathmandu', 'Bagmati', '34543435', 'Nepal', 804.00, 0.00, 804.00, NULL, 'COD', NULL, 'PENDING', NULL, 'PROCESSING', NULL, NULL, 0, NULL, 0, '2026-08-07 16:46:27.756', '2026-08-07 16:46:27.756', '2026-08-07 16:46:27.756', 0.00, 0.00, NULL),
(3, 'BKS-20260808-SM67S4', 3, 'Bikesh Kumar Gupta', '9876452312', 'bikeshguptabusiness@gmail.com', 'Kathmandu', 'Kalimati', 'Kathmandu', 'Bagmati', '34543435', 'Nepal', 1331.00, 0.00, 1331.00, NULL, 'COD', NULL, 'PAID', NULL, 'DELIVERED', '9856321478', 'Sumit Gupta', 0, NULL, 0, '2026-08-08 02:36:38.397', '2026-08-08 02:36:38.397', '2026-08-08 02:58:47.030', 0.00, 0.00, NULL),
(6, 'BKS-20260808-ZEQADP', 3, 'Bikesh Kumar Gupta', '9876452312', 'bikeshguptabusiness@gmail.com', 'Kathmandu', 'Kalimati', 'Kathmandu', 'Bagmati', '34543435', 'Nepal', 533.00, 0.00, 533.00, NULL, 'COD', NULL, 'PENDING', NULL, 'PROCESSING', NULL, NULL, 0, NULL, 0, '2026-08-08 03:12:46.686', '2026-08-08 03:12:46.686', '2026-08-08 03:12:46.686', 0.00, 0.00, NULL),
(9, 'BKS-20260808-9CIE8Z', 3, 'Bikesh Kumar Gupta', '9876452312', 'bikeshguptabusiness@gmail.com', 'Kathmandu', 'Kalimati', 'Kathmandu', 'Bagmati', '34543435', 'Nepal', 787.00, 0.00, 887.00, NULL, 'COD', NULL, 'PENDING', NULL, 'PROCESSING', NULL, NULL, 0, NULL, 0, '2026-08-08 06:11:02.191', '2026-08-08 06:11:02.191', '2026-08-08 06:11:02.191', 100.00, 0.00, NULL),
(10, 'BKS-20260808-AS9CJQ', 3, 'Bikesh Kumar Gupta', '9876452312', 'bikeshguptabusiness@gmail.com', 'Kathmandu', 'Kalimati', 'Kathmandu', 'Bagmati', '34543435', 'Nepal', 1633.00, 0.00, 1733.00, NULL, 'COD', NULL, 'PAID', NULL, 'DELIVERED', '985632478', 'Dharmendra Kumar Sharma', 0, NULL, 0, '2026-08-08 06:16:49.230', '2026-08-08 06:16:49.230', '2026-08-08 06:18:56.140', 100.00, 0.00, NULL),
(11, 'BKS-20260809-455NL2', 3, 'Bikesh Kumar Gupta', '9876452312', 'bikeshguptabusiness@gmail.com', 'Kathmandu', 'Kalimati', 'Kathmandu', 'Bagmati', '34543435', 'Nepal', 1583.00, 0.00, 1683.00, NULL, 'COD', NULL, 'PENDING', NULL, 'PROCESSING', NULL, NULL, 0, NULL, 0, '2026-08-09 04:13:45.035', '2026-08-09 04:13:45.035', '2026-08-09 04:13:45.035', 100.00, 0.00, NULL),
(12, 'BKS-20260809-5KRHO2', 3, 'Bikesh Kumar Gupta', '9876452312', 'bikeshguptabusiness@gmail.com', 'Kathmandu', 'Kalimati', 'Kathmandu', 'Bagmati', '34543435', 'Nepal', 10414.00, 0.00, 10414.00, NULL, 'COD', NULL, 'PENDING', NULL, 'PROCESSING', NULL, NULL, 0, NULL, 0, '2026-08-09 06:27:35.768', '2026-08-09 06:27:35.768', '2026-08-09 06:27:35.768', 0.00, 0.00, NULL),
(13, 'BKS-20260809-DMS9TN', 1, 'Test User', '9800000000', 'admin@dxn.com', 'Test Tole Street', 'Near Test Landmark', 'Bhaktapur Municipality - Ward 1', 'Bagmati Province', '', 'Nepal', 758.00, 0.00, 858.00, NULL, 'COD', NULL, 'PENDING', NULL, 'PROCESSING', NULL, NULL, 0, NULL, 0, '2026-08-09 07:12:52.358', '2026-08-09 07:12:52.358', '2026-08-09 07:12:52.358', 100.00, 0.00, NULL),
(14, 'BKS-20260809-9J071D', 1, 'Kathmandu Override Test', '9822222222', 'admin@dxn.com', 'New Baneshwor', NULL, 'Kathmandu Metropolitan City - Ward 1', 'Bagmati Province', '', 'Nepal', 1516.00, 0.00, 1566.00, NULL, 'COD', NULL, 'PENDING', NULL, 'PROCESSING', NULL, NULL, 0, NULL, 0, '2026-08-09 09:14:02.718', '2026-08-09 09:14:02.718', '2026-08-09 09:14:02.718', 50.00, 0.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `variantId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderitem`
--

INSERT INTO `orderitem` (`id`, `orderId`, `productId`, `name`, `image`, `price`, `quantity`, `variantId`) VALUES
(2, 2, 2, 'Mocha — Ganoderma Coffee', '/uploads/products/mocha-ganoderma-coffee-1.jpg', 804.00, 1, NULL),
(3, 3, 2, 'Mocha — Ganoderma Coffee', '/uploads/products/mocha-ganoderma-coffee-1.jpg', 804.00, 1, NULL),
(4, 3, 44, 'Aloe Vera — Beverages', '/uploads/products/aloe-vera-beverages-1.jpg', 527.00, 1, NULL),
(7, 6, 39, 'Herbal Tea — Beverages', '/uploads/products/herbal-tea-beverages-1.jpg', 533.00, 1, NULL),
(10, 9, 1, 'Classic — Ganoderma Coffee (Green / Large)', '/uploads/products/classic-ganoderma-coffee-1.jpg', 787.00, 1, 54),
(11, 10, 33, 'Face Wash — Personal Care', '/uploads/products/face-wash-personal-care-1.jpg', 282.00, 3, NULL),
(12, 10, 1, 'Classic — Ganoderma Coffee (Green / Medium)', '/uploads/products/classic-ganoderma-coffee-1.jpg', 787.00, 1, 53),
(13, 11, 9, 'Mild Roast — Ganoderma Coffee (Green / Large)', '/uploads/products/mild-roast-ganoderma-coffee-1.jpg', 796.00, 1, 126),
(14, 11, 1, 'Classic — Ganoderma Coffee (Black / Medium)', '/uploads/products/classic-ganoderma-coffee-1.jpg', 787.00, 1, 50),
(15, 12, 45, 'Pomegranate — Beverages', '/uploads/products/pomegranate-beverages-1.jpg', 520.00, 17, NULL),
(16, 12, 1, 'Classic — Ganoderma Coffee (Green / Medium)', '/uploads/products/classic-ganoderma-coffee-1.jpg', 787.00, 2, 53),
(17, 13, 1, 'Classic — Ganoderma Coffee', '/uploads/products/classic-ganoderma-coffee-1.jpg', 758.00, 1, NULL),
(18, 14, 1, 'Classic — Ganoderma Coffee', '/uploads/products/classic-ganoderma-coffee-1.jpg', 758.00, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orderstatushistory`
--

CREATE TABLE `orderstatushistory` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `status` enum('PROCESSING','SHIPPED','DELIVERED','RETURNED','CANCELLED') NOT NULL,
  `note` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderstatushistory`
--

INSERT INTO `orderstatushistory` (`id`, `orderId`, `status`, `note`, `createdAt`) VALUES
(3, 2, 'PROCESSING', 'Order placed', '2026-08-07 16:46:27.756'),
(4, 3, 'PROCESSING', 'Order placed', '2026-08-08 02:36:38.397'),
(7, 3, 'SHIPPED', NULL, '2026-08-08 02:57:11.056'),
(8, 3, 'DELIVERED', NULL, '2026-08-08 02:58:47.084'),
(10, 6, 'PROCESSING', 'Order placed', '2026-08-08 03:12:46.686'),
(14, 9, 'PROCESSING', 'Order placed', '2026-08-08 06:11:02.191'),
(15, 10, 'PROCESSING', 'Order placed', '2026-08-08 06:16:49.230'),
(16, 10, 'SHIPPED', NULL, '2026-08-08 06:18:19.174'),
(17, 10, 'DELIVERED', NULL, '2026-08-08 06:18:56.174'),
(18, 11, 'PROCESSING', 'Order placed', '2026-08-09 04:13:45.035'),
(19, 12, 'PROCESSING', 'Order placed', '2026-08-09 06:27:35.768'),
(20, 13, 'PROCESSING', 'Order placed', '2026-08-09 07:12:52.358'),
(21, 14, 'PROCESSING', 'Order placed', '2026-08-09 09:14:02.718');

-- --------------------------------------------------------

--
-- Table structure for table `passwordresettoken`
--

CREATE TABLE `passwordresettoken` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `tokenHash` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentsettings`
--

CREATE TABLE `paymentsettings` (
  `id` varchar(191) NOT NULL DEFAULT 'singleton',
  `codEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `codMinOrderAmount` decimal(10,2) DEFAULT NULL,
  `codMaxOrderAmount` decimal(10,2) DEFAULT NULL,
  `esewaEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `esewaProductCode` varchar(191) DEFAULT NULL,
  `esewaSecretKey` varchar(191) DEFAULT NULL,
  `esewaPaymentUrl` varchar(191) DEFAULT NULL,
  `esewaStatusUrl` varchar(191) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `esewaLogo` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `paymentsettings`
--

INSERT INTO `paymentsettings` (`id`, `codEnabled`, `codMinOrderAmount`, `codMaxOrderAmount`, `esewaEnabled`, `esewaProductCode`, `esewaSecretKey`, `esewaPaymentUrl`, `esewaStatusUrl`, `updatedAt`, `esewaLogo`) VALUES
('singleton', 1, NULL, NULL, 1, NULL, NULL, NULL, NULL, '2026-08-07 17:10:37.114', '/uploads/payment/7dd7191d-b7c0-4850-8816-349daa708fe2.png');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `sku` varchar(191) DEFAULT NULL,
  `categoryId` int(11) NOT NULL,
  `brandId` int(11) DEFAULT NULL,
  `shortDescription` text DEFAULT NULL,
  `fullDescription` text NOT NULL,
  `costPrice` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `compareAtPrice` decimal(10,2) DEFAULT NULL,
  `discountType` enum('PERCENTAGE','FIXED') DEFAULT NULL,
  `discountValue` decimal(10,2) DEFAULT NULL,
  `taxClass` varchar(191) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `lowStockAlert` int(11) DEFAULT 5,
  `stockStatus` enum('IN_STOCK','OUT_OF_STOCK','ON_BACKORDER') NOT NULL DEFAULT 'IN_STOCK',
  `minimumOrderQuantity` int(11) NOT NULL DEFAULT 1,
  `maximumOrderQuantity` int(11) DEFAULT NULL,
  `weight` decimal(10,3) DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `width` decimal(10,2) DEFAULT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `featuredImage` varchar(191) DEFAULT NULL,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `isBestSeller` tinyint(1) NOT NULL DEFAULT 0,
  `isNewArrival` tinyint(1) NOT NULL DEFAULT 0,
  `isOnSale` tinyint(1) NOT NULL DEFAULT 0,
  `isTrending` tinyint(1) NOT NULL DEFAULT 0,
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDescription` varchar(191) DEFAULT NULL,
  `metaKeywords` varchar(191) DEFAULT NULL,
  `warranty` varchar(191) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `colorway` varchar(191) NOT NULL DEFAULT 'green',
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `publishedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `isFlash` tinyint(1) NOT NULL DEFAULT 0,
  `isSpecial` tinyint(1) NOT NULL DEFAULT 0,
  `isWeekly` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `slug`, `sku`, `categoryId`, `brandId`, `shortDescription`, `fullDescription`, `costPrice`, `price`, `compareAtPrice`, `discountType`, `discountValue`, `taxClass`, `stock`, `lowStockAlert`, `stockStatus`, `minimumOrderQuantity`, `maximumOrderQuantity`, `weight`, `length`, `width`, `height`, `featuredImage`, `isFeatured`, `isBestSeller`, `isNewArrival`, `isOnSale`, `isTrending`, `metaTitle`, `metaDescription`, `metaKeywords`, `warranty`, `tags`, `colorway`, `status`, `publishedAt`, `createdAt`, `updatedAt`, `deletedAt`, `isFlash`, `isSpecial`, `isWeekly`) VALUES
(1, 'Classic — Ganoderma Coffee', 'classic-ganoderma-coffee', 'SKU-CLASSI-1000', 2, 1, 'Classic from our Ganoderma Coffee range.', '<p>Classic — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 452.00, 758.00, NULL, NULL, NULL, NULL, 53, 10, 'IN_STOCK', 1, 10, 0.917, NULL, NULL, NULL, '/uploads/products/classic-ganoderma-coffee-featured.jpg', 0, 0, 0, 0, 0, 'Classic — Ganoderma Coffee', 'Buy Classic — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"3-in-1\"]', 'amber', 'PUBLISHED', '2026-08-07 14:44:09.059', '2026-08-07 14:44:09.063', '2026-08-09 09:14:02.783', NULL, 0, 0, 0),
(2, 'Mocha — Ganoderma Coffee', 'mocha-ganoderma-coffee', 'SKU-MOCHA--1001', 2, 2, 'Mocha from our Ganoderma Coffee range.', '<p>Mocha — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 482.00, 818.00, NULL, NULL, NULL, NULL, 11, 10, 'IN_STOCK', 1, 10, 0.158, NULL, NULL, NULL, '/uploads/products/mocha-ganoderma-coffee-featured.jpg', 1, 0, 0, 0, 0, 'Mocha — Ganoderma Coffee', 'Buy Mocha — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"3-in-1\"]', 'amber', 'PUBLISHED', '2026-08-07 14:44:09.168', '2026-08-07 14:44:09.170', '2026-08-09 07:03:02.385', NULL, 0, 0, 0),
(3, 'Hazelnut — Ganoderma Coffee', 'hazelnut-ganoderma-coffee', 'SKU-HAZELN-1002', 2, 3, 'Hazelnut from our Ganoderma Coffee range.', '<p>Hazelnut — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 525.00, 885.00, 1018.00, NULL, NULL, NULL, 59, 10, 'IN_STOCK', 1, 10, 0.295, NULL, NULL, NULL, '/uploads/products/hazelnut-ganoderma-coffee-featured.jpg', 0, 0, 0, 0, 0, 'Hazelnut — Ganoderma Coffee', 'Buy Hazelnut — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"3-in-1\"]', 'amber', 'PUBLISHED', '2026-08-07 14:44:09.444', '2026-08-07 14:44:09.446', '2026-08-09 07:03:02.508', NULL, 0, 0, 0),
(4, 'Vanilla — Ganoderma Coffee', 'vanilla-ganoderma-coffee', 'SKU-VANILL-1003', 2, 4, 'Vanilla from our Ganoderma Coffee range.', '<p>Vanilla — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 536.00, 899.00, 1034.00, NULL, NULL, NULL, 91, 10, 'IN_STOCK', 1, 10, 0.904, NULL, NULL, NULL, '/uploads/products/vanilla-ganoderma-coffee-featured.jpg', 0, 0, 0, 0, 0, 'Vanilla — Ganoderma Coffee', 'Buy Vanilla — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"3-in-1\"]', 'amber', 'PUBLISHED', NULL, '2026-08-07 14:44:09.554', '2026-08-09 07:03:02.606', NULL, 0, 0, 0),
(5, 'Extra Strength — Ganoderma Coffee', 'extra-strength-ganoderma-coffee', 'SKU-EXTRA--1004', 2, 5, 'Extra Strength from our Ganoderma Coffee range.', '<p>Extra Strength — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 580.00, 912.00, 1049.00, NULL, NULL, NULL, 68, 10, 'IN_STOCK', 1, 10, 0.764, NULL, NULL, NULL, '/uploads/products/extra-strength-ganoderma-coffee-featured.jpg', 0, 0, 0, 0, 0, 'Extra Strength — Ganoderma Coffee', 'Buy Extra Strength — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"3-in-1\"]', 'amber', 'DRAFT', '2026-08-07 14:44:09.625', '2026-08-07 14:44:09.628', '2026-08-09 07:03:02.774', NULL, 0, 0, 0),
(6, 'Decaf — Ganoderma Coffee', 'decaf-ganoderma-coffee', 'SKU-DECAF--1005', 2, 6, 'Decaf from our Ganoderma Coffee range.', '<p>Decaf — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 583.00, 979.00, NULL, NULL, NULL, NULL, 2, 10, 'IN_STOCK', 1, 10, 0.902, NULL, NULL, NULL, '/uploads/products/decaf-ganoderma-coffee-featured.jpg', 0, 1, 0, 0, 0, 'Decaf — Ganoderma Coffee', 'Buy Decaf — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"3-in-1\"]', 'amber', 'PUBLISHED', '2026-08-07 14:44:09.686', '2026-08-07 14:44:09.688', '2026-08-09 07:03:03.454', NULL, 0, 0, 0),
(7, 'Original — Ganoderma Coffee', 'original-ganoderma-coffee', 'SKU-ORIGIN-1006', 3, 7, 'Original from our Ganoderma Coffee range.', '<p>Original — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 433.00, 697.00, NULL, NULL, NULL, NULL, 61, 10, 'IN_STOCK', 1, 10, 0.219, NULL, NULL, NULL, '/uploads/products/original-ganoderma-coffee-featured.jpg', 0, 1, 0, 0, 0, 'Original — Ganoderma Coffee', 'Buy Original — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"black-coffee\"]', 'amber', 'PUBLISHED', '2026-08-07 14:44:09.768', '2026-08-07 14:44:09.770', '2026-08-09 07:03:03.771', NULL, 0, 0, 0),
(8, 'Extra Bold — Ganoderma Coffee', 'extra-bold-ganoderma-coffee', 'SKU-EXTRA--1007', 3, 8, 'Extra Bold from our Ganoderma Coffee range.', '<p>Extra Bold — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 451.00, 709.00, 815.00, NULL, NULL, NULL, 44, 10, 'IN_STOCK', 1, 10, 0.844, NULL, NULL, NULL, '/uploads/products/extra-bold-ganoderma-coffee-featured.jpg', 0, 0, 0, 0, 0, 'Extra Bold — Ganoderma Coffee', 'Buy Extra Bold — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"black-coffee\"]', 'amber', 'PUBLISHED', '2026-08-07 14:44:09.959', '2026-08-07 14:44:09.961', '2026-08-09 07:03:03.875', NULL, 0, 0, 0),
(9, 'Mild Roast — Ganoderma Coffee', 'mild-roast-ganoderma-coffee', 'SKU-MILD-R-1008', 3, 1, 'Mild Roast from our Ganoderma Coffee range.', '<p>Mild Roast — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 449.00, 758.00, NULL, NULL, NULL, NULL, 76, 10, 'IN_STOCK', 1, 10, 0.403, NULL, NULL, NULL, '/uploads/products/mild-roast-ganoderma-coffee-featured.jpg', 0, 1, 0, 0, 0, 'Mild Roast — Ganoderma Coffee', 'Buy Mild Roast — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"black-coffee\"]', 'amber', 'PUBLISHED', '2026-08-07 14:44:10.171', '2026-08-07 14:44:10.173', '2026-08-09 07:03:03.977', NULL, 0, 0, 0),
(10, 'Dark Roast — Ganoderma Coffee', 'dark-roast-ganoderma-coffee', 'SKU-DARK-R-1009', 3, 2, 'Dark Roast from our Ganoderma Coffee range.', '<p>Dark Roast — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 467.00, 788.00, NULL, NULL, NULL, NULL, 46, 10, 'IN_STOCK', 1, 10, 0.816, NULL, NULL, NULL, '/uploads/products/dark-roast-ganoderma-coffee-featured.jpg', 0, 0, 0, 1, 0, 'Dark Roast — Ganoderma Coffee', 'Buy Dark Roast — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"black-coffee\"]', 'amber', 'PUBLISHED', '2026-08-07 14:44:10.235', '2026-08-07 14:44:10.236', '2026-08-09 07:03:04.093', NULL, 0, 0, 0),
(11, 'Single Origin — Ganoderma Coffee', 'single-origin-ganoderma-coffee', 'SKU-SINGLE-1010', 3, 3, 'Single Origin from our Ganoderma Coffee range.', '<p>Single Origin — Ganoderma Coffee is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 520.00, 859.00, 988.00, NULL, NULL, NULL, 93, 10, 'IN_STOCK', 1, 10, 0.729, NULL, NULL, NULL, '/uploads/products/single-origin-ganoderma-coffee-featured.jpg', 0, 0, 1, 0, 1, 'Single Origin — Ganoderma Coffee', 'Buy Single Origin — Ganoderma Coffee online — natural wellness products with fast delivery.', NULL, NULL, '[\"coffee\",\"ganoderma\",\"black-coffee\"]', 'amber', 'PUBLISHED', '2026-08-07 14:44:10.285', '2026-08-07 14:44:10.287', '2026-08-09 07:03:04.193', NULL, 0, 0, 0),
(12, 'Tablets 250mg (100ct) — Spirulina & Supplements', 'tablets-250mg-100ct-spirulina-supplements', 'SKU-TABLET-1011', 5, 4, 'Tablets 250mg (100ct) from our Spirulina & Supplements range.', '<p>Tablets 250mg (100ct) — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 522.00, 886.00, NULL, NULL, NULL, NULL, 47, 10, 'IN_STOCK', 1, 10, 0.622, NULL, NULL, NULL, '/uploads/products/tablets-250mg-100ct-spirulina-supplements-featured.jpg', 0, 0, 0, 0, 0, 'Tablets 250mg (100ct) — Spirulina & Supplements', 'Buy Tablets 250mg (100ct) — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"tablets\"]', 'green', 'PUBLISHED', '2026-08-07 14:44:10.352', '2026-08-07 14:44:10.355', '2026-08-09 07:03:04.294', NULL, 0, 0, 0),
(13, 'Tablets 250mg (250ct) — Spirulina & Supplements', 'tablets-250mg-250ct-spirulina-supplements', 'SKU-TABLET-1012', 5, 5, 'Tablets 250mg (250ct) from our Spirulina & Supplements range.', '<p>Tablets 250mg (250ct) — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 610.00, 1005.00, 1156.00, NULL, NULL, NULL, 19, 10, 'IN_STOCK', 1, 10, 0.748, NULL, NULL, NULL, '/uploads/products/tablets-250mg-250ct-spirulina-supplements-featured.jpg', 0, 1, 0, 0, 0, 'Tablets 250mg (250ct) — Spirulina & Supplements', 'Buy Tablets 250mg (250ct) — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"tablets\"]', 'green', 'PUBLISHED', NULL, '2026-08-07 14:44:10.467', '2026-08-09 07:03:04.412', NULL, 0, 0, 0),
(14, 'Tablets 500mg (100ct) — Spirulina & Supplements', 'tablets-500mg-100ct-spirulina-supplements', 'SKU-TABLET-1013', 5, 6, 'Tablets 500mg (100ct) from our Spirulina & Supplements range.', '<p>Tablets 500mg (100ct) — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 700.00, 1138.00, 1309.00, NULL, NULL, NULL, 31, 10, 'IN_STOCK', 1, 10, 0.398, NULL, NULL, NULL, '/uploads/products/tablets-500mg-100ct-spirulina-supplements-featured.jpg', 0, 0, 0, 0, 1, 'Tablets 500mg (100ct) — Spirulina & Supplements', 'Buy Tablets 500mg (100ct) — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"tablets\"]', 'green', 'PUBLISHED', '2026-08-07 14:44:10.548', '2026-08-07 14:44:10.551', '2026-08-09 07:03:04.556', NULL, 0, 0, 0),
(15, 'Tablets 500mg (250ct) — Spirulina & Supplements', 'tablets-500mg-250ct-spirulina-supplements', 'SKU-TABLET-1014', 5, 7, 'Tablets 500mg (250ct) from our Spirulina & Supplements range.', '<p>Tablets 500mg (250ct) — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 749.00, 1233.00, 1418.00, NULL, NULL, NULL, 66, 10, 'IN_STOCK', 1, 10, 0.186, NULL, NULL, NULL, '/uploads/products/tablets-500mg-250ct-spirulina-supplements-featured.jpg', 1, 0, 1, 0, 0, 'Tablets 500mg (250ct) — Spirulina & Supplements', 'Buy Tablets 500mg (250ct) — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"tablets\"]', 'green', 'PUBLISHED', '2026-08-07 14:44:10.621', '2026-08-07 14:44:10.623', '2026-08-09 07:03:04.740', NULL, 0, 0, 0),
(16, 'Tablets 500mg (500ct) — Spirulina & Supplements', 'tablets-500mg-500ct-spirulina-supplements', 'SKU-TABLET-1015', 5, 8, 'Tablets 500mg (500ct) from our Spirulina & Supplements range.', '<p>Tablets 500mg (500ct) — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 822.00, 1376.00, NULL, NULL, NULL, NULL, 67, 10, 'IN_STOCK', 1, 10, 0.170, NULL, NULL, NULL, '/uploads/products/tablets-500mg-500ct-spirulina-supplements-featured.jpg', 1, 0, 0, 0, 0, 'Tablets 500mg (500ct) — Spirulina & Supplements', 'Buy Tablets 500mg (500ct) — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"tablets\"]', 'green', 'ARCHIVED', '2026-08-07 14:44:10.694', '2026-08-07 14:44:10.697', '2026-08-09 07:03:04.961', NULL, 0, 0, 0),
(17, 'Capsules 60ct — Spirulina & Supplements', 'capsules-60ct-spirulina-supplements', 'SKU-CAPSUL-1016', 6, 1, 'Capsules 60ct from our Spirulina & Supplements range.', '<p>Capsules 60ct — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 464.00, 744.00, 856.00, NULL, NULL, NULL, 116, 10, 'IN_STOCK', 1, 10, 0.359, NULL, NULL, NULL, '/uploads/products/capsules-60ct-spirulina-supplements-featured.jpg', 0, 1, 0, 0, 0, 'Capsules 60ct — Spirulina & Supplements', 'Buy Capsules 60ct — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"capsules\"]', 'green', 'PUBLISHED', '2026-08-07 14:44:10.766', '2026-08-07 14:44:10.768', '2026-08-09 07:03:05.061', NULL, 0, 0, 0),
(18, 'Capsules 90ct — Spirulina & Supplements', 'capsules-90ct-spirulina-supplements', 'SKU-CAPSUL-1017', 6, 2, 'Capsules 90ct from our Spirulina & Supplements range.', '<p>Capsules 90ct — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 520.00, 876.00, NULL, NULL, NULL, NULL, 38, 10, 'IN_STOCK', 1, 10, 0.604, NULL, NULL, NULL, '/uploads/products/capsules-90ct-spirulina-supplements-featured.jpg', 0, 0, 0, 0, 0, 'Capsules 90ct — Spirulina & Supplements', 'Buy Capsules 90ct — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"capsules\"]', 'green', 'PUBLISHED', NULL, '2026-08-07 14:44:10.899', '2026-08-09 07:03:05.145', NULL, 0, 0, 0),
(19, 'Capsules 120ct — Spirulina & Supplements', 'capsules-120ct-spirulina-supplements', 'SKU-CAPSUL-1018', 6, 3, 'Capsules 120ct from our Spirulina & Supplements range.', '<p>Capsules 120ct — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 597.00, 995.00, 1144.00, NULL, NULL, NULL, 22, 10, 'IN_STOCK', 1, 10, 0.399, NULL, NULL, NULL, '/uploads/products/capsules-120ct-spirulina-supplements-featured.jpg', 0, 1, 1, 1, 0, 'Capsules 120ct — Spirulina & Supplements', 'Buy Capsules 120ct — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"capsules\"]', 'green', 'PUBLISHED', NULL, '2026-08-07 14:44:10.947', '2026-08-09 07:03:05.260', NULL, 0, 0, 0),
(20, 'Capsules 180ct — Spirulina & Supplements', 'capsules-180ct-spirulina-supplements', 'SKU-CAPSUL-1019', 6, 4, 'Capsules 180ct from our Spirulina & Supplements range.', '<p>Capsules 180ct — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 634.00, 1064.00, NULL, NULL, NULL, NULL, 65, 10, 'IN_STOCK', 1, 10, 0.418, NULL, NULL, NULL, '/uploads/products/capsules-180ct-spirulina-supplements-featured.jpg', 0, 0, 0, 1, 0, 'Capsules 180ct — Spirulina & Supplements', 'Buy Capsules 180ct — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"capsules\"]', 'green', 'PUBLISHED', '2026-08-07 14:44:11.091', '2026-08-07 14:44:11.093', '2026-08-09 07:03:05.376', NULL, 0, 0, 0),
(21, 'Capsules 240ct — Spirulina & Supplements', 'capsules-240ct-spirulina-supplements', 'SKU-CAPSUL-1020', 6, 5, 'Capsules 240ct from our Spirulina & Supplements range.', '<p>Capsules 240ct — Spirulina & Supplements is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 730.00, 1178.00, 1355.00, NULL, NULL, NULL, 10, 10, 'IN_STOCK', 1, 10, 0.118, NULL, NULL, NULL, '/uploads/products/capsules-240ct-spirulina-supplements-featured.jpg', 0, 0, 0, 1, 0, 'Capsules 240ct — Spirulina & Supplements', 'Buy Capsules 240ct — Spirulina & Supplements online — natural wellness products with fast delivery.', NULL, NULL, '[\"spirulina\",\"supplement\",\"capsules\"]', 'green', 'PUBLISHED', '2026-08-07 14:44:11.337', '2026-08-07 14:44:11.339', '2026-08-09 07:03:05.465', NULL, 0, 0, 0),
(22, 'Toothpaste — Personal Care', 'toothpaste-personal-care', 'SKU-TOOTHP-1021', 8, 6, 'Toothpaste from our Personal Care range.', '<p>Toothpaste — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 118.00, 243.00, NULL, NULL, NULL, NULL, 115, 10, 'IN_STOCK', 1, 10, 0.264, NULL, NULL, NULL, '/uploads/products/toothpaste-personal-care-featured.jpg', 0, 0, 1, 0, 1, 'Toothpaste — Personal Care', 'Buy Toothpaste — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"oral-care\",\"ganozhi\"]', 'blue', 'PUBLISHED', '2026-08-07 14:44:11.397', '2026-08-07 14:44:11.399', '2026-08-09 07:03:05.577', NULL, 0, 0, 0),
(23, 'Mouthwash — Personal Care', 'mouthwash-personal-care', 'SKU-MOUTHW-1022', 8, 7, 'Mouthwash from our Personal Care range.', '<p>Mouthwash — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 140.00, 239.00, 275.00, NULL, NULL, NULL, 15, 10, 'IN_STOCK', 1, 10, 0.627, NULL, NULL, NULL, '/uploads/products/mouthwash-personal-care-featured.jpg', 0, 0, 0, 0, 0, 'Mouthwash — Personal Care', 'Buy Mouthwash — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"oral-care\",\"ganozhi\"]', 'blue', 'DRAFT', '2026-08-07 14:44:11.473', '2026-08-07 14:44:11.475', '2026-08-09 07:03:05.673', NULL, 0, 0, 0),
(24, 'Toothbrush Set — Personal Care', 'toothbrush-set-personal-care', 'SKU-TOOTHB-1023', 8, 8, 'Toothbrush Set from our Personal Care range.', '<p>Toothbrush Set — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 185.00, 317.00, NULL, NULL, NULL, NULL, 82, 10, 'IN_STOCK', 1, 10, 0.450, NULL, NULL, NULL, '/uploads/products/toothbrush-set-personal-care-featured.jpg', 0, 0, 0, 0, 0, 'Toothbrush Set — Personal Care', 'Buy Toothbrush Set — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"oral-care\",\"ganozhi\"]', 'blue', 'PUBLISHED', '2026-08-07 14:44:11.562', '2026-08-07 14:44:11.564', '2026-08-09 07:03:06.065', NULL, 0, 0, 0),
(25, 'Whitening Gel — Personal Care', 'whitening-gel-personal-care', 'SKU-WHITEN-1024', 8, 1, 'Whitening Gel from our Personal Care range.', '<p>Whitening Gel — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 189.00, 348.00, NULL, NULL, NULL, NULL, 13, 10, 'IN_STOCK', 1, 10, 0.187, NULL, NULL, NULL, '/uploads/products/whitening-gel-personal-care-featured.jpg', 0, 0, 0, 0, 0, 'Whitening Gel — Personal Care', 'Buy Whitening Gel — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"oral-care\",\"ganozhi\"]', 'blue', 'PUBLISHED', '2026-08-07 14:44:11.658', '2026-08-07 14:44:11.660', '2026-08-09 07:03:06.499', NULL, 0, 0, 0),
(26, 'Kids Toothpaste — Personal Care', 'kids-toothpaste-personal-care', 'SKU-KIDS-T-1025', 8, 2, 'Kids Toothpaste from our Personal Care range.', '<p>Kids Toothpaste — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 210.00, 381.00, NULL, NULL, NULL, NULL, 38, 10, 'IN_STOCK', 1, 10, 0.384, NULL, NULL, NULL, '/uploads/products/kids-toothpaste-personal-care-featured.jpg', 0, 0, 1, 0, 0, 'Kids Toothpaste — Personal Care', 'Buy Kids Toothpaste — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"oral-care\",\"ganozhi\"]', 'blue', 'ARCHIVED', '2026-08-07 14:44:11.767', '2026-08-07 14:44:11.769', '2026-08-09 07:03:06.602', NULL, 0, 0, 0),
(27, 'Shampoo — Personal Care', 'shampoo-personal-care', 'SKU-SHAMPO-1026', 9, 3, 'Shampoo from our Personal Care range.', '<p>Shampoo — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 224.00, 378.00, NULL, NULL, NULL, NULL, 70, 10, 'IN_STOCK', 1, 10, 0.106, NULL, NULL, NULL, '/uploads/products/shampoo-personal-care-featured.jpg', 0, 1, 1, 0, 0, 'Shampoo — Personal Care', 'Buy Shampoo — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"hair-care\",\"ganozhi\"]', 'blue', 'PUBLISHED', '2026-08-07 14:44:11.839', '2026-08-07 14:44:11.841', '2026-08-09 07:03:06.688', NULL, 0, 0, 0),
(28, 'Conditioner — Personal Care', 'conditioner-personal-care', 'SKU-CONDIT-1027', 9, 4, 'Conditioner from our Personal Care range.', '<p>Conditioner — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 242.00, 427.00, NULL, NULL, NULL, NULL, 115, 10, 'IN_STOCK', 1, 10, 0.317, NULL, NULL, NULL, '/uploads/products/conditioner-personal-care-featured.jpg', 1, 0, 0, 0, 0, 'Conditioner — Personal Care', 'Buy Conditioner — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"hair-care\",\"ganozhi\"]', 'blue', 'PUBLISHED', '2026-08-07 14:44:11.959', '2026-08-07 14:44:11.961', '2026-08-09 07:03:06.850', NULL, 0, 0, 0),
(29, 'Hair Oil — Personal Care', 'hair-oil-personal-care', 'SKU-HAIR-O-1028', 9, 5, 'Hair Oil from our Personal Care range.', '<p>Hair Oil — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 289.00, 490.00, NULL, NULL, NULL, NULL, 60, 10, 'IN_STOCK', 1, 10, 0.901, NULL, NULL, NULL, '/uploads/products/hair-oil-personal-care-featured.jpg', 0, 1, 0, 0, 0, 'Hair Oil — Personal Care', 'Buy Hair Oil — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"hair-care\",\"ganozhi\"]', 'blue', 'PUBLISHED', NULL, '2026-08-07 14:44:12.027', '2026-08-09 07:03:07.000', NULL, 0, 0, 0),
(30, 'Anti-Dandruff Shampoo — Personal Care', 'anti-dandruff-shampoo-personal-care', 'SKU-ANTI-D-1029', 9, 6, 'Anti-Dandruff Shampoo from our Personal Care range.', '<p>Anti-Dandruff Shampoo — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 311.00, 543.00, NULL, NULL, NULL, NULL, 73, 10, 'IN_STOCK', 1, 10, 0.158, NULL, NULL, NULL, '/uploads/products/anti-dandruff-shampoo-personal-care-featured.jpg', 0, 0, 0, 1, 0, 'Anti-Dandruff Shampoo — Personal Care', 'Buy Anti-Dandruff Shampoo — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"hair-care\",\"ganozhi\"]', 'blue', 'PUBLISHED', '2026-08-07 14:44:12.242', '2026-08-07 14:44:12.244', '2026-08-09 07:03:07.181', NULL, 0, 0, 0),
(31, 'Hair Serum — Personal Care', 'hair-serum-personal-care', 'SKU-HAIR-S-1030', 9, 7, 'Hair Serum from our Personal Care range.', '<p>Hair Serum — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 338.00, 543.00, NULL, NULL, NULL, NULL, 105, 10, 'IN_STOCK', 1, 10, 0.736, NULL, NULL, NULL, '/uploads/products/hair-serum-personal-care-featured.jpg', 0, 0, 1, 0, 1, 'Hair Serum — Personal Care', 'Buy Hair Serum — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"hair-care\",\"ganozhi\"]', 'blue', 'PUBLISHED', '2026-08-07 14:44:12.395', '2026-08-07 14:44:12.398', '2026-08-09 07:03:07.354', NULL, 0, 0, 0),
(32, 'Herbal Soap — Personal Care', 'herbal-soap-personal-care', 'SKU-HERBAL-1031', 10, 8, 'Herbal Soap from our Personal Care range.', '<p>Herbal Soap — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 173.00, 263.00, 302.00, NULL, NULL, NULL, 113, 10, 'IN_STOCK', 1, 10, 0.155, NULL, NULL, NULL, '/uploads/products/herbal-soap-personal-care-featured.jpg', 0, 0, 0, 0, 0, 'Herbal Soap — Personal Care', 'Buy Herbal Soap — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"skin-care\",\"ganozhi\"]', 'green', 'PUBLISHED', '2026-08-07 14:44:12.511', '2026-08-07 14:44:12.513', '2026-08-09 07:03:07.578', NULL, 0, 0, 0),
(33, 'Face Wash — Personal Care', 'face-wash-personal-care', 'SKU-FACE-W-1032', 10, 1, 'Face Wash from our Personal Care range.', '<p>Face Wash — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 191.00, 330.00, 379.00, NULL, NULL, NULL, 41, 10, 'IN_STOCK', 1, 10, 0.543, NULL, NULL, NULL, '/uploads/products/face-wash-personal-care-featured.jpg', 0, 0, 0, 0, 0, 'Face Wash — Personal Care', 'Buy Face Wash — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"skin-care\",\"ganozhi\"]', 'green', 'ARCHIVED', '2026-08-07 14:44:12.603', '2026-08-07 14:44:12.605', '2026-08-09 07:03:07.671', NULL, 0, 0, 0),
(34, 'Body Lotion — Personal Care', 'body-lotion-personal-care', 'SKU-BODY-L-1033', 10, 2, 'Body Lotion from our Personal Care range.', '<p>Body Lotion — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 209.00, 384.00, NULL, NULL, NULL, NULL, 27, 10, 'IN_STOCK', 1, 10, 0.160, NULL, NULL, NULL, '/uploads/products/body-lotion-personal-care-featured.jpg', 1, 1, 0, 0, 0, 'Body Lotion — Personal Care', 'Buy Body Lotion — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"skin-care\",\"ganozhi\"]', 'green', 'PUBLISHED', '2026-08-07 14:44:12.766', '2026-08-07 14:44:12.769', '2026-08-09 07:03:07.780', NULL, 0, 0, 0),
(35, 'Face Cream — Personal Care', 'face-cream-personal-care', 'SKU-FACE-C-1034', 10, 3, 'Face Cream from our Personal Care range.', '<p>Face Cream — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 241.00, 413.00, NULL, NULL, NULL, NULL, 79, 10, 'IN_STOCK', 1, 10, 0.847, NULL, NULL, NULL, '/uploads/products/face-cream-personal-care-featured.jpg', 0, 0, 0, 1, 0, 'Face Cream — Personal Care', 'Buy Face Cream — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"skin-care\",\"ganozhi\"]', 'green', 'PUBLISHED', '2026-08-07 14:44:12.873', '2026-08-07 14:44:12.876', '2026-08-09 07:03:07.863', NULL, 0, 0, 0),
(36, 'Body Scrub — Personal Care', 'body-scrub-personal-care', 'SKU-BODY-S-1035', 10, 4, 'Body Scrub from our Personal Care range.', '<p>Body Scrub — Personal Care is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 287.00, 452.00, 520.00, NULL, NULL, NULL, 68, 10, 'IN_STOCK', 1, 10, 0.174, NULL, NULL, NULL, '/uploads/products/body-scrub-personal-care-featured.jpg', 0, 0, 0, 1, 0, 'Body Scrub — Personal Care', 'Buy Body Scrub — Personal Care online — natural wellness products with fast delivery.', NULL, NULL, '[\"skin-care\",\"ganozhi\"]', 'green', 'DRAFT', '2026-08-07 14:44:13.035', '2026-08-07 14:44:13.037', '2026-08-09 07:03:08.024', NULL, 0, 0, 0),
(37, 'Black Tea — Beverages', 'black-tea-beverages', 'SKU-BLACK--1036', 12, 5, 'Black Tea from our Beverages range.', '<p>Black Tea — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 277.00, 477.00, NULL, NULL, NULL, NULL, 17, 10, 'IN_STOCK', 1, 10, 0.905, NULL, NULL, NULL, '/uploads/products/black-tea-beverages-featured.jpg', 0, 0, 0, 0, 1, 'Black Tea — Beverages', 'Buy Black Tea — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"tea\",\"beverage\"]', 'red', 'PUBLISHED', '2026-08-07 14:44:13.097', '2026-08-07 14:44:13.098', '2026-08-09 07:03:08.150', NULL, 0, 0, 0),
(38, 'Green Tea — Beverages', 'green-tea-beverages', 'SKU-GREEN--1037', 12, 6, 'Green Tea from our Beverages range.', '<p>Green Tea — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 297.00, 539.00, 620.00, NULL, NULL, NULL, 51, 10, 'IN_STOCK', 1, 10, 0.607, NULL, NULL, NULL, '/uploads/products/green-tea-beverages-featured.jpg', 0, 0, 0, 0, 1, 'Green Tea — Beverages', 'Buy Green Tea — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"tea\",\"beverage\"]', 'red', 'PUBLISHED', '2026-08-07 14:44:13.190', '2026-08-07 14:44:13.192', '2026-08-09 07:03:08.556', NULL, 0, 0, 0),
(39, 'Herbal Tea — Beverages', 'herbal-tea-beverages', 'SKU-HERBAL-1038', 12, 7, 'Herbal Tea from our Beverages range.', '<p>Herbal Tea — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 320.00, 540.00, NULL, NULL, NULL, NULL, 97, 10, 'IN_STOCK', 1, 10, 0.301, NULL, NULL, NULL, '/uploads/products/herbal-tea-beverages-featured.jpg', 0, 0, 0, 0, 0, 'Herbal Tea — Beverages', 'Buy Herbal Tea — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"tea\",\"beverage\"]', 'red', 'PUBLISHED', '2026-08-07 14:44:13.363', '2026-08-07 14:44:13.366', '2026-08-09 07:03:09.001', NULL, 0, 0, 0),
(40, 'Iced Tea Mix — Beverages', 'iced-tea-mix-beverages', 'SKU-ICED-T-1039', 12, 8, 'Iced Tea Mix from our Beverages range.', '<p>Iced Tea Mix — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 352.00, 612.00, 704.00, NULL, NULL, NULL, 52, 10, 'IN_STOCK', 1, 10, 0.487, NULL, NULL, NULL, '/uploads/products/iced-tea-mix-beverages-featured.jpg', 0, 0, 0, 0, 0, 'Iced Tea Mix — Beverages', 'Buy Iced Tea Mix — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"tea\",\"beverage\"]', 'red', 'PUBLISHED', '2026-08-07 14:44:13.445', '2026-08-07 14:44:13.448', '2026-08-09 07:03:09.130', NULL, 0, 0, 0),
(41, 'Chamomile Tea — Beverages', 'chamomile-tea-beverages', 'SKU-CHAMOM-1040', 12, 1, 'Chamomile Tea from our Beverages range.', '<p>Chamomile Tea — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 387.00, 629.00, NULL, NULL, NULL, NULL, 97, 10, 'IN_STOCK', 1, 10, 0.626, NULL, NULL, NULL, '/uploads/products/chamomile-tea-beverages-featured.jpg', 0, 0, 0, 0, 0, 'Chamomile Tea — Beverages', 'Buy Chamomile Tea — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"tea\",\"beverage\"]', 'red', 'PUBLISHED', '2026-08-07 14:44:13.524', '2026-08-07 14:44:13.527', '2026-08-09 07:03:09.286', NULL, 0, 0, 0),
(42, 'Roselle Concentrate — Beverages', 'roselle-concentrate-beverages', 'SKU-ROSELL-1041', 13, 2, 'Roselle Concentrate from our Beverages range.', '<p>Roselle Concentrate — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 248.00, 447.00, 514.00, NULL, NULL, NULL, 106, 10, 'IN_STOCK', 1, 10, 0.413, NULL, NULL, NULL, '/uploads/products/roselle-concentrate-beverages-featured.jpg', 1, 0, 0, 1, 0, 'Roselle Concentrate — Beverages', 'Buy Roselle Concentrate — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"juice\",\"beverage\"]', 'red', 'PUBLISHED', '2026-08-07 14:44:13.600', '2026-08-07 14:44:13.602', '2026-08-09 07:03:09.446', NULL, 0, 0, 0),
(43, 'Mixed Berry — Beverages', 'mixed-berry-beverages', 'SKU-MIXED--1042', 13, 3, 'Mixed Berry from our Beverages range.', '<p>Mixed Berry — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 292.00, 485.00, 558.00, NULL, NULL, NULL, 26, 10, 'IN_STOCK', 1, 10, 0.308, NULL, NULL, NULL, '/uploads/products/mixed-berry-beverages-featured.jpg', 0, 0, 0, 1, 0, 'Mixed Berry — Beverages', 'Buy Mixed Berry — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"juice\",\"beverage\"]', 'red', 'PUBLISHED', NULL, '2026-08-07 14:44:13.662', '2026-08-09 07:03:09.782', NULL, 0, 0, 0),
(44, 'Aloe Vera — Beverages', 'aloe-vera-beverages', 'SKU-ALOE-V-1043', 13, 4, 'Aloe Vera from our Beverages range.', '<p>Aloe Vera — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 316.00, 525.00, NULL, NULL, NULL, NULL, 52, 10, 'IN_STOCK', 1, 10, 0.594, NULL, NULL, NULL, '/uploads/products/aloe-vera-beverages-featured.jpg', 0, 0, 0, 1, 0, 'Aloe Vera — Beverages', 'Buy Aloe Vera — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"juice\",\"beverage\"]', 'red', 'PUBLISHED', '2026-08-07 14:44:13.730', '2026-08-07 14:44:13.732', '2026-08-09 07:03:09.986', NULL, 0, 0, 0),
(45, 'Pomegranate — Beverages', 'pomegranate-beverages', 'SKU-POMEGR-1044', 13, 5, 'Pomegranate from our Beverages range.', '<p>Pomegranate — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 328.00, 541.00, NULL, NULL, NULL, NULL, 9, 10, 'IN_STOCK', 1, 10, 0.205, NULL, NULL, NULL, '/uploads/products/pomegranate-beverages-featured.jpg', 1, 0, 0, 1, 0, 'Pomegranate — Beverages', 'Buy Pomegranate — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"juice\",\"beverage\"]', 'red', 'PUBLISHED', NULL, '2026-08-07 14:44:13.802', '2026-08-09 07:03:10.110', NULL, 0, 0, 0),
(46, 'Ginger Lemon — Beverages', 'ginger-lemon-beverages', 'SKU-GINGER-1045', 13, 6, 'Ginger Lemon from our Beverages range.', '<p>Ginger Lemon — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 363.00, 554.00, 637.00, NULL, NULL, NULL, 75, 10, 'IN_STOCK', 1, 10, 0.417, NULL, NULL, NULL, '/uploads/products/ginger-lemon-beverages-featured.jpg', 0, 0, 0, 0, 0, 'Ginger Lemon — Beverages', 'Buy Ginger Lemon — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"juice\",\"beverage\"]', 'red', 'PUBLISHED', '2026-08-07 14:44:13.873', '2026-08-07 14:44:13.875', '2026-08-09 07:03:10.266', NULL, 0, 0, 0),
(47, 'Ginger Lemon — Beverages (Copy)', 'ginger-lemon-beverages-copy', 'PRD-GING-JYW3S', 13, 6, 'Ginger Lemon from our Beverages range.', '<p>Ginger Lemon — Beverages is crafted for daily wellness, combining quality ingredients with modern manufacturing standards. Perfect for anyone looking to make natural products part of their routine.</p>', 363.00, 605.00, NULL, NULL, NULL, NULL, 34, 10, 'IN_STOCK', 1, 10, 0.417, NULL, NULL, NULL, '/uploads/products/ginger-lemon-beverages-featured.jpg', 0, 0, 0, 0, 0, 'Ginger Lemon — Beverages', 'Buy Ginger Lemon — Beverages online — natural wellness products with fast delivery.', NULL, NULL, '[\"juice\",\"beverage\"]', 'red', 'DRAFT', NULL, '2026-08-08 02:28:59.794', '2026-08-08 02:29:06.566', '2026-08-08 02:29:06.564', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `productimage`
--

CREATE TABLE `productimage` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `url` varchar(191) DEFAULT NULL,
  `alt` varchar(191) NOT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productimage`
--

INSERT INTO `productimage` (`id`, `productId`, `url`, `alt`, `sortOrder`) VALUES
(116, 47, '/uploads/products/ginger-lemon-beverages-1.jpg', 'Ginger Lemon — Beverages photo 1', 0),
(117, 47, '/uploads/products/ginger-lemon-beverages-2.jpg', 'Ginger Lemon — Beverages photo 2', 1),
(118, 47, '/uploads/products/ginger-lemon-beverages-3.jpg', 'Ginger Lemon — Beverages photo 3', 2),
(360, 1, '/uploads/products/classic-ganoderma-coffee-1.jpg', 'Classic — Ganoderma Coffee photo 1', 0),
(361, 1, '/uploads/products/classic-ganoderma-coffee-2.jpg', 'Classic — Ganoderma Coffee photo 2', 1),
(362, 1, '/uploads/products/classic-ganoderma-coffee-3.jpg', 'Classic — Ganoderma Coffee photo 3', 2),
(363, 2, '/uploads/products/mocha-ganoderma-coffee-1.jpg', 'Mocha — Ganoderma Coffee photo 1', 0),
(364, 2, '/uploads/products/mocha-ganoderma-coffee-2.jpg', 'Mocha — Ganoderma Coffee photo 2', 1),
(365, 3, '/uploads/products/hazelnut-ganoderma-coffee-1.jpg', 'Hazelnut — Ganoderma Coffee photo 1', 0),
(366, 3, '/uploads/products/hazelnut-ganoderma-coffee-2.jpg', 'Hazelnut — Ganoderma Coffee photo 2', 1),
(367, 3, '/uploads/products/hazelnut-ganoderma-coffee-3.jpg', 'Hazelnut — Ganoderma Coffee photo 3', 2),
(368, 4, '/uploads/products/vanilla-ganoderma-coffee-1.jpg', 'Vanilla — Ganoderma Coffee photo 1', 0),
(369, 4, '/uploads/products/vanilla-ganoderma-coffee-2.jpg', 'Vanilla — Ganoderma Coffee photo 2', 1),
(370, 4, '/uploads/products/vanilla-ganoderma-coffee-3.jpg', 'Vanilla — Ganoderma Coffee photo 3', 2),
(371, 5, '/uploads/products/extra-strength-ganoderma-coffee-1.jpg', 'Extra Strength — Ganoderma Coffee photo 1', 0),
(372, 5, '/uploads/products/extra-strength-ganoderma-coffee-2.jpg', 'Extra Strength — Ganoderma Coffee photo 2', 1),
(373, 6, '/uploads/products/decaf-ganoderma-coffee-1.jpg', 'Decaf — Ganoderma Coffee photo 1', 0),
(374, 6, '/uploads/products/decaf-ganoderma-coffee-2.jpg', 'Decaf — Ganoderma Coffee photo 2', 1),
(375, 7, '/uploads/products/original-ganoderma-coffee-1.jpg', 'Original — Ganoderma Coffee photo 1', 0),
(376, 7, '/uploads/products/original-ganoderma-coffee-2.jpg', 'Original — Ganoderma Coffee photo 2', 1),
(377, 8, '/uploads/products/extra-bold-ganoderma-coffee-1.jpg', 'Extra Bold — Ganoderma Coffee photo 1', 0),
(378, 8, '/uploads/products/extra-bold-ganoderma-coffee-2.jpg', 'Extra Bold — Ganoderma Coffee photo 2', 1),
(379, 9, '/uploads/products/mild-roast-ganoderma-coffee-1.jpg', 'Mild Roast — Ganoderma Coffee photo 1', 0),
(380, 9, '/uploads/products/mild-roast-ganoderma-coffee-2.jpg', 'Mild Roast — Ganoderma Coffee photo 2', 1),
(381, 9, '/uploads/products/mild-roast-ganoderma-coffee-3.jpg', 'Mild Roast — Ganoderma Coffee photo 3', 2),
(382, 10, '/uploads/products/dark-roast-ganoderma-coffee-1.jpg', 'Dark Roast — Ganoderma Coffee photo 1', 0),
(383, 10, '/uploads/products/dark-roast-ganoderma-coffee-2.jpg', 'Dark Roast — Ganoderma Coffee photo 2', 1),
(384, 10, '/uploads/products/dark-roast-ganoderma-coffee-3.jpg', 'Dark Roast — Ganoderma Coffee photo 3', 2),
(385, 11, '/uploads/products/single-origin-ganoderma-coffee-1.jpg', 'Single Origin — Ganoderma Coffee photo 1', 0),
(386, 11, '/uploads/products/single-origin-ganoderma-coffee-2.jpg', 'Single Origin — Ganoderma Coffee photo 2', 1),
(387, 11, '/uploads/products/single-origin-ganoderma-coffee-3.jpg', 'Single Origin — Ganoderma Coffee photo 3', 2),
(388, 12, '/uploads/products/tablets-250mg-100ct-spirulina-supplements-1.jpg', 'Tablets 250mg (100ct) — Spirulina & Supplements photo 1', 0),
(389, 12, '/uploads/products/tablets-250mg-100ct-spirulina-supplements-2.jpg', 'Tablets 250mg (100ct) — Spirulina & Supplements photo 2', 1),
(390, 13, '/uploads/products/tablets-250mg-250ct-spirulina-supplements-1.jpg', 'Tablets 250mg (250ct) — Spirulina & Supplements photo 1', 0),
(391, 13, '/uploads/products/tablets-250mg-250ct-spirulina-supplements-2.jpg', 'Tablets 250mg (250ct) — Spirulina & Supplements photo 2', 1),
(392, 13, '/uploads/products/tablets-250mg-250ct-spirulina-supplements-3.jpg', 'Tablets 250mg (250ct) — Spirulina & Supplements photo 3', 2),
(393, 14, '/uploads/products/tablets-500mg-100ct-spirulina-supplements-1.jpg', 'Tablets 500mg (100ct) — Spirulina & Supplements photo 1', 0),
(394, 14, '/uploads/products/tablets-500mg-100ct-spirulina-supplements-2.jpg', 'Tablets 500mg (100ct) — Spirulina & Supplements photo 2', 1),
(395, 15, '/uploads/products/tablets-500mg-250ct-spirulina-supplements-1.jpg', 'Tablets 500mg (250ct) — Spirulina & Supplements photo 1', 0),
(396, 15, '/uploads/products/tablets-500mg-250ct-spirulina-supplements-2.jpg', 'Tablets 500mg (250ct) — Spirulina & Supplements photo 2', 1),
(397, 16, '/uploads/products/tablets-500mg-500ct-spirulina-supplements-1.jpg', 'Tablets 500mg (500ct) — Spirulina & Supplements photo 1', 0),
(398, 16, '/uploads/products/tablets-500mg-500ct-spirulina-supplements-2.jpg', 'Tablets 500mg (500ct) — Spirulina & Supplements photo 2', 1),
(399, 16, '/uploads/products/tablets-500mg-500ct-spirulina-supplements-3.jpg', 'Tablets 500mg (500ct) — Spirulina & Supplements photo 3', 2),
(400, 17, '/uploads/products/capsules-60ct-spirulina-supplements-1.jpg', 'Capsules 60ct — Spirulina & Supplements photo 1', 0),
(401, 17, '/uploads/products/capsules-60ct-spirulina-supplements-2.jpg', 'Capsules 60ct — Spirulina & Supplements photo 2', 1),
(402, 18, '/uploads/products/capsules-90ct-spirulina-supplements-1.jpg', 'Capsules 90ct — Spirulina & Supplements photo 1', 0),
(403, 18, '/uploads/products/capsules-90ct-spirulina-supplements-2.jpg', 'Capsules 90ct — Spirulina & Supplements photo 2', 1),
(404, 19, '/uploads/products/capsules-120ct-spirulina-supplements-1.jpg', 'Capsules 120ct — Spirulina & Supplements photo 1', 0),
(405, 19, '/uploads/products/capsules-120ct-spirulina-supplements-2.jpg', 'Capsules 120ct — Spirulina & Supplements photo 2', 1),
(406, 19, '/uploads/products/capsules-120ct-spirulina-supplements-3.jpg', 'Capsules 120ct — Spirulina & Supplements photo 3', 2),
(407, 20, '/uploads/products/capsules-180ct-spirulina-supplements-1.jpg', 'Capsules 180ct — Spirulina & Supplements photo 1', 0),
(408, 20, '/uploads/products/capsules-180ct-spirulina-supplements-2.jpg', 'Capsules 180ct — Spirulina & Supplements photo 2', 1),
(409, 20, '/uploads/products/capsules-180ct-spirulina-supplements-3.jpg', 'Capsules 180ct — Spirulina & Supplements photo 3', 2),
(410, 21, '/uploads/products/capsules-240ct-spirulina-supplements-1.jpg', 'Capsules 240ct — Spirulina & Supplements photo 1', 0),
(411, 21, '/uploads/products/capsules-240ct-spirulina-supplements-2.jpg', 'Capsules 240ct — Spirulina & Supplements photo 2', 1),
(412, 22, '/uploads/products/toothpaste-personal-care-1.jpg', 'Toothpaste — Personal Care photo 1', 0),
(413, 22, '/uploads/products/toothpaste-personal-care-2.jpg', 'Toothpaste — Personal Care photo 2', 1),
(414, 22, '/uploads/products/toothpaste-personal-care-3.jpg', 'Toothpaste — Personal Care photo 3', 2),
(415, 23, '/uploads/products/mouthwash-personal-care-1.jpg', 'Mouthwash — Personal Care photo 1', 0),
(416, 23, '/uploads/products/mouthwash-personal-care-2.jpg', 'Mouthwash — Personal Care photo 2', 1),
(417, 23, '/uploads/products/mouthwash-personal-care-3.jpg', 'Mouthwash — Personal Care photo 3', 2),
(418, 24, '/uploads/products/toothbrush-set-personal-care-1.jpg', 'Toothbrush Set — Personal Care photo 1', 0),
(419, 24, '/uploads/products/toothbrush-set-personal-care-2.jpg', 'Toothbrush Set — Personal Care photo 2', 1),
(420, 24, '/uploads/products/toothbrush-set-personal-care-3.jpg', 'Toothbrush Set — Personal Care photo 3', 2),
(421, 25, '/uploads/products/whitening-gel-personal-care-1.jpg', 'Whitening Gel — Personal Care photo 1', 0),
(422, 25, '/uploads/products/whitening-gel-personal-care-2.jpg', 'Whitening Gel — Personal Care photo 2', 1),
(423, 25, '/uploads/products/whitening-gel-personal-care-3.jpg', 'Whitening Gel — Personal Care photo 3', 2),
(424, 26, '/uploads/products/kids-toothpaste-personal-care-1.jpg', 'Kids Toothpaste — Personal Care photo 1', 0),
(425, 26, '/uploads/products/kids-toothpaste-personal-care-2.jpg', 'Kids Toothpaste — Personal Care photo 2', 1),
(426, 26, '/uploads/products/kids-toothpaste-personal-care-3.jpg', 'Kids Toothpaste — Personal Care photo 3', 2),
(427, 27, '/uploads/products/shampoo-personal-care-1.jpg', 'Shampoo — Personal Care photo 1', 0),
(428, 27, '/uploads/products/shampoo-personal-care-2.jpg', 'Shampoo — Personal Care photo 2', 1),
(429, 27, '/uploads/products/shampoo-personal-care-3.jpg', 'Shampoo — Personal Care photo 3', 2),
(430, 28, '/uploads/products/conditioner-personal-care-1.jpg', 'Conditioner — Personal Care photo 1', 0),
(431, 28, '/uploads/products/conditioner-personal-care-2.jpg', 'Conditioner — Personal Care photo 2', 1),
(432, 29, '/uploads/products/hair-oil-personal-care-1.jpg', 'Hair Oil — Personal Care photo 1', 0),
(433, 29, '/uploads/products/hair-oil-personal-care-2.jpg', 'Hair Oil — Personal Care photo 2', 1),
(434, 29, '/uploads/products/hair-oil-personal-care-3.jpg', 'Hair Oil — Personal Care photo 3', 2),
(435, 30, '/uploads/products/anti-dandruff-shampoo-personal-care-1.jpg', 'Anti-Dandruff Shampoo — Personal Care photo 1', 0),
(436, 30, '/uploads/products/anti-dandruff-shampoo-personal-care-2.jpg', 'Anti-Dandruff Shampoo — Personal Care photo 2', 1),
(437, 31, '/uploads/products/hair-serum-personal-care-1.jpg', 'Hair Serum — Personal Care photo 1', 0),
(438, 31, '/uploads/products/hair-serum-personal-care-2.jpg', 'Hair Serum — Personal Care photo 2', 1),
(439, 32, '/uploads/products/herbal-soap-personal-care-1.jpg', 'Herbal Soap — Personal Care photo 1', 0),
(440, 32, '/uploads/products/herbal-soap-personal-care-2.jpg', 'Herbal Soap — Personal Care photo 2', 1),
(441, 33, '/uploads/products/face-wash-personal-care-1.jpg', 'Face Wash — Personal Care photo 1', 0),
(442, 33, '/uploads/products/face-wash-personal-care-2.jpg', 'Face Wash — Personal Care photo 2', 1),
(443, 33, '/uploads/products/face-wash-personal-care-3.jpg', 'Face Wash — Personal Care photo 3', 2),
(444, 34, '/uploads/products/body-lotion-personal-care-1.jpg', 'Body Lotion — Personal Care photo 1', 0),
(445, 34, '/uploads/products/body-lotion-personal-care-2.jpg', 'Body Lotion — Personal Care photo 2', 1),
(446, 34, '/uploads/products/body-lotion-personal-care-3.jpg', 'Body Lotion — Personal Care photo 3', 2),
(447, 35, '/uploads/products/face-cream-personal-care-1.jpg', 'Face Cream — Personal Care photo 1', 0),
(448, 35, '/uploads/products/face-cream-personal-care-2.jpg', 'Face Cream — Personal Care photo 2', 1),
(449, 36, '/uploads/products/body-scrub-personal-care-1.jpg', 'Body Scrub — Personal Care photo 1', 0),
(450, 36, '/uploads/products/body-scrub-personal-care-2.jpg', 'Body Scrub — Personal Care photo 2', 1),
(451, 37, '/uploads/products/black-tea-beverages-1.jpg', 'Black Tea — Beverages photo 1', 0),
(452, 37, '/uploads/products/black-tea-beverages-2.jpg', 'Black Tea — Beverages photo 2', 1),
(453, 37, '/uploads/products/black-tea-beverages-3.jpg', 'Black Tea — Beverages photo 3', 2),
(454, 38, '/uploads/products/green-tea-beverages-1.jpg', 'Green Tea — Beverages photo 1', 0),
(455, 38, '/uploads/products/green-tea-beverages-2.jpg', 'Green Tea — Beverages photo 2', 1),
(456, 38, '/uploads/products/green-tea-beverages-3.jpg', 'Green Tea — Beverages photo 3', 2),
(457, 39, '/uploads/products/herbal-tea-beverages-1.jpg', 'Herbal Tea — Beverages photo 1', 0),
(458, 39, '/uploads/products/herbal-tea-beverages-2.jpg', 'Herbal Tea — Beverages photo 2', 1),
(459, 39, '/uploads/products/herbal-tea-beverages-3.jpg', 'Herbal Tea — Beverages photo 3', 2),
(460, 40, '/uploads/products/iced-tea-mix-beverages-1.jpg', 'Iced Tea Mix — Beverages photo 1', 0),
(461, 40, '/uploads/products/iced-tea-mix-beverages-2.jpg', 'Iced Tea Mix — Beverages photo 2', 1),
(462, 41, '/uploads/products/chamomile-tea-beverages-1.jpg', 'Chamomile Tea — Beverages photo 1', 0),
(463, 41, '/uploads/products/chamomile-tea-beverages-2.jpg', 'Chamomile Tea — Beverages photo 2', 1),
(464, 42, '/uploads/products/roselle-concentrate-beverages-1.jpg', 'Roselle Concentrate — Beverages photo 1', 0),
(465, 42, '/uploads/products/roselle-concentrate-beverages-2.jpg', 'Roselle Concentrate — Beverages photo 2', 1),
(466, 42, '/uploads/products/roselle-concentrate-beverages-3.jpg', 'Roselle Concentrate — Beverages photo 3', 2),
(467, 43, '/uploads/products/mixed-berry-beverages-1.jpg', 'Mixed Berry — Beverages photo 1', 0),
(468, 43, '/uploads/products/mixed-berry-beverages-2.jpg', 'Mixed Berry — Beverages photo 2', 1),
(469, 43, '/uploads/products/mixed-berry-beverages-3.jpg', 'Mixed Berry — Beverages photo 3', 2),
(470, 44, '/uploads/products/aloe-vera-beverages-1.jpg', 'Aloe Vera — Beverages photo 1', 0),
(471, 44, '/uploads/products/aloe-vera-beverages-2.jpg', 'Aloe Vera — Beverages photo 2', 1),
(472, 44, '/uploads/products/aloe-vera-beverages-3.jpg', 'Aloe Vera — Beverages photo 3', 2),
(473, 45, '/uploads/products/pomegranate-beverages-1.jpg', 'Pomegranate — Beverages photo 1', 0),
(474, 45, '/uploads/products/pomegranate-beverages-2.jpg', 'Pomegranate — Beverages photo 2', 1),
(475, 45, '/uploads/products/pomegranate-beverages-3.jpg', 'Pomegranate — Beverages photo 3', 2),
(476, 46, '/uploads/products/ginger-lemon-beverages-1.jpg', 'Ginger Lemon — Beverages photo 1', 0),
(477, 46, '/uploads/products/ginger-lemon-beverages-2.jpg', 'Ginger Lemon — Beverages photo 2', 1),
(478, 46, '/uploads/products/ginger-lemon-beverages-3.jpg', 'Ginger Lemon — Beverages photo 3', 2);

-- --------------------------------------------------------

--
-- Table structure for table `productrelation`
--

CREATE TABLE `productrelation` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `relatedId` int(11) NOT NULL,
  `type` enum('RELATED','CROSS_SELL','UP_SELL') NOT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productvariant`
--

CREATE TABLE `productvariant` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `sku` varchar(191) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `compareAtPrice` decimal(10,2) DEFAULT NULL,
  `costPrice` decimal(10,2) DEFAULT NULL,
  `stockQuantity` int(11) NOT NULL DEFAULT 0,
  `lowStockAlert` int(11) DEFAULT 5,
  `weight` decimal(10,3) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productvariant`
--

INSERT INTO `productvariant` (`id`, `productId`, `sku`, `price`, `compareAtPrice`, `costPrice`, `stockQuantity`, `lowStockAlert`, `weight`, `image`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 27, 'SKU-SHAMPO-1026-RE-S', 374.00, NULL, 224.00, 37, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.436', '2026-08-07 14:44:14.436', NULL),
(2, 27, 'SKU-SHAMPO-1026-RE-M', 374.00, NULL, 224.00, 12, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.479', '2026-08-08 03:41:25.352', NULL),
(3, 27, 'SKU-SHAMPO-1026-RE-L', 374.00, NULL, 224.00, 11, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.563', '2026-08-07 14:44:14.563', NULL),
(4, 27, 'SKU-SHAMPO-1026-BL-S', 374.00, NULL, 224.00, 27, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.604', '2026-08-07 14:44:14.604', NULL),
(5, 27, 'SKU-SHAMPO-1026-BL-M', 374.00, NULL, 224.00, 14, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.661', '2026-08-07 14:44:14.661', NULL),
(6, 27, 'SKU-SHAMPO-1026-BL-L', 374.00, NULL, 224.00, 19, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.683', '2026-08-07 14:44:14.683', NULL),
(7, 27, 'SKU-SHAMPO-1026-GR-S', 374.00, NULL, 224.00, 30, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.712', '2026-08-07 14:44:14.712', NULL),
(8, 27, 'SKU-SHAMPO-1026-GR-M', 374.00, NULL, 224.00, 23, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.776', '2026-08-07 14:44:14.776', NULL),
(9, 27, 'SKU-SHAMPO-1026-GR-L', 374.00, NULL, 224.00, 5, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.823', '2026-08-07 14:44:14.823', NULL),
(10, 28, 'SKU-CONDIT-1027-RE-S', 404.00, NULL, 242.00, 6, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.854', '2026-08-07 14:44:14.854', NULL),
(11, 28, 'SKU-CONDIT-1027-RE-M', 404.00, NULL, 242.00, 24, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.883', '2026-08-07 14:44:14.883', NULL),
(12, 28, 'SKU-CONDIT-1027-RE-L', 404.00, NULL, 242.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.943', '2026-08-07 14:44:14.943', NULL),
(13, 28, 'SKU-CONDIT-1027-BL-S', 404.00, NULL, 242.00, 17, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.965', '2026-08-07 14:44:14.965', NULL),
(14, 28, 'SKU-CONDIT-1027-BL-M', 404.00, NULL, 242.00, 37, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:14.994', '2026-08-07 14:44:14.994', NULL),
(15, 28, 'SKU-CONDIT-1027-BL-L', 404.00, NULL, 242.00, 37, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.052', '2026-08-07 14:44:15.052', NULL),
(16, 28, 'SKU-CONDIT-1027-GR-S', 404.00, NULL, 242.00, 26, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.138', '2026-08-07 14:44:15.138', NULL),
(17, 28, 'SKU-CONDIT-1027-GR-M', 404.00, NULL, 242.00, 36, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.180', '2026-08-07 14:44:15.180', NULL),
(18, 28, 'SKU-CONDIT-1027-GR-L', 404.00, NULL, 242.00, 8, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.234', '2026-08-07 14:44:15.234', NULL),
(19, 29, 'SKU-HAIR-O-1028-RE-S', 481.00, NULL, 289.00, 22, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.263', '2026-08-07 14:44:15.263', NULL),
(20, 29, 'SKU-HAIR-O-1028-RE-M', 481.00, NULL, 289.00, 27, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.305', '2026-08-07 14:44:15.305', NULL),
(21, 29, 'SKU-HAIR-O-1028-RE-L', 481.00, NULL, 289.00, 15, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.377', '2026-08-07 14:44:15.377', NULL),
(22, 29, 'SKU-HAIR-O-1028-BL-S', 481.00, NULL, 289.00, 34, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.449', '2026-08-07 14:44:15.449', NULL),
(23, 29, 'SKU-HAIR-O-1028-BL-M', 481.00, NULL, 289.00, 38, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.665', '2026-08-07 14:44:15.665', NULL),
(24, 29, 'SKU-HAIR-O-1028-BL-L', 481.00, NULL, 289.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.737', '2026-08-07 14:44:15.737', NULL),
(25, 29, 'SKU-HAIR-O-1028-GR-S', 481.00, NULL, 289.00, 29, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.771', '2026-08-07 14:44:15.771', NULL),
(26, 29, 'SKU-HAIR-O-1028-GR-M', 481.00, NULL, 289.00, 10, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.817', '2026-08-07 14:44:15.817', NULL),
(27, 29, 'SKU-HAIR-O-1028-GR-L', 481.00, NULL, 289.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.848', '2026-08-07 14:44:15.848', NULL),
(28, 30, 'SKU-ANTI-D-1029-RE-S', 518.00, 596.00, 311.00, 16, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:15.892', '2026-08-07 14:44:15.892', NULL),
(29, 30, 'SKU-ANTI-D-1029-RE-M', 518.00, 596.00, 311.00, 24, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:16.008', '2026-08-07 14:44:16.008', NULL),
(30, 30, 'SKU-ANTI-D-1029-RE-L', 518.00, 596.00, 311.00, 12, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:16.054', '2026-08-07 14:44:16.054', NULL),
(31, 30, 'SKU-ANTI-D-1029-BL-S', 518.00, 596.00, 311.00, 15, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:16.097', '2026-08-07 14:44:16.097', NULL),
(32, 30, 'SKU-ANTI-D-1029-BL-M', 518.00, 596.00, 311.00, 9, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:16.130', '2026-08-07 14:44:16.130', NULL),
(33, 30, 'SKU-ANTI-D-1029-BL-L', 518.00, 596.00, 311.00, 11, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:16.182', '2026-08-07 14:44:16.182', NULL),
(34, 30, 'SKU-ANTI-D-1029-GR-S', 518.00, 596.00, 311.00, 29, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:16.222', '2026-08-07 14:44:16.222', NULL),
(35, 30, 'SKU-ANTI-D-1029-GR-M', 518.00, 596.00, 311.00, 30, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:16.253', '2026-08-07 14:44:16.253', NULL),
(36, 30, 'SKU-ANTI-D-1029-GR-L', 518.00, 596.00, 311.00, 8, 5, NULL, NULL, 'ACTIVE', '2026-08-07 14:44:16.301', '2026-08-07 14:44:16.301', NULL),
(37, 46, 'SKU-GINGER-1045-BLUE-SMALL', 605.00, NULL, 363.00, 0, 5, NULL, NULL, 'ACTIVE', '2026-08-08 02:30:19.311', '2026-08-08 02:41:11.623', '2026-08-08 02:41:11.620'),
(38, 46, 'SKU-GINGER-1045-BLUE-MEDIUM', 605.00, NULL, 363.00, 0, 5, NULL, NULL, 'ACTIVE', '2026-08-08 02:30:19.329', '2026-08-08 02:41:33.739', '2026-08-08 02:41:33.736'),
(39, 46, 'SKU-GINGER-1045-BLUE-LARGE', 605.00, NULL, 363.00, 0, 5, NULL, NULL, 'ACTIVE', '2026-08-08 02:30:19.363', '2026-08-08 02:41:33.739', '2026-08-08 02:41:33.736'),
(40, 46, 'SKU-GINGER-1045-GREEN-SMALL', 605.00, NULL, 363.00, 0, 5, NULL, NULL, 'ACTIVE', '2026-08-08 02:30:19.390', '2026-08-08 02:41:33.739', '2026-08-08 02:41:33.736'),
(41, 46, 'SKU-GINGER-1045-GREEN-MEDIUM', 605.00, NULL, 363.00, 0, 5, NULL, NULL, 'ACTIVE', '2026-08-08 02:30:19.437', '2026-08-08 02:41:33.739', '2026-08-08 02:41:33.736'),
(42, 46, 'SKU-GINGER-1045-GREEN-LARGE', 605.00, NULL, 363.00, 0, 5, NULL, NULL, 'ACTIVE', '2026-08-08 02:30:19.462', '2026-08-08 02:41:33.739', '2026-08-08 02:41:33.736'),
(43, 46, 'SKU-GINGER-1045-RED-SMALL', 605.00, NULL, 363.00, 0, 5, NULL, NULL, 'ACTIVE', '2026-08-08 02:30:19.598', '2026-08-08 02:41:33.739', '2026-08-08 02:41:33.736'),
(44, 46, 'SKU-GINGER-1045-RED-MEDIUM', 605.00, NULL, 363.00, 0, 5, NULL, NULL, 'ACTIVE', '2026-08-08 02:30:19.639', '2026-08-08 02:41:33.739', '2026-08-08 02:41:33.736'),
(45, 46, 'SKU-GINGER-1045-RED-LARGE', 605.00, NULL, 363.00, 0, 5, NULL, NULL, 'ACTIVE', '2026-08-08 02:30:19.666', '2026-08-08 02:41:33.739', '2026-08-08 02:41:33.736'),
(46, 1, 'SKU-CLASSI-1000-RE-S', 787.00, NULL, 452.00, 17, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.238', '2026-08-08 03:48:15.238', NULL),
(47, 1, 'SKU-CLASSI-1000-RE-M', 787.00, NULL, 452.00, 8, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.288', '2026-08-08 03:48:15.288', NULL),
(48, 1, 'SKU-CLASSI-1000-RE-L', 787.00, NULL, 452.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.322', '2026-08-08 03:48:15.322', NULL),
(49, 1, 'SKU-CLASSI-1000-BL-S', 787.00, NULL, 452.00, 39, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.346', '2026-08-08 03:48:15.346', NULL),
(50, 1, 'SKU-CLASSI-1000-BL-M', 787.00, NULL, 452.00, 10, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.387', '2026-08-09 04:13:45.128', NULL),
(51, 1, 'SKU-CLASSI-1000-BL-L', 787.00, NULL, 452.00, 11, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.418', '2026-08-08 03:48:15.418', NULL),
(52, 1, 'SKU-CLASSI-1000-GR-S', 787.00, NULL, 452.00, 7, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.457', '2026-08-08 03:48:15.457', NULL),
(53, 1, 'SKU-CLASSI-1000-GR-M', 787.00, NULL, 452.00, 7, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.527', '2026-08-09 06:27:35.839', NULL),
(54, 1, 'SKU-CLASSI-1000-GR-L', 787.00, NULL, 452.00, 4, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.590', '2026-08-08 06:11:02.197', NULL),
(55, 2, 'SKU-MOCHA--1001-RE-S', 809.00, NULL, 482.00, 21, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.651', '2026-08-08 03:48:15.651', NULL),
(56, 2, 'SKU-MOCHA--1001-RE-M', 809.00, NULL, 482.00, 38, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.743', '2026-08-08 03:48:15.743', NULL),
(57, 2, 'SKU-MOCHA--1001-RE-L', 809.00, NULL, 482.00, 21, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.781', '2026-08-08 03:48:15.781', NULL),
(58, 2, 'SKU-MOCHA--1001-BL-S', 809.00, NULL, 482.00, 35, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.809', '2026-08-08 03:48:15.809', NULL),
(59, 2, 'SKU-MOCHA--1001-BL-M', 809.00, NULL, 482.00, 33, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.841', '2026-08-08 03:48:15.841', NULL),
(60, 2, 'SKU-MOCHA--1001-BL-L', 809.00, NULL, 482.00, 34, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.870', '2026-08-08 03:48:15.870', NULL),
(61, 2, 'SKU-MOCHA--1001-GR-S', 809.00, NULL, 482.00, 29, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.908', '2026-08-08 03:48:15.908', NULL),
(62, 2, 'SKU-MOCHA--1001-GR-M', 809.00, NULL, 482.00, 35, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:15.979', '2026-08-08 03:48:15.979', NULL),
(63, 2, 'SKU-MOCHA--1001-GR-L', 809.00, NULL, 482.00, 33, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.009', '2026-08-08 03:48:16.009', NULL),
(64, 3, 'SKU-HAZELN-1002-RE-S', 887.00, 1020.00, 525.00, 7, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.037', '2026-08-08 03:48:16.037', NULL),
(65, 3, 'SKU-HAZELN-1002-RE-M', 887.00, 1020.00, 525.00, 21, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.076', '2026-08-08 03:48:16.076', NULL),
(66, 3, 'SKU-HAZELN-1002-RE-L', 887.00, 1020.00, 525.00, 10, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.106', '2026-08-08 03:48:16.106', NULL),
(67, 3, 'SKU-HAZELN-1002-BL-S', 887.00, 1020.00, 525.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.144', '2026-08-08 03:48:16.144', NULL),
(68, 3, 'SKU-HAZELN-1002-BL-M', 887.00, 1020.00, 525.00, 38, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.174', '2026-08-08 03:48:16.174', NULL),
(69, 3, 'SKU-HAZELN-1002-BL-L', 887.00, 1020.00, 525.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.214', '2026-08-08 03:48:16.214', NULL),
(70, 3, 'SKU-HAZELN-1002-GR-S', 887.00, 1020.00, 525.00, 22, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.241', '2026-08-08 03:48:16.241', NULL),
(71, 3, 'SKU-HAZELN-1002-GR-M', 887.00, 1020.00, 525.00, 10, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.280', '2026-08-08 03:48:16.280', NULL),
(72, 3, 'SKU-HAZELN-1002-GR-L', 887.00, 1020.00, 525.00, 33, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.307', '2026-08-08 03:48:16.307', NULL),
(73, 4, 'SKU-VANILL-1003-RE-S', 910.00, 1047.00, 536.00, 9, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.344', '2026-08-08 03:48:16.344', NULL),
(74, 4, 'SKU-VANILL-1003-RE-M', 910.00, 1047.00, 536.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.380', '2026-08-08 03:48:16.380', NULL),
(75, 4, 'SKU-VANILL-1003-RE-L', 910.00, 1047.00, 536.00, 30, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.416', '2026-08-08 03:48:16.416', NULL),
(76, 4, 'SKU-VANILL-1003-BL-S', 910.00, 1047.00, 536.00, 5, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.451', '2026-08-08 03:48:16.451', NULL),
(77, 4, 'SKU-VANILL-1003-BL-M', 910.00, 1047.00, 536.00, 30, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.477', '2026-08-08 03:48:16.477', NULL),
(78, 4, 'SKU-VANILL-1003-BL-L', 910.00, 1047.00, 536.00, 5, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.522', '2026-08-08 03:48:16.522', NULL),
(79, 4, 'SKU-VANILL-1003-GR-S', 910.00, 1047.00, 536.00, 12, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.646', '2026-08-08 03:48:16.646', NULL),
(80, 4, 'SKU-VANILL-1003-GR-M', 910.00, 1047.00, 536.00, 31, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.681', '2026-08-08 03:48:16.681', NULL),
(81, 4, 'SKU-VANILL-1003-GR-L', 910.00, 1047.00, 536.00, 11, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.718', '2026-08-08 03:48:16.718', NULL),
(82, 5, 'SKU-EXTRA--1004-RE-S', 936.00, 1076.00, 580.00, 19, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.749', '2026-08-08 03:48:16.749', NULL),
(83, 5, 'SKU-EXTRA--1004-RE-M', 936.00, 1076.00, 580.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.786', '2026-08-08 03:48:16.786', NULL),
(84, 5, 'SKU-EXTRA--1004-RE-L', 936.00, 1076.00, 580.00, 22, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.820', '2026-08-08 03:48:16.820', NULL),
(85, 5, 'SKU-EXTRA--1004-BL-S', 936.00, 1076.00, 580.00, 23, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.858', '2026-08-08 03:48:16.858', NULL),
(86, 5, 'SKU-EXTRA--1004-BL-M', 936.00, 1076.00, 580.00, 34, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.888', '2026-08-08 03:48:16.888', NULL),
(87, 5, 'SKU-EXTRA--1004-BL-L', 936.00, 1076.00, 580.00, 10, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.928', '2026-08-08 03:48:16.928', NULL),
(88, 5, 'SKU-EXTRA--1004-GR-S', 936.00, 1076.00, 580.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.957', '2026-08-08 03:48:16.957', NULL),
(89, 5, 'SKU-EXTRA--1004-GR-M', 936.00, 1076.00, 580.00, 9, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:16.995', '2026-08-08 03:48:16.995', NULL),
(90, 5, 'SKU-EXTRA--1004-GR-L', 936.00, 1076.00, 580.00, 6, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.025', '2026-08-08 03:48:17.025', NULL),
(91, 6, 'SKU-DECAF--1005-RE-S', 989.00, NULL, 583.00, 24, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.064', '2026-08-08 03:48:17.064', NULL),
(92, 6, 'SKU-DECAF--1005-RE-M', 989.00, NULL, 583.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.096', '2026-08-08 03:48:17.096', NULL),
(93, 6, 'SKU-DECAF--1005-RE-L', 989.00, NULL, 583.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.129', '2026-08-08 03:48:17.129', NULL),
(94, 6, 'SKU-DECAF--1005-BL-S', 989.00, NULL, 583.00, 21, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.273', '2026-08-08 03:48:17.273', NULL),
(95, 6, 'SKU-DECAF--1005-BL-M', 989.00, NULL, 583.00, 17, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.321', '2026-08-08 03:48:17.321', NULL),
(96, 6, 'SKU-DECAF--1005-BL-L', 989.00, NULL, 583.00, 37, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.384', '2026-08-08 03:48:17.384', NULL),
(97, 6, 'SKU-DECAF--1005-GR-S', 989.00, NULL, 583.00, 36, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.416', '2026-08-08 03:48:17.416', NULL),
(98, 6, 'SKU-DECAF--1005-GR-M', 989.00, NULL, 583.00, 39, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.456', '2026-08-08 03:48:17.456', NULL),
(99, 6, 'SKU-DECAF--1005-GR-L', 989.00, NULL, 583.00, 20, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.495', '2026-08-08 03:48:17.495', NULL),
(100, 7, 'SKU-ORIGIN-1006-RE-S', 705.00, NULL, 433.00, 35, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.526', '2026-08-08 03:48:17.526', NULL),
(101, 7, 'SKU-ORIGIN-1006-RE-M', 705.00, NULL, 433.00, 9, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.556', '2026-08-08 03:48:17.556', NULL),
(102, 7, 'SKU-ORIGIN-1006-RE-L', 705.00, NULL, 433.00, 5, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.595', '2026-08-08 03:48:17.595', NULL),
(103, 7, 'SKU-ORIGIN-1006-BL-S', 705.00, NULL, 433.00, 34, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.626', '2026-08-08 03:48:17.626', NULL),
(104, 7, 'SKU-ORIGIN-1006-BL-M', 705.00, NULL, 433.00, 6, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.699', '2026-08-08 03:48:17.699', NULL),
(105, 7, 'SKU-ORIGIN-1006-BL-L', 705.00, NULL, 433.00, 39, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.736', '2026-08-08 03:48:17.736', NULL),
(106, 7, 'SKU-ORIGIN-1006-GR-S', 705.00, NULL, 433.00, 8, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:17.774', '2026-08-08 03:48:17.774', NULL),
(107, 7, 'SKU-ORIGIN-1006-GR-M', 705.00, NULL, 433.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:18.330', '2026-08-08 03:48:18.330', NULL),
(108, 7, 'SKU-ORIGIN-1006-GR-L', 705.00, NULL, 433.00, 27, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:18.471', '2026-08-08 03:48:18.471', NULL),
(109, 8, 'SKU-EXTRA--1007-RE-S', 728.00, 837.00, 451.00, 32, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:18.644', '2026-08-08 03:48:18.644', NULL),
(110, 8, 'SKU-EXTRA--1007-RE-M', 728.00, 837.00, 451.00, 29, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:18.847', '2026-08-08 03:48:18.847', NULL),
(111, 8, 'SKU-EXTRA--1007-RE-L', 728.00, 837.00, 451.00, 37, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:18.931', '2026-08-08 03:48:18.931', NULL),
(112, 8, 'SKU-EXTRA--1007-BL-S', 728.00, 837.00, 451.00, 21, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:18.965', '2026-08-08 03:48:18.965', NULL),
(113, 8, 'SKU-EXTRA--1007-BL-M', 728.00, 837.00, 451.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:18.994', '2026-08-08 03:48:18.994', NULL),
(114, 8, 'SKU-EXTRA--1007-BL-L', 728.00, 837.00, 451.00, 21, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.031', '2026-08-08 03:48:19.031', NULL),
(115, 8, 'SKU-EXTRA--1007-GR-S', 728.00, 837.00, 451.00, 32, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.059', '2026-08-08 03:48:19.059', NULL),
(116, 8, 'SKU-EXTRA--1007-GR-M', 728.00, 837.00, 451.00, 36, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.094', '2026-08-08 03:48:19.094', NULL),
(117, 8, 'SKU-EXTRA--1007-GR-L', 728.00, 837.00, 451.00, 39, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.127', '2026-08-08 03:48:19.127', NULL),
(118, 9, 'SKU-MILD-R-1008-RE-S', 796.00, NULL, 449.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.157', '2026-08-08 03:48:19.157', NULL),
(119, 9, 'SKU-MILD-R-1008-RE-M', 796.00, NULL, 449.00, 39, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.192', '2026-08-08 03:48:19.192', NULL),
(120, 9, 'SKU-MILD-R-1008-RE-L', 796.00, NULL, 449.00, 23, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.228', '2026-08-08 03:48:19.228', NULL),
(121, 9, 'SKU-MILD-R-1008-BL-S', 796.00, NULL, 449.00, 33, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.257', '2026-08-08 03:48:19.257', NULL),
(122, 9, 'SKU-MILD-R-1008-BL-M', 796.00, NULL, 449.00, 10, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.296', '2026-08-08 03:48:19.296', NULL),
(123, 9, 'SKU-MILD-R-1008-BL-L', 796.00, NULL, 449.00, 16, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.320', '2026-08-08 03:48:19.320', NULL),
(124, 9, 'SKU-MILD-R-1008-GR-S', 796.00, NULL, 449.00, 38, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.361', '2026-08-08 03:48:19.361', NULL),
(125, 9, 'SKU-MILD-R-1008-GR-M', 796.00, NULL, 449.00, 15, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.390', '2026-08-08 03:48:19.390', NULL),
(126, 9, 'SKU-MILD-R-1008-GR-L', 796.00, NULL, 449.00, 16, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.417', '2026-08-09 04:13:45.119', NULL),
(127, 10, 'SKU-DARK-R-1009-RE-S', 820.00, NULL, 467.00, 38, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.454', '2026-08-08 03:48:19.454', NULL),
(128, 10, 'SKU-DARK-R-1009-RE-M', 820.00, NULL, 467.00, 32, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.483', '2026-08-08 03:48:19.483', NULL),
(129, 10, 'SKU-DARK-R-1009-RE-L', 820.00, NULL, 467.00, 21, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.567', '2026-08-08 03:48:19.567', NULL),
(130, 10, 'SKU-DARK-R-1009-BL-S', 820.00, NULL, 467.00, 7, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.628', '2026-08-08 03:48:19.628', NULL),
(131, 10, 'SKU-DARK-R-1009-BL-M', 820.00, NULL, 467.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.668', '2026-08-08 03:48:19.668', NULL),
(132, 10, 'SKU-DARK-R-1009-BL-L', 820.00, NULL, 467.00, 38, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.697', '2026-08-08 03:48:19.697', NULL),
(133, 10, 'SKU-DARK-R-1009-GR-S', 820.00, NULL, 467.00, 23, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.738', '2026-08-08 03:48:19.738', NULL),
(134, 10, 'SKU-DARK-R-1009-GR-M', 820.00, NULL, 467.00, 28, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.804', '2026-08-08 03:48:19.804', NULL),
(135, 10, 'SKU-DARK-R-1009-GR-L', 820.00, NULL, 467.00, 25, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.836', '2026-08-08 03:48:19.836', NULL),
(136, 11, 'SKU-SINGLE-1010-RE-S', 835.00, NULL, 520.00, 28, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.876', '2026-08-08 03:48:19.876', NULL),
(137, 11, 'SKU-SINGLE-1010-RE-M', 835.00, NULL, 520.00, 22, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:19.964', '2026-08-08 03:48:19.964', NULL),
(138, 11, 'SKU-SINGLE-1010-RE-L', 835.00, NULL, 520.00, 6, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.003', '2026-08-08 03:48:20.003', NULL),
(139, 11, 'SKU-SINGLE-1010-BL-S', 835.00, NULL, 520.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.029', '2026-08-08 03:48:20.029', NULL),
(140, 11, 'SKU-SINGLE-1010-BL-M', 835.00, NULL, 520.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.066', '2026-08-08 03:48:20.066', NULL),
(141, 11, 'SKU-SINGLE-1010-BL-L', 835.00, NULL, 520.00, 24, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.097', '2026-08-08 03:48:20.097', NULL),
(142, 11, 'SKU-SINGLE-1010-GR-S', 835.00, NULL, 520.00, 37, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.136', '2026-08-08 03:48:20.136', NULL),
(143, 11, 'SKU-SINGLE-1010-GR-M', 835.00, NULL, 520.00, 39, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.166', '2026-08-08 03:48:20.166', NULL),
(144, 11, 'SKU-SINGLE-1010-GR-L', 835.00, NULL, 520.00, 11, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.201', '2026-08-08 03:48:20.201', NULL),
(145, 12, 'SKU-TABLET-1011-RE-S', 921.00, NULL, 522.00, 6, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.230', '2026-08-08 03:48:20.230', NULL),
(146, 12, 'SKU-TABLET-1011-RE-M', 921.00, NULL, 522.00, 23, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.259', '2026-08-08 03:48:20.259', NULL),
(147, 12, 'SKU-TABLET-1011-RE-L', 921.00, NULL, 522.00, 6, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.292', '2026-08-08 03:48:20.292', NULL),
(148, 12, 'SKU-TABLET-1011-BL-S', 921.00, NULL, 522.00, 34, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.322', '2026-08-08 03:48:20.322', NULL),
(149, 12, 'SKU-TABLET-1011-BL-M', 921.00, NULL, 522.00, 7, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.354', '2026-08-08 03:48:20.354', NULL),
(150, 12, 'SKU-TABLET-1011-BL-L', 921.00, NULL, 522.00, 17, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.379', '2026-08-08 03:48:20.379', NULL),
(151, 12, 'SKU-TABLET-1011-GR-S', 921.00, NULL, 522.00, 38, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.421', '2026-08-08 03:48:20.421', NULL),
(152, 12, 'SKU-TABLET-1011-GR-M', 921.00, NULL, 522.00, 16, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.508', '2026-08-08 03:48:20.508', NULL),
(153, 12, 'SKU-TABLET-1011-GR-L', 921.00, NULL, 522.00, 8, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.548', '2026-08-08 03:48:20.548', NULL),
(154, 13, 'SKU-TABLET-1012-RE-S', 1045.00, NULL, 610.00, 36, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.583', '2026-08-08 03:48:20.583', NULL),
(155, 13, 'SKU-TABLET-1012-RE-M', 1045.00, NULL, 610.00, 22, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.617', '2026-08-08 03:48:20.617', NULL),
(156, 13, 'SKU-TABLET-1012-RE-L', 1045.00, NULL, 610.00, 22, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.641', '2026-08-08 03:48:20.641', NULL),
(157, 13, 'SKU-TABLET-1012-BL-S', 1045.00, NULL, 610.00, 28, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.676', '2026-08-08 03:48:20.676', NULL),
(158, 13, 'SKU-TABLET-1012-BL-M', 1045.00, NULL, 610.00, 28, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.704', '2026-08-08 03:48:20.704', NULL),
(159, 13, 'SKU-TABLET-1012-BL-L', 1045.00, NULL, 610.00, 6, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.739', '2026-08-08 03:48:20.739', NULL),
(160, 13, 'SKU-TABLET-1012-GR-S', 1045.00, NULL, 610.00, 29, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.786', '2026-08-08 03:48:20.786', NULL),
(161, 13, 'SKU-TABLET-1012-GR-M', 1045.00, NULL, 610.00, 12, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.908', '2026-08-08 03:48:20.908', NULL),
(162, 13, 'SKU-TABLET-1012-GR-L', 1045.00, NULL, 610.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.942', '2026-08-08 03:48:20.942', NULL),
(163, 14, 'SKU-TABLET-1013-RE-S', 1131.00, 1301.00, 700.00, 37, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:20.970', '2026-08-08 03:48:20.970', NULL),
(164, 14, 'SKU-TABLET-1013-RE-M', 1131.00, 1301.00, 700.00, 32, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.007', '2026-08-08 03:48:21.007', NULL),
(165, 14, 'SKU-TABLET-1013-RE-L', 1131.00, 1301.00, 700.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.035', '2026-08-08 03:48:21.035', NULL),
(166, 14, 'SKU-TABLET-1013-BL-S', 1131.00, 1301.00, 700.00, 33, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.069', '2026-08-08 03:48:21.069', NULL),
(167, 14, 'SKU-TABLET-1013-BL-M', 1131.00, 1301.00, 700.00, 10, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.098', '2026-08-08 03:48:21.098', NULL),
(168, 14, 'SKU-TABLET-1013-BL-L', 1131.00, 1301.00, 700.00, 19, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.133', '2026-08-08 03:48:21.133', NULL),
(169, 14, 'SKU-TABLET-1013-GR-S', 1131.00, 1301.00, 700.00, 27, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.165', '2026-08-08 03:48:21.165', NULL),
(170, 14, 'SKU-TABLET-1013-GR-M', 1131.00, 1301.00, 700.00, 36, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.200', '2026-08-08 03:48:21.200', NULL),
(171, 14, 'SKU-TABLET-1013-GR-L', 1131.00, 1301.00, 700.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.229', '2026-08-08 03:48:21.229', NULL),
(172, 15, 'SKU-TABLET-1014-RE-S', 1254.00, NULL, 749.00, 16, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.266', '2026-08-08 03:48:21.266', NULL),
(173, 15, 'SKU-TABLET-1014-RE-M', 1254.00, NULL, 749.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.289', '2026-08-08 03:48:21.289', NULL),
(174, 15, 'SKU-TABLET-1014-RE-L', 1254.00, NULL, 749.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.326', '2026-08-08 03:48:21.326', NULL),
(175, 15, 'SKU-TABLET-1014-BL-S', 1254.00, NULL, 749.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.353', '2026-08-08 03:48:21.353', NULL),
(176, 15, 'SKU-TABLET-1014-BL-M', 1254.00, NULL, 749.00, 26, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.387', '2026-08-08 03:48:21.387', NULL),
(177, 15, 'SKU-TABLET-1014-BL-L', 1254.00, NULL, 749.00, 11, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.416', '2026-08-08 03:48:21.416', NULL),
(178, 15, 'SKU-TABLET-1014-GR-S', 1254.00, NULL, 749.00, 5, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.453', '2026-08-08 03:48:21.453', NULL),
(179, 15, 'SKU-TABLET-1014-GR-M', 1254.00, NULL, 749.00, 7, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.477', '2026-08-08 03:48:21.477', NULL),
(180, 15, 'SKU-TABLET-1014-GR-L', 1254.00, NULL, 749.00, 39, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.504', '2026-08-08 03:48:21.504', NULL),
(181, 16, 'SKU-TABLET-1015-RE-S', 1391.00, NULL, 822.00, 30, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.529', '2026-08-08 03:48:21.529', NULL),
(182, 16, 'SKU-TABLET-1015-RE-M', 1391.00, NULL, 822.00, 5, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.567', '2026-08-08 03:48:21.567', NULL),
(183, 16, 'SKU-TABLET-1015-RE-L', 1391.00, NULL, 822.00, 8, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.600', '2026-08-08 03:48:21.600', NULL),
(184, 16, 'SKU-TABLET-1015-BL-S', 1391.00, NULL, 822.00, 5, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.669', '2026-08-08 03:48:21.669', NULL),
(185, 16, 'SKU-TABLET-1015-BL-M', 1391.00, NULL, 822.00, 9, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.704', '2026-08-08 03:48:21.704', NULL),
(186, 16, 'SKU-TABLET-1015-BL-L', 1391.00, NULL, 822.00, 23, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.731', '2026-08-08 03:48:21.731', NULL),
(187, 16, 'SKU-TABLET-1015-GR-S', 1391.00, NULL, 822.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.767', '2026-08-08 03:48:21.767', NULL),
(188, 16, 'SKU-TABLET-1015-GR-M', 1391.00, NULL, 822.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.803', '2026-08-08 03:48:21.803', NULL),
(189, 16, 'SKU-TABLET-1015-GR-L', 1391.00, NULL, 822.00, 15, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.835', '2026-08-08 03:48:21.835', NULL),
(190, 17, 'SKU-CAPSUL-1016-RE-S', 748.00, NULL, 464.00, 25, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.865', '2026-08-08 03:48:21.865', NULL),
(191, 17, 'SKU-CAPSUL-1016-RE-M', 748.00, NULL, 464.00, 11, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.894', '2026-08-08 03:48:21.894', NULL),
(192, 17, 'SKU-CAPSUL-1016-RE-L', 748.00, NULL, 464.00, 36, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:21.948', '2026-08-08 03:48:21.948', NULL),
(193, 17, 'SKU-CAPSUL-1016-BL-S', 748.00, NULL, 464.00, 35, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:22.670', '2026-08-08 03:48:22.670', NULL),
(194, 17, 'SKU-CAPSUL-1016-BL-M', 748.00, NULL, 464.00, 20, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:22.819', '2026-08-08 03:48:22.819', NULL),
(195, 17, 'SKU-CAPSUL-1016-BL-L', 748.00, NULL, 464.00, 17, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:22.954', '2026-08-08 03:48:22.954', NULL),
(196, 17, 'SKU-CAPSUL-1016-GR-S', 748.00, NULL, 464.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.054', '2026-08-08 03:48:23.054', NULL),
(197, 17, 'SKU-CAPSUL-1016-GR-M', 748.00, NULL, 464.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.092', '2026-08-08 03:48:23.092', NULL),
(198, 17, 'SKU-CAPSUL-1016-GR-L', 748.00, NULL, 464.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.120', '2026-08-08 03:48:23.120', NULL),
(199, 18, 'SKU-CAPSUL-1017-RE-S', 884.00, NULL, 520.00, 28, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.157', '2026-08-08 03:48:23.157', NULL),
(200, 18, 'SKU-CAPSUL-1017-RE-M', 884.00, NULL, 520.00, 13, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.187', '2026-08-08 03:48:23.187', NULL),
(201, 18, 'SKU-CAPSUL-1017-RE-L', 884.00, NULL, 520.00, 23, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.218', '2026-08-08 03:48:23.218', NULL),
(202, 18, 'SKU-CAPSUL-1017-BL-S', 884.00, NULL, 520.00, 31, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.246', '2026-08-08 03:48:23.246', NULL),
(203, 18, 'SKU-CAPSUL-1017-BL-M', 884.00, NULL, 520.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.273', '2026-08-08 03:48:23.273', NULL),
(204, 18, 'SKU-CAPSUL-1017-BL-L', 884.00, NULL, 520.00, 9, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.301', '2026-08-08 03:48:23.301', NULL),
(205, 18, 'SKU-CAPSUL-1017-GR-S', 884.00, NULL, 520.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.336', '2026-08-08 03:48:23.336', NULL),
(206, 18, 'SKU-CAPSUL-1017-GR-M', 884.00, NULL, 520.00, 23, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.367', '2026-08-08 03:48:23.367', NULL),
(207, 18, 'SKU-CAPSUL-1017-GR-L', 884.00, NULL, 520.00, 6, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.404', '2026-08-08 03:48:23.404', NULL),
(208, 19, 'SKU-CAPSUL-1018-RE-S', 991.00, NULL, 597.00, 35, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.434', '2026-08-08 03:48:23.434', NULL),
(209, 19, 'SKU-CAPSUL-1018-RE-M', 991.00, NULL, 597.00, 30, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.469', '2026-08-08 03:48:23.469', NULL),
(210, 19, 'SKU-CAPSUL-1018-RE-L', 991.00, NULL, 597.00, 28, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.501', '2026-08-08 03:48:23.501', NULL),
(211, 19, 'SKU-CAPSUL-1018-BL-S', 991.00, NULL, 597.00, 18, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.538', '2026-08-08 03:48:23.538', NULL),
(212, 19, 'SKU-CAPSUL-1018-BL-M', 991.00, NULL, 597.00, 24, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.598', '2026-08-08 03:48:23.598', NULL),
(213, 19, 'SKU-CAPSUL-1018-BL-L', 991.00, NULL, 597.00, 29, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.623', '2026-08-08 03:48:23.623', NULL),
(214, 19, 'SKU-CAPSUL-1018-GR-S', 991.00, NULL, 597.00, 5, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.668', '2026-08-08 03:48:23.668', NULL),
(215, 19, 'SKU-CAPSUL-1018-GR-M', 991.00, NULL, 597.00, 26, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.697', '2026-08-08 03:48:23.697', NULL),
(216, 19, 'SKU-CAPSUL-1018-GR-L', 991.00, NULL, 597.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.743', '2026-08-08 03:48:23.743', NULL),
(217, 20, 'SKU-CAPSUL-1019-RE-S', 1095.00, 1259.00, 634.00, 20, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.806', '2026-08-08 03:48:23.806', NULL),
(218, 20, 'SKU-CAPSUL-1019-RE-M', 1095.00, 1259.00, 634.00, 6, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.858', '2026-08-08 03:48:23.858', NULL),
(219, 20, 'SKU-CAPSUL-1019-RE-L', 1095.00, 1259.00, 634.00, 37, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.894', '2026-08-08 03:48:23.894', NULL),
(220, 20, 'SKU-CAPSUL-1019-BL-S', 1095.00, 1259.00, 634.00, 40, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.931', '2026-08-08 03:48:23.931', NULL),
(221, 20, 'SKU-CAPSUL-1019-BL-M', 1095.00, 1259.00, 634.00, 16, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:23.980', '2026-08-08 03:48:23.980', NULL),
(222, 20, 'SKU-CAPSUL-1019-BL-L', 1095.00, 1259.00, 634.00, 9, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:24.055', '2026-08-08 03:48:24.055', NULL),
(223, 20, 'SKU-CAPSUL-1019-GR-S', 1095.00, 1259.00, 634.00, 38, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:24.104', '2026-08-08 03:48:24.104', NULL),
(224, 20, 'SKU-CAPSUL-1019-GR-M', 1095.00, 1259.00, 634.00, 17, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:24.142', '2026-08-08 03:48:24.142', NULL),
(225, 20, 'SKU-CAPSUL-1019-GR-L', 1095.00, 1259.00, 634.00, 10, 5, NULL, NULL, 'ACTIVE', '2026-08-08 03:48:24.181', '2026-08-08 03:48:24.181', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `productvariantvalue`
--

CREATE TABLE `productvariantvalue` (
  `id` int(11) NOT NULL,
  `variantId` int(11) NOT NULL,
  `attributeValueId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productvariantvalue`
--

INSERT INTO `productvariantvalue` (`id`, `variantId`, `attributeValueId`) VALUES
(1, 1, 2),
(2, 1, 6),
(3, 2, 2),
(4, 2, 4),
(5, 3, 2),
(6, 3, 5),
(7, 4, 3),
(8, 4, 6),
(9, 5, 3),
(10, 5, 4),
(11, 6, 3),
(12, 6, 5),
(13, 7, 1),
(14, 7, 6),
(15, 8, 1),
(16, 8, 4),
(17, 9, 1),
(18, 9, 5),
(19, 10, 2),
(20, 10, 6),
(21, 11, 2),
(22, 11, 4),
(23, 12, 2),
(24, 12, 5),
(25, 13, 3),
(26, 13, 6),
(27, 14, 3),
(28, 14, 4),
(29, 15, 3),
(30, 15, 5),
(31, 16, 1),
(32, 16, 6),
(33, 17, 1),
(34, 17, 4),
(35, 18, 1),
(36, 18, 5),
(37, 19, 2),
(38, 19, 6),
(39, 20, 2),
(40, 20, 4),
(41, 21, 2),
(42, 21, 5),
(43, 22, 3),
(44, 22, 6),
(45, 23, 3),
(46, 23, 4),
(47, 24, 3),
(48, 24, 5),
(49, 25, 1),
(50, 25, 6),
(51, 26, 1),
(52, 26, 4),
(53, 27, 1),
(54, 27, 5),
(55, 28, 2),
(56, 28, 6),
(57, 29, 2),
(58, 29, 4),
(59, 30, 2),
(60, 30, 5),
(61, 31, 3),
(62, 31, 6),
(63, 32, 3),
(64, 32, 4),
(65, 33, 3),
(66, 33, 5),
(67, 34, 1),
(68, 34, 6),
(69, 35, 1),
(70, 35, 4),
(71, 36, 1),
(72, 36, 5),
(73, 37, 3),
(74, 37, 6),
(75, 38, 3),
(76, 38, 4),
(77, 39, 3),
(78, 39, 5),
(79, 40, 1),
(80, 40, 6),
(81, 41, 1),
(82, 41, 4),
(83, 42, 1),
(84, 42, 5),
(85, 43, 2),
(86, 43, 6),
(87, 44, 2),
(88, 44, 4),
(89, 45, 2),
(90, 45, 5),
(91, 46, 2),
(92, 46, 6),
(93, 47, 2),
(94, 47, 4),
(95, 48, 2),
(96, 48, 5),
(97, 49, 3),
(98, 49, 6),
(99, 50, 3),
(100, 50, 4),
(101, 51, 3),
(102, 51, 5),
(103, 52, 1),
(104, 52, 6),
(105, 53, 1),
(106, 53, 4),
(107, 54, 1),
(108, 54, 5),
(109, 55, 2),
(110, 55, 6),
(111, 56, 2),
(112, 56, 4),
(113, 57, 2),
(114, 57, 5),
(115, 58, 3),
(116, 58, 6),
(117, 59, 3),
(118, 59, 4),
(119, 60, 3),
(120, 60, 5),
(121, 61, 1),
(122, 61, 6),
(123, 62, 1),
(124, 62, 4),
(125, 63, 1),
(126, 63, 5),
(127, 64, 2),
(128, 64, 6),
(129, 65, 2),
(130, 65, 4),
(131, 66, 2),
(132, 66, 5),
(133, 67, 3),
(134, 67, 6),
(135, 68, 3),
(136, 68, 4),
(137, 69, 3),
(138, 69, 5),
(139, 70, 1),
(140, 70, 6),
(141, 71, 1),
(142, 71, 4),
(143, 72, 1),
(144, 72, 5),
(145, 73, 2),
(146, 73, 6),
(147, 74, 2),
(148, 74, 4),
(149, 75, 2),
(150, 75, 5),
(151, 76, 3),
(152, 76, 6),
(153, 77, 3),
(154, 77, 4),
(155, 78, 3),
(156, 78, 5),
(157, 79, 1),
(158, 79, 6),
(159, 80, 1),
(160, 80, 4),
(161, 81, 1),
(162, 81, 5),
(163, 82, 2),
(164, 82, 6),
(165, 83, 2),
(166, 83, 4),
(167, 84, 2),
(168, 84, 5),
(169, 85, 3),
(170, 85, 6),
(171, 86, 3),
(172, 86, 4),
(173, 87, 3),
(174, 87, 5),
(175, 88, 1),
(176, 88, 6),
(177, 89, 1),
(178, 89, 4),
(179, 90, 1),
(180, 90, 5),
(181, 91, 2),
(182, 91, 6),
(183, 92, 2),
(184, 92, 4),
(185, 93, 2),
(186, 93, 5),
(187, 94, 3),
(188, 94, 6),
(189, 95, 3),
(190, 95, 4),
(191, 96, 3),
(192, 96, 5),
(193, 97, 1),
(194, 97, 6),
(195, 98, 1),
(196, 98, 4),
(197, 99, 1),
(198, 99, 5),
(199, 100, 2),
(200, 100, 6),
(201, 101, 2),
(202, 101, 4),
(203, 102, 2),
(204, 102, 5),
(205, 103, 3),
(206, 103, 6),
(207, 104, 3),
(208, 104, 4),
(209, 105, 3),
(210, 105, 5),
(211, 106, 1),
(212, 106, 6),
(213, 107, 1),
(214, 107, 4),
(215, 108, 1),
(216, 108, 5),
(217, 109, 2),
(218, 109, 6),
(219, 110, 2),
(220, 110, 4),
(221, 111, 2),
(222, 111, 5),
(223, 112, 3),
(224, 112, 6),
(225, 113, 3),
(226, 113, 4),
(227, 114, 3),
(228, 114, 5),
(229, 115, 1),
(230, 115, 6),
(231, 116, 1),
(232, 116, 4),
(233, 117, 1),
(234, 117, 5),
(235, 118, 2),
(236, 118, 6),
(237, 119, 2),
(238, 119, 4),
(239, 120, 2),
(240, 120, 5),
(241, 121, 3),
(242, 121, 6),
(243, 122, 3),
(244, 122, 4),
(245, 123, 3),
(246, 123, 5),
(247, 124, 1),
(248, 124, 6),
(249, 125, 1),
(250, 125, 4),
(251, 126, 1),
(252, 126, 5),
(253, 127, 2),
(254, 127, 6),
(255, 128, 2),
(256, 128, 4),
(257, 129, 2),
(258, 129, 5),
(259, 130, 3),
(260, 130, 6),
(261, 131, 3),
(262, 131, 4),
(263, 132, 3),
(264, 132, 5),
(265, 133, 1),
(266, 133, 6),
(267, 134, 1),
(268, 134, 4),
(269, 135, 1),
(270, 135, 5),
(271, 136, 2),
(272, 136, 6),
(273, 137, 2),
(274, 137, 4),
(275, 138, 2),
(276, 138, 5),
(277, 139, 3),
(278, 139, 6),
(279, 140, 3),
(280, 140, 4),
(281, 141, 3),
(282, 141, 5),
(283, 142, 1),
(284, 142, 6),
(285, 143, 1),
(286, 143, 4),
(287, 144, 1),
(288, 144, 5),
(289, 145, 2),
(290, 145, 6),
(291, 146, 2),
(292, 146, 4),
(293, 147, 2),
(294, 147, 5),
(295, 148, 3),
(296, 148, 6),
(297, 149, 3),
(298, 149, 4),
(299, 150, 3),
(300, 150, 5),
(301, 151, 1),
(302, 151, 6),
(303, 152, 1),
(304, 152, 4),
(305, 153, 1),
(306, 153, 5),
(307, 154, 2),
(308, 154, 6),
(309, 155, 2),
(310, 155, 4),
(311, 156, 2),
(312, 156, 5),
(313, 157, 3),
(314, 157, 6),
(315, 158, 3),
(316, 158, 4),
(317, 159, 3),
(318, 159, 5),
(319, 160, 1),
(320, 160, 6),
(321, 161, 1),
(322, 161, 4),
(323, 162, 1),
(324, 162, 5),
(325, 163, 2),
(326, 163, 6),
(327, 164, 2),
(328, 164, 4),
(329, 165, 2),
(330, 165, 5),
(331, 166, 3),
(332, 166, 6),
(333, 167, 3),
(334, 167, 4),
(335, 168, 3),
(336, 168, 5),
(337, 169, 1),
(338, 169, 6),
(339, 170, 1),
(340, 170, 4),
(341, 171, 1),
(342, 171, 5),
(343, 172, 2),
(344, 172, 6),
(345, 173, 2),
(346, 173, 4),
(347, 174, 2),
(348, 174, 5),
(349, 175, 3),
(350, 175, 6),
(351, 176, 3),
(352, 176, 4),
(353, 177, 3),
(354, 177, 5),
(355, 178, 1),
(356, 178, 6),
(357, 179, 1),
(358, 179, 4),
(359, 180, 1),
(360, 180, 5),
(361, 181, 2),
(362, 181, 6),
(363, 182, 2),
(364, 182, 4),
(365, 183, 2),
(366, 183, 5),
(367, 184, 3),
(368, 184, 6),
(369, 185, 3),
(370, 185, 4),
(371, 186, 3),
(372, 186, 5),
(373, 187, 1),
(374, 187, 6),
(375, 188, 1),
(376, 188, 4),
(377, 189, 1),
(378, 189, 5),
(379, 190, 2),
(380, 190, 6),
(381, 191, 2),
(382, 191, 4),
(383, 192, 2),
(384, 192, 5),
(385, 193, 3),
(386, 193, 6),
(387, 194, 3),
(388, 194, 4),
(389, 195, 3),
(390, 195, 5),
(391, 196, 1),
(392, 196, 6),
(393, 197, 1),
(394, 197, 4),
(395, 198, 1),
(396, 198, 5),
(397, 199, 2),
(398, 199, 6),
(399, 200, 2),
(400, 200, 4),
(401, 201, 2),
(402, 201, 5),
(403, 202, 3),
(404, 202, 6),
(405, 203, 3),
(406, 203, 4),
(407, 204, 3),
(408, 204, 5),
(409, 205, 1),
(410, 205, 6),
(411, 206, 1),
(412, 206, 4),
(413, 207, 1),
(414, 207, 5),
(415, 208, 2),
(416, 208, 6),
(417, 209, 2),
(418, 209, 4),
(419, 210, 2),
(420, 210, 5),
(421, 211, 3),
(422, 211, 6),
(423, 212, 3),
(424, 212, 4),
(425, 213, 3),
(426, 213, 5),
(427, 214, 1),
(428, 214, 6),
(429, 215, 1),
(430, 215, 4),
(431, 216, 1),
(432, 216, 5),
(433, 217, 2),
(434, 217, 6),
(435, 218, 2),
(436, 218, 4),
(437, 219, 2),
(438, 219, 5),
(439, 220, 3),
(440, 220, 6),
(441, 221, 3),
(442, 221, 4),
(443, 222, 3),
(444, 222, 5),
(445, 223, 1),
(446, 223, 6),
(447, 224, 1),
(448, 224, 4),
(449, 225, 1),
(450, 225, 5);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `orderItemId` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `productId`, `userId`, `orderItemId`, `rating`, `comment`, `status`, `createdAt`) VALUES
(1, 2, 3, 3, 5, 'this products is so great. Thank you', 'APPROVED', '2026-08-08 03:02:32.485');

-- --------------------------------------------------------

--
-- Table structure for table `shippingzone`
--

CREATE TABLE `shippingzone` (
  `id` int(11) NOT NULL,
  `country` varchar(191) NOT NULL,
  `label` varchar(191) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `freeShippingMinOrder` decimal(10,2) DEFAULT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shippingzone`
--

INSERT INTO `shippingzone` (`id`, `country`, `label`, `rate`, `freeShippingMinOrder`, `isDefault`, `createdAt`, `updatedAt`) VALUES
(1, 'Nepal', 'Nepal Domestic Shipping', 150.00, 3000.00, 0, '2026-08-08 04:03:16.004', '2026-08-09 09:35:59.939'),
(2, 'International', 'International Shipping', 1500.00, NULL, 1, '2026-08-08 04:03:16.024', '2026-08-08 04:03:16.024');

-- --------------------------------------------------------

--
-- Table structure for table `taxrate`
--

CREATE TABLE `taxrate` (
  `id` int(11) NOT NULL,
  `country` varchar(191) NOT NULL,
  `label` varchar(191) NOT NULL DEFAULT 'VAT',
  `percent` decimal(5,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `taxrate`
--

INSERT INTO `taxrate` (`id`, `country`, `label`, `percent`, `createdAt`, `updatedAt`, `active`) VALUES
(1, 'Nepal', 'VAT', 13.00, '2026-08-08 04:03:16.041', '2026-08-08 04:46:36.354', 0);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `image` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `passwordHash`, `phone`, `role`, `createdAt`, `updatedAt`, `image`) VALUES
(1, 'Store Admin', 'admin@dxn.com', '$2b$10$lrZ4dqfz0t06Z2fJVlJ53evNL2AT5BVQcM72O0eoXqaZZGNYnyyw2', NULL, 'ADMIN', '2026-08-07 14:44:08.006', '2026-08-09 07:03:01.147', NULL),
(3, 'Bikesh Kumar Gupta', 'bikeshguptabusiness@gmail.com', '$2b$10$.htEkQMBDoKO53T043JkXulG/Og3hNxdVftAhRGKgL/U98uVkQSea', NULL, 'USER', '2026-08-07 16:45:11.966', '2026-08-08 03:53:05.323', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 3, '2026-08-09 05:36:27.851', '2026-08-09 05:36:27.851'),
(2, 1, '2026-08-09 06:13:57.073', '2026-08-09 06:13:57.073');

-- --------------------------------------------------------

--
-- Table structure for table `wishlistitem`
--

CREATE TABLE `wishlistitem` (
  `id` int(11) NOT NULL,
  `wishlistId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `variantId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('2c8ede4c-ef0f-4e6f-ab32-90891d16ce80', 'c4e80d69f371256d9b283be0e26d191fdc000d625fb15457fe843832b0ba75fa', '2026-08-09 07:06:32.877', '20260809140000_address_book_and_address_restructure_b', '', NULL, '2026-08-09 07:06:32.877', 0),
('2ef6e686-7dae-4051-8d9a-1f010dfdaed7', 'cb208ba519ad00b66dd91129646ad92a3b15be546aa46324c8979647300e5a75', '2026-08-08 04:01:42.714', '20260809090000_shipping_tax', '', NULL, '2026-08-08 04:01:42.714', 0),
('397aea13-a8d9-4b79-b417-7aead1cdd343', 'f6d6446373fb56c929d41e164f1032d8174982b6cf0619d5387b1e11c404a6aa', '2026-08-08 03:30:56.339', '20260808100000_variant_cart_tracking', '', NULL, '2026-08-08 03:30:56.339', 0),
('660fcb86-933f-45fa-b34a-059e3fdd707a', 'c6a5653aa656ca674a796893a17b25eb5d591d9c3ab597c421a2e41f19eb36bb', '2026-08-09 07:02:49.114', '20260809130000_address_book_and_address_restructure_a', '', NULL, '2026-08-09 07:02:49.114', 0),
('8f363300-a548-41db-90cf-d6f59d5c35a4', '548f4cb41c2f11ea38247bfbf5eda8b32fd8f1ff7fcd032845e081d31a6f1914', '2026-08-09 08:29:02.952', '20260809150000_address_district', '', NULL, '2026-08-09 08:29:02.952', 0),
('d05076aa-e6db-4ee8-be06-284ee1e082bd', '9f3f75998814fb4340538b622e8efe21b5aba5f8cf8d644a50d5b55b0e04d6af', '2026-08-07 14:42:35.569', '20260807180000_int_autoincrement_ids', '', NULL, '2026-08-07 14:42:35.569', 0),
('db1d0112-1fa8-4890-aa84-1c119f8cd686', '8b4346b0e53cb06b7880055d90cc330b0bc94979a40515ed411b1a1aa1413041', '2026-08-08 04:35:06.124', '20260808100000_tax_rate_active', '', NULL, '2026-08-08 04:35:06.124', 0),
('dddf74c9-7ffa-41df-8cb3-f26fa9953f70', '4d8fba656fb51f61d1eb39c684f5c3b6dbc9a1e766aedee9b4eb1f5d83746a81', '2026-08-08 04:49:47.608', '20260808110000_product_promo_flags', '', NULL, '2026-08-08 04:49:47.608', 0),
('ebc4c287-a67b-4f7e-b532-f8a1ef478829', '83b6b64a9da19d9ac66c11c0389a812c7db8b763ec38ada1f4abde182c6bb66b', '2026-08-09 08:59:05.086', '20260809160000_municipality_shipping_rate', '', NULL, '2026-08-09 08:59:05.086', 0),
('f6074935-ce07-459e-b41a-7371d3d4544e', '108e2cb6254dd27a144f2d4749c9f6fd09501f272d2abfbb3ffa4d9193b8256d', '2026-08-09 05:16:32.506', '20260809120000_add_wishlist', '', NULL, '2026-08-09 05:16:32.506', 0),
('fc20e774-1f99-4e38-b15c-c49f149f0fb8', 'a09265e5e2c6be75c7bbfc4db5dd7490d073aa7a3d1c65282d47e68693c015b7', '2026-08-07 16:56:35.027', '20260808000000_add_image_fields', '', NULL, '2026-08-07 16:56:35.027', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Address_userId_idx` (`userId`),
  ADD KEY `Address_provinceId_idx` (`provinceId`),
  ADD KEY `Address_municipalityId_idx` (`municipalityId`),
  ADD KEY `Address_districtId_idx` (`districtId`);

--
-- Indexes for table `addressbook`
--
ALTER TABLE `addressbook`
  ADD PRIMARY KEY (`id`),
  ADD KEY `AddressBook_parentId_idx` (`parentId`),
  ADD KEY `AddressBook_level_idx` (`level`);

--
-- Indexes for table `attribute`
--
ALTER TABLE `attribute`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Attribute_name_key` (`name`),
  ADD UNIQUE KEY `Attribute_slug_key` (`slug`);

--
-- Indexes for table `attributevalue`
--
ALTER TABLE `attributevalue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `AttributeValue_attributeId_value_key` (`attributeId`,`value`),
  ADD KEY `AttributeValue_attributeId_idx` (`attributeId`);

--
-- Indexes for table `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Brand_slug_key` (`slug`),
  ADD KEY `Brand_status_idx` (`status`),
  ADD KEY `Brand_deletedAt_idx` (`deletedAt`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Cart_userId_key` (`userId`);

--
-- Indexes for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CartItem_productId_idx` (`productId`),
  ADD KEY `CartItem_cartId_idx` (`cartId`),
  ADD KEY `CartItem_variantId_idx` (`variantId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`),
  ADD KEY `Category_parentCategoryId_idx` (`parentCategoryId`),
  ADD KEY `Category_status_idx` (`status`),
  ADD KEY `Category_deletedAt_idx` (`deletedAt`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Coupon_code_key` (`code`);

--
-- Indexes for table `emailsettings`
--
ALTER TABLE `emailsettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `homebannerslide`
--
ALTER TABLE `homebannerslide`
  ADD PRIMARY KEY (`id`),
  ADD KEY `HomeBannerSlide_active_idx` (`active`);

--
-- Indexes for table `invoicesettings`
--
ALTER TABLE `invoicesettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `municipalityshippingrate`
--
ALTER TABLE `municipalityshippingrate`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `MunicipalityShippingRate_municipalityId_key` (`municipalityId`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Notification_userId_idx` (`userId`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Order_orderNumber_key` (`orderNumber`),
  ADD KEY `Order_userId_idx` (`userId`),
  ADD KEY `Order_status_idx` (`status`),
  ADD KEY `Order_couponId_fkey` (`couponId`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_idx` (`orderId`),
  ADD KEY `OrderItem_productId_idx` (`productId`);

--
-- Indexes for table `orderstatushistory`
--
ALTER TABLE `orderstatushistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderStatusHistory_orderId_idx` (`orderId`);

--
-- Indexes for table `passwordresettoken`
--
ALTER TABLE `passwordresettoken`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `PasswordResetToken_tokenHash_key` (`tokenHash`),
  ADD KEY `PasswordResetToken_userId_idx` (`userId`);

--
-- Indexes for table `paymentsettings`
--
ALTER TABLE `paymentsettings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Product_slug_key` (`slug`),
  ADD UNIQUE KEY `Product_sku_key` (`sku`),
  ADD KEY `Product_categoryId_idx` (`categoryId`),
  ADD KEY `Product_brandId_idx` (`brandId`),
  ADD KEY `Product_status_idx` (`status`),
  ADD KEY `Product_deletedAt_idx` (`deletedAt`);

--
-- Indexes for table `productimage`
--
ALTER TABLE `productimage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductImage_productId_idx` (`productId`);

--
-- Indexes for table `productrelation`
--
ALTER TABLE `productrelation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ProductRelation_productId_relatedId_type_key` (`productId`,`relatedId`,`type`),
  ADD KEY `ProductRelation_productId_idx` (`productId`),
  ADD KEY `ProductRelation_relatedId_idx` (`relatedId`);

--
-- Indexes for table `productvariant`
--
ALTER TABLE `productvariant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ProductVariant_sku_key` (`sku`),
  ADD KEY `ProductVariant_productId_idx` (`productId`),
  ADD KEY `ProductVariant_status_idx` (`status`),
  ADD KEY `ProductVariant_deletedAt_idx` (`deletedAt`);

--
-- Indexes for table `productvariantvalue`
--
ALTER TABLE `productvariantvalue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ProductVariantValue_variantId_attributeValueId_key` (`variantId`,`attributeValueId`),
  ADD KEY `ProductVariantValue_variantId_idx` (`variantId`),
  ADD KEY `ProductVariantValue_attributeValueId_idx` (`attributeValueId`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Review_userId_orderItemId_key` (`userId`,`orderItemId`),
  ADD KEY `Review_productId_idx` (`productId`),
  ADD KEY `Review_userId_idx` (`userId`),
  ADD KEY `Review_status_idx` (`status`),
  ADD KEY `Review_orderItemId_fkey` (`orderItemId`);

--
-- Indexes for table `shippingzone`
--
ALTER TABLE `shippingzone`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ShippingZone_country_key` (`country`),
  ADD KEY `ShippingZone_isDefault_idx` (`isDefault`);

--
-- Indexes for table `taxrate`
--
ALTER TABLE `taxrate`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `TaxRate_country_key` (`country`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Wishlist_userId_key` (`userId`);

--
-- Indexes for table `wishlistitem`
--
ALTER TABLE `wishlistitem`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `WishlistItem_wishlistId_productId_variantId_key` (`wishlistId`,`productId`,`variantId`),
  ADD KEY `WishlistItem_productId_idx` (`productId`),
  ADD KEY `WishlistItem_variantId_idx` (`variantId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `addressbook`
--
ALTER TABLE `addressbook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=838;

--
-- AUTO_INCREMENT for table `attribute`
--
ALTER TABLE `attribute`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `attributevalue`
--
ALTER TABLE `attributevalue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `brand`
--
ALTER TABLE `brand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cartitem`
--
ALTER TABLE `cartitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `homebannerslide`
--
ALTER TABLE `homebannerslide`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `municipalityshippingrate`
--
ALTER TABLE `municipalityshippingrate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `orderstatushistory`
--
ALTER TABLE `orderstatushistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `passwordresettoken`
--
ALTER TABLE `passwordresettoken`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `productimage`
--
ALTER TABLE `productimage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=479;

--
-- AUTO_INCREMENT for table `productrelation`
--
ALTER TABLE `productrelation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productvariant`
--
ALTER TABLE `productvariant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=227;

--
-- AUTO_INCREMENT for table `productvariantvalue`
--
ALTER TABLE `productvariantvalue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=451;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `shippingzone`
--
ALTER TABLE `shippingzone`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `taxrate`
--
ALTER TABLE `taxrate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wishlistitem`
--
ALTER TABLE `wishlistitem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `Address_districtId_fkey` FOREIGN KEY (`districtId`) REFERENCES `addressbook` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Address_municipalityId_fkey` FOREIGN KEY (`municipalityId`) REFERENCES `addressbook` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Address_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `addressbook` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `addressbook`
--
ALTER TABLE `addressbook`
  ADD CONSTRAINT `AddressBook_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `addressbook` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `attributevalue`
--
ALTER TABLE `attributevalue`
  ADD CONSTRAINT `AttributeValue_attributeId_fkey` FOREIGN KEY (`attributeId`) REFERENCES `attribute` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `Category_parentCategoryId_fkey` FOREIGN KEY (`parentCategoryId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `municipalityshippingrate`
--
ALTER TABLE `municipalityshippingrate`
  ADD CONSTRAINT `MunicipalityShippingRate_municipalityId_fkey` FOREIGN KEY (`municipalityId`) REFERENCES `addressbook` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `orderstatushistory`
--
ALTER TABLE `orderstatushistory`
  ADD CONSTRAINT `OrderStatusHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `passwordresettoken`
--
ALTER TABLE `passwordresettoken`
  ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `productimage`
--
ALTER TABLE `productimage`
  ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productrelation`
--
ALTER TABLE `productrelation`
  ADD CONSTRAINT `ProductRelation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductRelation_relatedId_fkey` FOREIGN KEY (`relatedId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productvariant`
--
ALTER TABLE `productvariant`
  ADD CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productvariantvalue`
--
ALTER TABLE `productvariantvalue`
  ADD CONSTRAINT `ProductVariantValue_attributeValueId_fkey` FOREIGN KEY (`attributeValueId`) REFERENCES `attributevalue` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ProductVariantValue_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `Review_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `orderitem` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlistitem`
--
ALTER TABLE `wishlistitem`
  ADD CONSTRAINT `WishlistItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `WishlistItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `WishlistItem_wishlistId_fkey` FOREIGN KEY (`wishlistId`) REFERENCES `wishlist` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
