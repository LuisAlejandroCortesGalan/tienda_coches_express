-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2024 a las 09:33:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `renting_cars`
--
CREATE DATABASE IF NOT EXISTS `renting_cars` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `renting_cars`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alquileres`
--

CREATE TABLE `alquileres` (
  `id_alquiler` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_modelo` int(11) NOT NULL,
  `fecha_recogida` date NOT NULL,
  `fecha_entrega` date NOT NULL,
  `facturacion` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alquileres`
--

INSERT INTO `alquileres` (`id_alquiler`, `id_cliente`, `id_modelo`, `fecha_recogida`, `fecha_entrega`, `facturacion`) VALUES
(1, 1, 1, '2024-03-12', '2024-03-15', 196),
(2, 1, 2, '2024-03-01', '2024-03-25', 1378),
(3, 1, 3, '2024-03-05', '2024-03-15', 2992),
(4, 1, 2, '2024-03-01', '2024-03-30', 1590);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(9) NOT NULL,
  `tel` varchar(12) NOT NULL,
  `email` varchar(100) NOT NULL,
  `poblacio` varchar(100) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `dni`, `tel`, `email`, `poblacio`, `password`) VALUES
(1, 'Luciano', 'Pavarotti', '123456789', '123456789', 'luciano@pavarotti.it', 'Modena', 'Luciano'),
(2, 'Maria', 'Callas', '456789123', '456789123', 'maria@callas.us', 'Paris', 'Maria'),
(3, 'Josep', 'Carreras', '789456123', '789456123', 'josep@carreras.cat', 'Barcelona', 'Josep'),
(4, 'Montserrat', 'Caballé', '321654987', '321654987', 'montserrat@caballe.cat', 'Barcelona', 'Montserrat');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelos`
--

CREATE TABLE `modelos` (
  `id_modelo` int(11) NOT NULL,
  `nombre_modelo` varchar(50) NOT NULL,
  `unidades_totales` int(2) NOT NULL,
  `unidades_alquiladas` int(2) NOT NULL,
  `personas` int(2) NOT NULL,
  `puertas` int(1) NOT NULL,
  `cambio` varchar(20) NOT NULL,
  `maletas` int(1) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `precioDia` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `modelos`
--

INSERT INTO `modelos` (`id_modelo`, `nombre_modelo`, `unidades_totales`, `unidades_alquiladas`, `personas`, `puertas`, `cambio`, `maletas`, `tipo`, `precioDia`) VALUES
(1, 'Fiat Panda', 5, 0, 4, 5, 'manual', 2, 'coche', 49),
(2, 'Nissan Micra', 4, 0, 4, 5, 'manual', 2, 'coche', 53),
(3, 'Nissan X-trail Auto', 12, 0, 5, 5, 'manual', 2, 'coche', 187),
(16, 'Fiat 500 Cabrio', 5, 0, 4, 3, 'manual', 2, 'coche', 77),
(17, 'Jeep Wrangler', 21, 0, 4, 3, 'manual', 2, 'coche', 104),
(18, 'Opel ZafiraSG', 5, 0, 7, 5, 'manual', 4, 'coche', 106),
(19, 'Piaggio Vespa 125 LX', 5, 0, 2, 0, 'auto', 0, 'moto', 57),
(20, 'Opel Corsa', 10, 0, 5, 5, 'manual', 3, 'coche', 57),
(21, 'Piaggio Beverly 300cc', 4, 0, 2, 0, 'auto', 0, 'moto', 45),
(22, 'Nissan Primastar', 65, 0, 9, 5, 'manual', 5, 'furgoneta', 147),
(23, '', 0, 0, 0, 0, '', 0, 'xD', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alquileres`
--
ALTER TABLE `alquileres`
  ADD PRIMARY KEY (`id_alquiler`),
  ADD KEY `id_vehiculo_index` (`id_modelo`),
  ADD KEY `id_cliente_index` (`id_cliente`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `modelos`
--
ALTER TABLE `modelos`
  ADD PRIMARY KEY (`id_modelo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alquileres`
--
ALTER TABLE `alquileres`
  MODIFY `id_alquiler` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `modelos`
--
ALTER TABLE `modelos`
  MODIFY `id_modelo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alquileres`
--
ALTER TABLE `alquileres`
  ADD CONSTRAINT `alquileres_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `alquileres_ibfk_2` FOREIGN KEY (`id_modelo`) REFERENCES `modelos` (`id_modelo`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
