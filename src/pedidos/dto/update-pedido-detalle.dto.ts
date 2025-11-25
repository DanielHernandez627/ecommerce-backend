import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDetalleDto } from './create-pedido-detalle.dto';

export class UpdatePedidoDetalleDto extends PartialType(CreatePedidoDetalleDto) {}
