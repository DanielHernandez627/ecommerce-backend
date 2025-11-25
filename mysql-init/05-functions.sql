-- === 05-functions.sql ===
-- Funciones útiles para el e-commerce


-- Calcular subtotal de un detalle
DELIMITER $$
CREATE FUNCTION fn_subtotal(cantidad INT, precio DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
RETURN cantidad * precio;
END$$
DELIMITER ;


-- Verificar stock suficiente
DELIMITER $$
CREATE FUNCTION fn_stock_suficiente(p_producto_id INT, p_cantidad INT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
DECLARE stock_actual INT;
SELECT stock INTO stock_actual FROM productos WHERE id = p_producto_id;
RETURN stock_actual >= p_cantidad;
END$$
DELIMITER ;