import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('pedidos-detallados')
  getPedidosDetallados() {
    return this.analyticsService.getPedidosDetallados();
  }

  @Get('productos-bajo-stock')
  getProductosBajoStock(@Query('umbral') umbral: string = '5') {
    return this.analyticsService.getProductosBajoStock(parseInt(umbral));
  }

  @Get('historial-usuario/:id')
  getHistorialUsuario(@Param('id') id: number) {
    return this.analyticsService.getHistorialUsuario(id);
  }

  @Get('pedidos-hoy')
  getPedidosHoy() {
    return this.analyticsService.getPedidosHoy();
  }

  @Get('top-productos')
  getTopProductos(@Query('limit') limit: string = '10') {
    return this.analyticsService.getTopProductos(parseInt(limit));
  }

  @Get('top-usuarios')
  getTopUsuarios(@Query('limit') limit: string = '10') {
    return this.analyticsService.getTopUsuarios(parseInt(limit));
  }

  @Get('ventas-diarias')
  getVentasDiarias(@Query('dias') dias: string = '30') {
    return this.analyticsService.getVentasDiarias(parseInt(dias));
  }

  @Get('stock-menor-a/:cantidad')
  getStockMenorA(@Param('cantidad') cantidad: number) {
    return this.analyticsService.getStockMenorA(cantidad);
  }

  @Get('pedidos-por-estado')
  getPedidosPorEstado() {
    return this.analyticsService.getPedidosPorEstado();
  }

  @Get('ventas-mes')
  getVentasMes() {
    return this.analyticsService.getVentasMes();
  }

  @Get('resumen-inventario')
  getResumenInventario() {
    return this.analyticsService.getResumenInventario();
  }

  @Get('ventas-por-categoria')
  getVentasPorCategoria(@Query('mes') mes?: string) {
    return this.analyticsService.getVentasPorCategoria(mes);
  }
}
