import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Review {
    @Prop({ type: Number, required: true, min: 0, max: 5 })
    rating: number;

    @Prop({ type: String, required: true })
    comment: string;

    @Prop({ type: Date, required: true })
    date: Date;

    @Prop({ type: String, required: true })
    reviewerName: string;

    @Prop({ type: String, required: true })
    reviewerEmail: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
