import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { PedidoDetalle } from './pedido-detalle.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, })
  total: number;

  @Column({ type: 'varchar', length: 50, default: 'CREADO' })
  estado: string;

  @CreateDateColumn({ name: 'creado_en' })
  creado_en: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  // 👇 ESTA ES LA PARTE QUE TE FALTABA
  @OneToMany(() => PedidoDetalle, (detalle) => detalle.pedido, {
    cascade: true,
  })
  detalles: PedidoDetalle[];
}
