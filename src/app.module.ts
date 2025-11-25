import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { Usuario } from './usuarios/entities/usuario.entity';
import { Producto } from './productos/entities/producto.entity';
import { Pedido } from './pedidos/entities/pedido.entity';
import { PedidoDetalle } from './pedidos/entities/pedido-detalle.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      username: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'rootpassword',
      database: process.env.MYSQL_DATABASE || 'ecommerce',
      entities: [Usuario, Producto, Pedido, PedidoDetalle],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' ? true : false,
      logging: process.env.TYPEORM_LOGGING === 'true' ? true : false,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://mongoadmin:mongo_pass@localhost:27017/ecommerce?authSource=admin'
    ),
    UsuariosModule,
    ProductosModule,
    PedidosModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
