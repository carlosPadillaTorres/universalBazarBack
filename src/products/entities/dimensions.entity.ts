import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Dimensions {
    @Prop({ type: Number, required: true })
    width: number;

    @Prop({ type: Number, required: true })
    height: number;

    @Prop({ type: Number, required: true })
    depth: number;
}
export const DimensionsSchema = SchemaFactory.createForClass(Dimensions);
