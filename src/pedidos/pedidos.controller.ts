import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CreatePedidoDetalleDto } from './dto/create-pedido-detalle.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pedidosService.findOne(id);
  }

  @Get(':id/detalles')
  getDetalles(@Param('id') id: number) {
    return this.pedidosService.getDetallesByPedido(id);
  }

  @Post(':id/detalles')
  @HttpCode(HttpStatus.CREATED)
  addDetalle(
    @Param('id') id: number,
    @Body(ValidationPipe) createDetalleDto: CreatePedidoDetalleDto,
  ) {
    return this.pedidosService.addDetalle(id, createDetalleDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body(ValidationPipe) updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.pedidosService.remove(id);
  }

  @Get('usuario/:usuarioId')
  findByUsuario(@Param('usuarioId') usuarioId: number) {
    return this.pedidosService.findByUsuario(usuarioId);
  }
}
