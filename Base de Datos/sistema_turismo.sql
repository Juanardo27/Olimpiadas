-- Base de datos: `sistema_turismo` con datos de prueba
-- --------------------------------------------------------

DROP DATABASE IF EXISTS sistema_turismo;
CREATE DATABASE sistema_turismo;
USE sistema_turismo;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- --------------------------------------------------------
-- Eliminar tablas si existen
-- --------------------------------------------------------
DROP TABLE IF EXISTS venta;
DROP TABLE IF EXISTS detallepedido;
DROP TABLE IF EXISTS pedido;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS jefeventas;
DROP TABLE IF EXISTS actividadusuario;
DROP TABLE IF EXISTS categoriaproducto;
DROP TABLE IF EXISTS correodestino;
DROP TABLE IF EXISTS usuario;

-- --------------------------------------------------------
-- Tablas y datos
-- --------------------------------------------------------

-- Tabla: usuario
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `contraseña` varchar(100) NOT NULL,
  `tipo_usuario` enum('cliente','jefe') NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `email`, `contraseña`, `tipo_usuario`, `activo`) VALUES
(1, 'Joaquín', 'Juárez', 'cticogala0@gmail.com', '$2b$10$u4YCwFbvX38dRgZrAM8A.uxTJT4DqEOVrvuwqTe6tnauICJadivbq', 'jefe', 1),
(2, 'Lucía', 'Pérez', 'lucia@empresa.com', '$2b$10$w3XVy8HqSAJgU6gfk8nDFewxDQy5OabIFEgvs3XlXPROnXBb5JaNO', 'jefe', 1),
(3, 'Martín', 'Gómez', 'martin@gmail.com', '$2b$10$xGT0uzdjFCELEjkkc.EfZu9zOVJB6GNVziew.vLQVhU1XyHq1Payu', 'jefe', 1),
(4, 'Cliente', 'Inventado', 'cliente1@example.com', '$2b$10$jVyiJ1t9.KskHn/7/t0eveAWlj0/MzLsQf1pX8FIorVBYjikLigIi', 'cliente', 1);

-- Tabla: cliente
CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `fecha_registro` date DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `cliente` (`id_cliente`, `id_usuario`, `fecha_registro`) VALUES
(1, 4, '2025-06-20');

-- Tabla: jefeventas
CREATE TABLE `jefeventas` (
  `id_jefe` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `sector_asignado` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_jefe`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `jefeventas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `jefeventas` (`id_jefe`, `id_usuario`, `sector_asignado`) VALUES
(1, 1, 'Logística'),
(2, 2, 'Atención'),
(3, 3, 'Ventas');

-- Tabla: categoriaproducto
CREATE TABLE `categoriaproducto` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categoriaproducto` (`id_categoria`, `nombre_categoria`) VALUES
(1, 'Paquetes turísticos'),
(2, 'Vuelos'),
(3, 'Hoteles');

-- Tabla: producto
CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `codigo_producto` varchar(50) NOT NULL UNIQUE,
  `descripcion` text DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `activo` tinyint(1) DEFAULT 1,
  `modificado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `id_categoria` (`id_categoria`),
  KEY `modificado_por` (`modificado_por`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoriaproducto` (`id_categoria`),
  CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`modificado_por`) REFERENCES `jefeventas` (`id_jefe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- Tabla: pedido
CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NOT NULL,
  `fecha_pedido` date NOT NULL,
  `estado` enum('pendiente','confirmado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  `total` decimal(10,2) DEFAULT NULL,
  `entregado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_cliente` (`id_cliente`),
  KEY `entregado_por` (`entregado_por`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`entregado_por`) REFERENCES `jefeventas` (`id_jefe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar pedidos de ejemplo
INSERT INTO `pedido` (`id_pedido`, `id_cliente`, `fecha_pedido`, `estado`, `total`, `entregado_por`) VALUES
(1, 1, '2025-08-13', 'confirmado', 370000.00, NULL);

-- Tabla: detallepedido
CREATE TABLE `detallepedido` (
  `id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_pedido` (`id_pedido`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detallepedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `detallepedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar detalles de pedido
INSERT INTO `detallepedido` (`id_detalle`, `id_pedido`, `id_producto`, `cantidad`, `subtotal`) VALUES
(1, 1, 7, 3, 300000.00),
(2, 1, 9, 1, 70000.00);

-- Tabla: venta
CREATE TABLE `venta` (
  `id_venta` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) NOT NULL,
  `fecha_venta` date DEFAULT NULL,
  `monto_final` decimal(10,2) DEFAULT NULL,
  `estado_pago` enum('pendiente','pagado','rechazado') NOT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `venta` (`id_venta`, `id_pedido`, `fecha_venta`, `monto_final`, `estado_pago`, `metodo_pago`) VALUES
(1, 1, '2025-08-13', 370000.00, 'pendiente', 'Transferencia');

-- Tabla: actividadusuario
CREATE TABLE `actividadusuario` (
  `id_actividad` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `tipo_actividad` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_actividad`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `actividadusuario_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


COMMIT;
