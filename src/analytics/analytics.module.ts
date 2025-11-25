import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { PedidoDetalle } from '../pedidos/entities/pedido-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoDetalle, Producto, Usuario])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
