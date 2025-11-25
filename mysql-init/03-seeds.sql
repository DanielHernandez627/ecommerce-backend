-- === 03-seed.sql ===
-- Datos iniciales para pruebas del e-commerce incluyendo casos especiales


-- ============================
-- USUARIOS
-- ============================
INSERT INTO usuarios (nombre, email, password_hash) VALUES
('Juan Perez', 'juan@example.com', 'hash1'),
('María Gomez', 'maria@example.com', 'hash2'),
('Carlos Rojas', 'carlos@example.com', 'hash3'),
('Ana Torres', 'ana@example.com', 'hash4'),
('Usuario Sin Pedidos', 'nopeds@example.com', 'hash5'); -- Caso especial


-- ============================
-- PRODUCTOS
-- ============================
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop Gamer', 'Laptop de alto rendimiento', 4200.00, 15),
('Mouse Inalambrico', 'Mouse ergonómico', 80.00, 50),
('Teclado Mecánico RGB', 'Teclado con switches blue', 250.00, 25),
('Audífonos Bluetooth', 'Audífonos con cancelación de ruido', 180.00, 30),
('Monitor 27" 144Hz', 'Monitor gamer 144Hz IPS', 900.00, 20),
('Producto Sin Descripción', NULL, 100.00, 12),               -- Caso especial
('Producto Stock Bajo', 'Stock muy limitado', 15.00, 3),       -- Caso especial
('Producto Sin Stock', 'Producto agotado', 50.00, 0),          -- Caso especial
('Producto Precio Cero', 'Producto gratuito', 0.00, 10);       -- Caso especial


-- ============================
-- PEDIDO 1 — Usuario 1
-- ============================
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(1, 4280.00, 'CREADO');

INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unit) VALUES
(1, 1, 1, 4200.00),
(1, 2, 1, 80.00);


-- ============================
-- PEDIDO 2 — Usuario 2 (varios productos)
-- ============================
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(2, 510.00, 'PAGADO');

INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unit) VALUES
(2, 3, 2, 250.00),
(2, 2, 1, 80.00);


-- ============================
-- PEDIDO 3 — Usuario 1 (productos varios)
-- ============================
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(1, 480.00, 'ENVIADO');

INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unit) VALUES
(3, 4, 2, 180.00),
(3, 2, 1, 80.00);


-- ============================
-- PEDIDO 4 — Usuario 3 (sin detalles — caso especial)
-- ============================
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(3, 0.00, 'CREADO');


-- ============================
-- PEDIDO 5 — Usuario 2 (pedido cancelado)
-- ============================
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(2, 0.00, 'CANCELADO');


-- ============================
-- PEDIDO 6 — Usuario 4 (pedido con cantidad alta)
-- ============================
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(4, 15000.00, 'CREADO');

INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unit) VALUES
(6, 1, 3, 4200.00),
(6, 5, 5, 900.00);


-- ============================
-- PEDIDO 7 — Usuario 1 (detalle duplicado — caso especial)
-- Simula error de datos para pruebas
-- ============================
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(1, 160.00, 'CREADO');

INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unit) VALUES
(7, 7, 2, 15.00),
(7, 7, 4, 15.00);  -- Duplicado a propósito


-- ============================
-- PEDIDO 8 — Usuario 3 (producto precio cero — caso especial)
-- ============================
INSERT INTO pedidos (usuario_id, total, estado) VALUES
(3, 0.00, 'PAGADO');

INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unit) VALUES
(8, 9, 3, 0.00);  -- Producto con precio cero
