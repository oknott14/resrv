import { AbstractDocument } from '@app/common';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class ReservationDocument extends AbstractDocument {
  @Prop()
  timestamp: Date;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  userId: Types.ObjectId;

  @Prop()
  invoiceId: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);

export const ReservationModelDef: ModelDefinition = {
  name: ReservationDocument.name,
  schema: ReservationSchema,
};
