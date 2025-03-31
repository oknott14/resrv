import { Types } from 'mongoose';

export function toObjectId(input: string | Types.ObjectId): Types.ObjectId {
  if (!(input instanceof Types.ObjectId)) {
    input = new Types.ObjectId(input);
  }

  return input;
}
