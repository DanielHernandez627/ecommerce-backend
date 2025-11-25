import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { PedidoDetalle } from '../../pedidos/entities/pedido-detalle.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int' })
  stock: number;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @OneToMany(() => PedidoDetalle, (detalle) => detalle.producto)
  detalles: PedidoDetalle[];
}
