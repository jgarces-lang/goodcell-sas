




-- =========================================================
-- Good Cell SAS - Base de datos completa (MySQL)
-- Archivo: database/goodcell_db.sql
-- =========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Crear base de datos y usarla
CREATE DATABASE IF NOT EXISTS goodcell_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE goodcell_db;

-- =========================================================
-- Tablas
-- =========================================================

DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin','cliente') NOT NULL DEFAULT 'cliente',
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categorias (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  imagen VARCHAR(255) DEFAULT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE productos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  categoria_id INT UNSIGNED NOT NULL,
  nombre VARCHAR(160) NOT NULL,
  descripcion TEXT NOT NULL,
  precio INT UNSIGNED NOT NULL,
  imagen VARCHAR(255) DEFAULT NULL,
  marca VARCHAR(120) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_productos_categoria (categoria_id),
  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pedidos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre_cliente VARCHAR(140) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  total INT UNSIGNED NOT NULL DEFAULT 0,
  estado ENUM('pendiente','confirmado','enviado','cancelado') NOT NULL DEFAULT 'pendiente',
  nota_whatsapp TEXT DEFAULT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE detalle_pedido (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pedido_id INT UNSIGNED NOT NULL,
  producto_id INT UNSIGNED NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  precio_unit INT UNSIGNED NOT NULL,
  subtotal INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  KEY idx_detalle_pedido_pedido (pedido_id),
  KEY idx_detalle_pedido_producto (producto_id),
  CONSTRAINT fk_detalle_pedido_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_detalle_pedido_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Seed: categorías reales (7)
-- =========================================================

INSERT INTO categorias (id, nombre, descripcion, imagen, activo) VALUES
(1, 'Parlantes', 'JBL, BOSE', NULL, 1),
(2, 'Audífonos', 'Shokz', NULL, 1),
(3, 'Apple', 'Accesorios Apple', NULL, 1),
(4, 'Gaming', 'Logitech, Redragon', NULL, 1),
(5, 'Fotografía', 'Fujifilm', NULL, 1),
(6, 'Hogar Inteligente', 'Amazon Alexa', NULL, 1),
(7, 'Accesorios', 'Belkin', NULL, 1);

-- =========================================================
-- Seed: productos reales (14)
-- =========================================================

INSERT INTO productos (id, categoria_id, nombre, descripcion, precio, imagen, marca, stock, activo) VALUES
(1, 1, 'BOSE S1 Pro+', 'Parlante profesional portátil con sonido potente y batería de larga duración.', 3500000, '../img/producto-placeholder.png', 'BOSE', 5, 1),
(2, 1, 'JBL Neo One Compact', 'Parlante compacto premium con bajos definidos y conectividad moderna.', 3000000, '../img/producto-placeholder.png', 'JBL', 6, 1),
(3, 2, 'Shokz Open Dots', 'Audífonos de conducción ósea para comodidad y seguridad en movimiento.', 800000, '../img/producto-placeholder.png', 'Shokz', 12, 1),
(4, 2, 'Shokz OpenRun Pro 2 Garmin', 'Ideal para deporte y entrenamiento intensivo con excelente autonomía.', 950000, '../img/producto-placeholder.png', 'Shokz', 8, 1),
(5, 3, 'Apple Adaptador USB-C 20W', 'Carga rápida y segura para iPhone y otros dispositivos compatibles.', 120000, '../img/producto-placeholder.png', 'Apple', 20, 1),
(6, 3, 'Apple Pencil USB-C', 'Precisión profesional para dibujo, notas y productividad en iPad.', 550000, '../img/producto-placeholder.png', 'Apple', 7, 1),
(7, 4, 'Logitech G502 Hero', 'Mouse gaming ergonómico con sensor de alta precisión.', 280000, '../img/producto-placeholder.png', 'Logitech', 15, 1),
(8, 4, 'Teclado Redragon Horus TKL', 'Teclado mecánico compacto con excelente respuesta para gaming.', 350000, '../img/producto-placeholder.png', 'Redragon', 9, 1),
(9, 5, 'Fujifilm Instax Mini 12', 'Cámara instantánea con estilo moderno y resultados vibrantes.', 400000, '../img/producto-placeholder.png', 'Fujifilm', 11, 1),
(10, 5, 'Impresora Instax Mini Link 3', 'Imprime tus fotos desde el celular en segundos.', 550000, '../img/producto-placeholder.png', 'Fujifilm', 10, 1),
(11, 6, 'Alexa Echo Pop', 'Asistente inteligente compacto para música y control del hogar.', 270000, '../img/producto-placeholder.png', 'Amazon', 14, 1),
(12, 6, 'Alexa Echo Dot', 'Asistente de voz con mejor audio y más funcionalidades.', 320000, '../img/producto-placeholder.png', 'Amazon', 13, 1),
(13, 7, 'Belkin Batería 10K MagSafe', 'Batería magnética de alta capacidad para iPhone.', 350000, '../img/producto-placeholder.png', 'Belkin', 18, 1),
(14, 7, 'Cable Belkin USB-A Lightning', 'Cable resistente para carga y transferencia de datos.', 100000, '../img/producto-placeholder.png', 'Belkin', 30, 1);

-- =========================================================
-- Seed: usuario admin listo para usar
-- =========================================================
-- Nota: auth.php soporta password_hash (recomendado) y tambien
-- comparación en texto plano (temporal) por hash_equals.
--
-- Credenciales:
--   Email: admin@goodcell.com
--   Password: admin123
INSERT INTO usuarios (id, nombre, email, contrasena_hash, rol, activo) VALUES
(1, 'Administrador Good Cell', 'admin@goodcell.com', 'admin123', 'admin', 1);

