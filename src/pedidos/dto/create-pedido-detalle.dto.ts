import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePedidoDetalleDto {
  @IsNumber()
  @IsNotEmpty()
  producto_id: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  cantidad: number;
}
