import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Meta {
    @Prop({ type: Date })
    createdAt?: Date;

    @Prop({ type: Date })
    updatedAt?: Date;

    @Prop({ type: String, index: true, sparse: true })
    barcode?: string;

    @Prop({ type: String })
    qrCode?: string;
}
export const MetaSchema = SchemaFactory.createForClass(Meta);
