import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsOptional()
  @IsString()
  @IsEnum(['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'])
  estado?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
