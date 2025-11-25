import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido } from './entities/pedido.entity';
import { PedidoDetalle } from './entities/pedido-detalle.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CreatePedidoDetalleDto } from './dto/create-pedido-detalle.dto';
import { Producto } from '../productos/entities/producto.entity';
import { OrderEvent } from './schemas/order-event.schema';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidosRepository: Repository<Pedido>,
    @InjectRepository(PedidoDetalle)
    private pedidoDetallesRepository: Repository<PedidoDetalle>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectModel('OrderEvent')
    private orderEventModel: Model<OrderEvent>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const pedido = this.pedidosRepository.create(createPedidoDto);
    const savedPedido = await this.pedidosRepository.save(pedido);

    // Sincronizar con MongoDB
    await this.syncToMongoDB(savedPedido.id, 'CREADO');

    return savedPedido;
  }

  async addDetalle(
    pedidoId: number,
    createDetalleDto: CreatePedidoDetalleDto,
  ): Promise<PedidoDetalle> {
    const pedido = await this.findOne(pedidoId);
    const producto = await this.productosRepository.findOne({
      where: { id: createDetalleDto.producto_id },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (producto.stock < createDetalleDto.cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }

    const detalle = this.pedidoDetallesRepository.create({
      pedido_id: pedidoId,
      producto_id: createDetalleDto.producto_id,
      cantidad: createDetalleDto.cantidad,
      precio_unit: producto.precio,
    });

    const savedDetalle = await this.pedidoDetallesRepository.save(detalle);

    // Actualizar stock
    producto.stock -= createDetalleDto.cantidad;
    await this.productosRepository.save(producto);

    // Actualizar total del pedido
    await this.recalculatePedidoTotal(pedidoId);

    return savedDetalle;
  }

  async findAll(): Promise<Pedido[]> {
    return await this.pedidosRepository.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
    });
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id },
      relations: ['usuario', 'detalles', 'detalles.producto'],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    Object.assign(pedido, updatePedidoDto);
    const updated = await this.pedidosRepository.save(pedido);

    // Sincronizar cambio de estado
    if (updatePedidoDto.estado) {
      await this.syncToMongoDB(id, `ESTADO_ACTUALIZADO_${updatePedidoDto.estado}`);
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    await this.pedidosRepository.remove(pedido);
    await this.syncToMongoDB(id, 'CANCELADO');
  }

  async findByUsuario(usuarioId: number): Promise<Pedido[]> {
    return await this.pedidosRepository.find({
      where: { usuario_id: usuarioId },
      relations: ['detalles', 'detalles.producto'],
    });
  }

  private async recalculatePedidoTotal(pedidoId: number): Promise<void> {
    const detalles = await this.pedidoDetallesRepository.find({
      where: { pedido_id: pedidoId },
    });

    const total = detalles.reduce((sum, detalle) => {
      return sum + (parseFloat(detalle.precio_unit as any) * detalle.cantidad);
    }, 0);

    const pedido = await this.pedidosRepository.findOne({ where: { id: pedidoId } });
    if (pedido) {
      pedido.total = total as any;
      await this.pedidosRepository.save(pedido);
    }
  }

  private async syncToMongoDB(orderId: number, event: string): Promise<void> {
    try {
      const orderEvent = new this.orderEventModel({
        orderId,
        event,
        timestamp: new Date(),
        metadata: { source: 'nestjs-api' },
      });
      await orderEvent.save();
    } catch (error) {
      console.error('Error sincronizando con MongoDB:', error);
    }
  }

  async getDetallesByPedido(pedidoId: number): Promise<PedidoDetalle[]> {
    return await this.pedidoDetallesRepository.find({
      where: { pedido_id: pedidoId },
      relations: ['producto'],
    });
  }
}
