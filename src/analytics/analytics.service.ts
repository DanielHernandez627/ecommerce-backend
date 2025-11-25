import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { PedidoDetalle } from '../pedidos/entities/pedido-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Pedido)
    private pedidosRepository: Repository<Pedido>,
    @InjectRepository(PedidoDetalle)
    private pedidoDetallesRepository: Repository<PedidoDetalle>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async getPedidosDetallados() {
    return await this.pedidosRepository.query(`
      SELECT 
        p.id,
        p.usuario_id,
        u.nombre,
        u.email,
        p.total,
        p.estado,
        p.creado_en,
        COUNT(pd.id) as cantidad_items
      FROM pedidos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN pedido_detalles pd ON p.id = pd.pedido_id
      GROUP BY p.id, p.usuario_id, u.nombre, u.email, p.total, p.estado, p.creado_en
      ORDER BY p.creado_en DESC
    `);
  }

  async getProductosBajoStock(umbral: number = 5) {
    return await this.productosRepository.query(`
      SELECT 
        id,
        nombre,
        descripcion,
        precio,
        stock,
        creado_en
      FROM productos
      WHERE stock <= ?
      ORDER BY stock ASC
    `, [umbral]);
  }

  async getHistorialUsuario(usuarioId: number) {
    return await this.pedidosRepository.query(`
      SELECT 
        p.id,
        p.total,
        p.estado,
        p.creado_en,
        COUNT(pd.id) as cantidad_items,
        SUM(pd.cantidad) as total_productos
      FROM pedidos p
      LEFT JOIN pedido_detalles pd ON p.id = pd.pedido_id
      WHERE p.usuario_id = ?
      GROUP BY p.id, p.total, p.estado, p.creado_en
      ORDER BY p.creado_en DESC
    `, [usuarioId]);
  }

  async getPedidosHoy() {
    return await this.pedidosRepository.query(`
      SELECT 
        id,
        usuario_id,
        total,
        estado,
        creado_en
      FROM pedidos
      WHERE DATE(creado_en) = CURDATE()
      ORDER BY creado_en DESC
    `);
  }

  async getTopProductos(limit: number = 10) {
    return await this.pedidoDetallesRepository.query(`
      SELECT 
        p.id,
        p.nombre,
        p.precio,
        SUM(pd.cantidad) as total_vendido,
        COUNT(DISTINCT pd.pedido_id) as numero_pedidos,
        SUM(pd.cantidad * pd.precio_unit) as ingresos_totales
      FROM productos p
      JOIN pedido_detalles pd ON p.id = pd.producto_id
      GROUP BY p.id, p.nombre, p.precio
      ORDER BY total_vendido DESC
      LIMIT ?
    `, [limit]);
  }

  async getTopUsuarios(limit: number = 10) {
    return await this.usuariosRepository.query(`
      SELECT 
        u.id,
        u.email,
        u.nombre,
        COUNT(p.id) as numero_pedidos,
        SUM(p.total) as gasto_total,
        AVG(p.total) as gasto_promedio
      FROM usuarios u
      LEFT JOIN pedidos p ON u.id = p.usuario_id
      GROUP BY u.id, u.email, u.nombre
      ORDER BY gasto_total DESC
      LIMIT ?
    `, [limit]);
  }

  async getVentasDiarias(dias: number = 30) {
    return await this.pedidosRepository.query(`
      SELECT 
        DATE(creado_en) as fecha,
        COUNT(*) as numero_pedidos,
        SUM(total) as total_ventas,
        AVG(total) as promedio_venta
      FROM pedidos
      WHERE creado_en >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(creado_en)
      ORDER BY fecha DESC
    `, [dias]);
  }

  async getStockMenorA(cantidad: number) {
    return await this.productosRepository.query(`
      SELECT 
        id,
        nombre,
        descripcion,
        precio,
        stock
      FROM productos
      WHERE stock < ?
      ORDER BY stock ASC
    `, [cantidad]);
  }

  async getPedidosPorEstado() {
    return await this.pedidosRepository.query(`
      SELECT 
        estado,
        COUNT(*) as cantidad,
        SUM(total) as total_ventas,
        AVG(total) as promedio_venta
      FROM pedidos
      GROUP BY estado
      ORDER BY cantidad DESC
    `);
  }

  async getVentasMes() {
    return await this.pedidosRepository.query(`
      SELECT 
        DATE_FORMAT(creado_en, '%Y-%m') as mes,
        COUNT(*) as numero_pedidos,
        SUM(total) as total_ventas,
        AVG(total) as promedio_venta,
        MIN(total) as venta_minima,
        MAX(total) as venta_maxima
      FROM pedidos
      WHERE MONTH(creado_en) = MONTH(NOW())
        AND YEAR(creado_en) = YEAR(NOW())
      GROUP BY DATE_FORMAT(creado_en, '%Y-%m')
    `);
  }

  async getResumenInventario() {
    return await this.productosRepository.query(`
      SELECT 
        'General' as categoria,
        COUNT(*) as numero_productos,
        SUM(stock) as stock_total,
        AVG(precio) as precio_promedio,
        MIN(precio) as precio_minimo,
        MAX(precio) as precio_maximo,
        SUM(stock * precio) as valor_inventario
      FROM productos
    `);
  }

  async getVentasPorCategoria(mes?: string) {
    let query = `
      SELECT 
        'General' as categoria,
        COUNT(DISTINCT pd.pedido_id) as numero_pedidos,
        SUM(pd.cantidad) as total_productos_vendidos,
        SUM(pd.cantidad * pd.precio_unit) as ingresos_totales
      FROM productos p
      JOIN pedido_detalles pd ON p.id = pd.producto_id
    `;

    if (mes) {
      query += ` WHERE DATE_FORMAT(pd.creado_en, '%Y-%m') = ?`;
    }

    return mes
      ? await this.productosRepository.query(query, [mes])
      : await this.productosRepository.query(query);
  }
}
