-- === 04-procedures.sql ===
-- Stored Procedures para la plataforma e-commerce

-- 1. Crear Pedido completo (pedido + detalles)
DELIMITER $$
CREATE PROCEDURE sp_crear_pedido(
    IN p_usuario_id INT,
    IN p_total DECIMAL(10,2),
    IN p_estado VARCHAR(50)
)
BEGIN
    INSERT INTO pedidos (usuario_id, total, estado)
    VALUES (p_usuario_id, p_total, p_estado);

    SELECT LAST_INSERT_ID() AS nuevo_pedido_id;
END $$
DELIMITER ;


-- 2. Agregar detalle a un pedido
DELIMITER $$
CREATE PROCEDURE sp_agregar_detalle(
    IN p_pedido_id INT,
    IN p_producto_id INT,
    IN p_cantidad INT,
    IN p_precio DECIMAL(10,2)
)
BEGIN
    INSERT INTO pedido_detalles (pedido_id, producto_id, cantidad, precio_unit)
    VALUES (p_pedido_id, p_producto_id, p_cantidad, p_precio);
END $$
DELIMITER ;


-- 3. Obtener historial de pedidos por usuario
DELIMITER $$
CREATE PROCEDURE sp_historial_usuario(
    IN p_usuario_id INT
)
BEGIN
    SELECT *
    FROM vw_pedidos_detallados
    WHERE pedido_id IN (
        SELECT id FROM pedidos WHERE usuario_id = p_usuario_id
    )
    ORDER BY creado_en DESC;
END $$
DELIMITER ;