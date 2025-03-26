import { AbstractDocument } from '@app/common';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class ReservationDocument extends AbstractDocument {
  @Prop()
  timestamp: Date;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  userId: string;

  @Prop()
  placeId: string;

  @Prop()
  invoiceId: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);

export const ReservationModelDef: ModelDefinition = {
  name: ReservationDocument.name,
  schema: ReservationSchema,
};
