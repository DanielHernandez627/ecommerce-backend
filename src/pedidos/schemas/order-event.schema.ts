import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class OrderEvent extends Document {
  @Prop({ required: true })
  orderId: number;

  @Prop({ required: true })
  event: string;

  @Prop({ required: true, default: () => new Date() })
  timestamp: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const OrderEventSchema = SchemaFactory.createForClass(OrderEvent);
