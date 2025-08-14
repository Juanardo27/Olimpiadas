-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-08-2025 a las 02:29:15
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
-- Base de datos: `sistema_turismo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividadusuario`
--

CREATE TABLE `actividadusuario` (
  `id_actividad` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_actividad` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoriaproducto`
--

CREATE TABLE `categoriaproducto` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoriaproducto`
--

INSERT INTO `categoriaproducto` (`id_categoria`, `nombre_categoria`) VALUES
(1, 'Paquetes turísticos'),
(2, 'Vuelos'),
(3, 'Hoteles');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_registro` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `id_usuario`, `fecha_registro`) VALUES
(1, 4, '2025-06-20'),
(2, 5, '2025-06-20'),
(3, 6, '2025-06-20'),
(4, 7, '2025-06-21'),
(5, 8, '2025-06-22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `correodestino`
--

CREATE TABLE `correodestino` (
  `id_correo` int(11) NOT NULL,
  `sector` varchar(100) DEFAULT NULL,
  `email_sector` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `correodestino`
--

INSERT INTO `correodestino` (`id_correo`, `sector`, `email_sector`) VALUES
(1, 'Atención al cliente', 'juanignaciogamarra777@gmail.com'),
(2, 'Devoluciones', 'gamarrajuanignacio27@gmail.com'),
(3, 'Envios y logística', 'yannickdeanton@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallepedido`
--

CREATE TABLE `detallepedido` (
  `id_detalle` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detallepedido`
--

INSERT INTO `detallepedido` (`id_detalle`, `id_pedido`, `id_producto`, `cantidad`, `subtotal`) VALUES
(1, 1, 7, 3, 300000.00),
(2, 1, 9, 1, 70000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jefeventas`
--

CREATE TABLE `jefeventas` (
  `id_jefe` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `sector_asignado` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jefeventas`
--

INSERT INTO `jefeventas` (`id_jefe`, `id_usuario`, `sector_asignado`) VALUES
(1, 1, 'Logística'),
(2, 2, 'Atención'),
(3, 3, 'Ventas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha_pedido` date NOT NULL,
  `estado` enum('pendiente','confirmado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  `total` decimal(10,2) DEFAULT NULL,
  `entregado_por` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id_pedido`, `id_cliente`, `fecha_pedido`, `estado`, `total`, `entregado_por`) VALUES
(1, 1, '2025-08-13', 'confirmado', 370000.00, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `codigo_producto` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `modificado_por` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `codigo_producto`, `descripcion`, `id_categoria`, `precio`, `stock`, `activo`, `modificado_por`) VALUES
(1, 'PKT001', 'Paquete a Mendoza - Hotel + Vuelo', 1, 450000.00, 7, 1, 1),
(2, 'PKT002', 'Paquete a Bariloche - Hotel 3* + Excursiones', 1, 420000.00, 12, 1, 1),
(3, 'PKT003', 'Paquete a Cataratas - All Inclusive', 1, 600000.00, 8, 1, 1),
(4, 'VUE001', 'Vuelo ida y vuelta a Iguazú desde Buenos Aires', 2, 230000.00, 20, 1, 1),
(5, 'VUE002', 'Vuelo a Córdoba ida y vuelta', 2, 150000.00, 15, 1, 1),
(6, 'VUE003', 'Vuelo directo a Salta desde Rosario', 2, 180000.00, 18, 1, 1),
(7, 'HTL001', 'Hotel 4* en Mar del Plata - 3 noches', 3, 100000.00, 5, 1, 1),
(8, 'HTL002', 'Hotel Boutique en Villa La Angostura', 3, 130000.00, 6, 1, 1),
(9, 'HTL003', 'Hostel en Mendoza - Habitación doble', 3, 70000.00, 10, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `tipo_usuario` enum('cliente','jefe') NOT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `email`, `contraseña`, `tipo_usuario`, `activo`) VALUES
(1, 'Nahuel', 'Rodriguez', 'rodrigueznahu2007@gmail.com', '$2b$10$8GUnP6yg0zb9n93aIdgO6.m4ZJTkgsRbOJyanO4jCieGByeViBQfi', 'jefe', 1),
(2, 'Joaquín', 'Juárez', 'cticogala0@gmail.com', '$2b$10$I5b/glV/E87liHGXMCoYgO/w2/IcnNOE..bdwWrC2fU5wFNygboO6', 'jefe', 1),
(3, 'Lucía', 'Pérez', 'lucia@empresa.com', '$2b$10$/xbDUqE5aGBF8zViQwRzc.u7Zuc2VTsY3kBoAfghn5eKKDnM0yi1u', 'jefe', 1),
(4, 'Juan', 'Gamarra', 'juanignaciogamarra777@gmail.com', '$2b$10$F/S5phD/UyDNM3todSSQNeyOfE8sAPvYKR071agqbzMae80DQZgy6', 'cliente', 1),
(5, 'Daiana', 'Vazquez', 'daiana@gmail.com', '$2b$10$Sj.bidx/al5Yz0GoA5nPz.7/dRb5bAKK6yPo5pxUPd65iRIJrTxbm', 'cliente', 1),
(6, 'Nahuel', 'Rodriguez', 'nahuel@gmail.com', '$2b$10$RJiCrxhnhANTYhd51n9yBeau7y4DOww.q2GSvHYPvno8ffq2b4CvS', 'cliente', 1),
(7, 'chuachin', 'chuare', 'hhh@gmail.com', '$2b$10$6SOZGSrC/3SyUuT0WPZU9.VFx9nRrouIf0x2tjLJDUl6n4V/HqzBC', 'cliente', 1),
(8, 'Maria', 'Da Silva', 'maria@gmail.com', '$2b$10$lN9GKH3pjCR9IG4182uv7OUKOY6Yn0e9yyw.HCm5z2UMRxhsJVtCW', 'cliente', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id_venta` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `fecha_venta` date DEFAULT NULL,
  `monto_final` decimal(10,2) DEFAULT NULL,
  `estado_pago` enum('pendiente','pagado','rechazado') NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`id_venta`, `id_pedido`, `fecha_venta`, `monto_final`, `estado_pago`, `metodo_pago`) VALUES
(1, 1, '2025-08-13', 370000.00, 'pendiente', 'Transferencia');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividadusuario`
--
ALTER TABLE `actividadusuario`
  ADD PRIMARY KEY (`id_actividad`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `categoriaproducto`
--
ALTER TABLE `categoriaproducto`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `correodestino`
--
ALTER TABLE `correodestino`
  ADD PRIMARY KEY (`id_correo`);

--
-- Indices de la tabla `detallepedido`
--
ALTER TABLE `detallepedido`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `jefeventas`
--
ALTER TABLE `jefeventas`
  ADD PRIMARY KEY (`id_jefe`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `entregado_por` (`entregado_por`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `codigo_producto` (`codigo_producto`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `modificado_por` (`modificado_por`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_pedido` (`id_pedido`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividadusuario`
--
ALTER TABLE `actividadusuario`
  MODIFY `id_actividad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoriaproducto`
--
ALTER TABLE `categoriaproducto`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `correodestino`
--
ALTER TABLE `correodestino`
  MODIFY `id_correo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `detallepedido`
--
ALTER TABLE `detallepedido`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `jefeventas`
--
ALTER TABLE `jefeventas`
  MODIFY `id_jefe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividadusuario`
--
ALTER TABLE `actividadusuario`
  ADD CONSTRAINT `actividadusuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detallepedido`
--
ALTER TABLE `detallepedido`
  ADD CONSTRAINT `detallepedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `detallepedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `jefeventas`
--
ALTER TABLE `jefeventas`
  ADD CONSTRAINT `jefeventas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`entregado_por`) REFERENCES `jefeventas` (`id_jefe`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoriaproducto` (`id_categoria`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`modificado_por`) REFERENCES `jefeventas` (`id_jefe`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
