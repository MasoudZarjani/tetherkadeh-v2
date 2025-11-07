import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderSide } from '../enums/OrderSide.enum';
import { SchemaTypes, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ default: null })
  price: number;
  @Prop({ default: null })
  amount: number;
  @Prop({ default: null, trim: true })
  trackId: string;
  @Prop({
    type: String,
    enum: OrderSide,
    default: OrderSide.Buy,
  })
  side: OrderSide;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  })
  user: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Symbol',
    default: null,
  })
  symbol: Types.ObjectId;
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Symbol',
    default: null,
  })
  pairSymbol: Types.ObjectId;
}
const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre<OrderDocument>('save', async function (next) {
  const order = this;
  const orderModel: any = order.constructor;
  try {
    const fiveSecondsAgo = new Date(new Date().getTime() - 5 * 1000);

    const existingOrder = await orderModel.findOne({
      amount: order.amount,
      price: order.price,
      user: order.user,
      symbol: order.symbol,
      side: order.side,
      createdAt: {
        $gt: fiveSecondsAgo,
      },
    });
    if (!existingOrder) {
      next();
    } else {
      console.log('Existing  Order');
    }
  } catch (error) {
    next(error);
  }
});

export { OrderSchema };
