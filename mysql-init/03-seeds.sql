-- === 03-seed.sql ===
-- Datos iniciales para pruebas

INSERT INTO usuarios (nombre, email, password_hash) VALUES
('Juan Perez', 'juan@example.com', 'hash1'),
('María Gomez', 'maria@example.com', 'hash2');

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop Gamer', 'Laptop de alto rendimiento', 4200.00, 15),
('Mouse Inalambrico', 'Mouse ergonomico', 80.00, 50),
('Teclado Mecanico', 'Teclado RGB switches blue', 250.00, 25);

INSERT INTO pedidos (usuario_id, total, estado) VALUES
(1, 4280.00, 'CREADO');

INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unit) VALUES
(1, 1, 1, 4200.00),
(1, 2, 1, 80.00);
