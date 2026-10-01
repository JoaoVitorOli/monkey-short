import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
})
export class Short {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, maxlength: 2048 })
  originalUrl: string;

  createdAt: Date;
}

export const ShortSchema = SchemaFactory.createForClass(Short);
