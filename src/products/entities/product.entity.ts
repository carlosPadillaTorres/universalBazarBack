import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Dimensions, DimensionsSchema } from './dimensions.entity';
import { Review, ReviewSchema } from './review.entity';
import { Meta, MetaSchema } from './meta.entity';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products', timestamps: true })
export class Product {
    // Mongo _id will be used as primary identifier
    _id: Types.ObjectId;

    // optional numeric id preserved if your source data uses it
    @Prop({ type: Number, index: true, sparse: true })
    id?: number;

    @Prop({ type: String, required: true, index: true })
    title: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true, lowercase: true, index: true })
    category: string;

    @Prop({ type: Number, required: true, min: 0 })
    price: number;

    @Prop({ type: Number, min: 0, max: 100, default: 0 })
    discountPercentage?: number;

    @Prop({ type: Number, min: 0, max: 5, default: 0 })
    rating?: number;

    @Prop({ type: Number, min: 0, default: 0 })
    stock?: number;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: String })
    brand?: string;

    @Prop({ type: String, index: true, unique: true, sparse: true })
    sku?: string;

    @Prop({ type: Number })
    weight?: number;

    @Prop({ type: DimensionsSchema, _id: false })
    dimensions?: Dimensions;

    @Prop({ type: String })
    warrantyInformation?: string;

    @Prop({ type: String })
    shippingInformation?: string;

    @Prop({ type: String, default: 'In Stock' })
    availabilityStatus?: string;

    @Prop({ type: [ReviewSchema], default: [] })
    reviews?: Review[];

    @Prop({ type: String })
    returnPolicy?: string;

    @Prop({ type: Number, min: 1, default: 1 })
    minimumOrderQuantity?: number;

    @Prop({ type: MetaSchema, _id: false })
    meta?: Meta;

    @Prop({ type: [String], default: [] })
    images?: string[];

    @Prop({ type: String })
    thumbnail?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Text index for search on title + description
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ sku: 1 }, { unique: true, sparse: true });
