import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './entities/pedido.entity';
import { PedidoDetalle } from './entities/pedido-detalle.entity';
import { Producto } from '../productos/entities/producto.entity';
import { OrderEventSchema } from './schemas/order-event.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, PedidoDetalle, Producto]),
    MongooseModule.forFeature([
      { name: 'OrderEvent', schema: OrderEventSchema },
    ]),
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}
