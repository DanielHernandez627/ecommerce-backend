import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Type(() => Number)
  stock: number;
}
