import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ collection: 'sales', timestamps: true })
export class Sale {
  _id: Types.ObjectId;

  @Prop({ type: Number, index: true, sparse: true })
  saleId?: number;

  @Prop({ type: Object, required: true })
  product: any; // snapshot of product (productId, title, price, sku)

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;

  @Prop({ type: Object, required: true })
  buyer: any; // { name, email, address }

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: String, default: 'created' })
  status?: string;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
