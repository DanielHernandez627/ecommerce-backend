import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('pedido_detalles')
export class PedidoDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pedido_id: number;

  @Column()
  producto_id: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unit' })
  precio_unit: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Producto, (producto) => producto.detalles)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
}
