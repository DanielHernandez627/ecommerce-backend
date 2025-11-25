-- === 06-triggers-extra.sql ===
-- Triggers adicionales


-- Log de cambios de estado del pedido
CREATE TABLE IF NOT EXISTS pedido_logs (
id INT AUTO_INCREMENT PRIMARY KEY,
pedido_id INT,
estado_anterior VARCHAR(50),
estado_nuevo VARCHAR(50),
fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DELIMITER $$
CREATE TRIGGER trg_log_estado
BEFORE UPDATE ON pedidos
FOR EACH ROW
BEGIN
IF OLD.estado <> NEW.estado THEN
INSERT INTO pedido_logs(pedido_id, estado_anterior, estado_nuevo)
VALUES(OLD.id, OLD.estado, NEW.estado);
END IF;
END$$
DELIMITER ;