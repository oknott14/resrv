import { AbstractDocument } from '@app/common';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema =
  SchemaFactory.createForClass(UserDocument);

export const UsersModelDef: ModelDefinition = {
  name: UserDocument.name,
  schema: UserSchema,
};
