import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePedidoDto {
  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsOptional()
  notas?: string;
}
