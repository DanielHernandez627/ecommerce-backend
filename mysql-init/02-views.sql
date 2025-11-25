-- === 02-views.sql ===
-- Vistas para el e-commerce

-- Vista: información completa del pedido
CREATE OR REPLACE VIEW vw_pedidos_detallados AS
SELECT 
  p.id AS pedido_id,
  u.nombre AS usuario,
  u.email,
  p.total,
  p.estado,
  p.creado_en,
  d.producto_id,
  pr.nombre AS producto,
  d.cantidad,
  d.precio_unit,
  (d.cantidad * d.precio_unit) AS subtotal
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
JOIN pedido_detalles d ON d.pedido_id = p.id
JOIN productos pr ON pr.id = d.producto_id;

-- Vista: productos con poco stock
CREATE OR REPLACE VIEW vw_productos_bajo_stock AS
SELECT 
  id, nombre, stock
FROM productos
WHERE stock < 10;
