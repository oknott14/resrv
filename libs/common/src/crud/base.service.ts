import { Types } from 'mongoose';
import { AbstractRepository } from '../database/abstract.repository';
import { AbstractDocument } from '../database/abstract.schema';

export abstract class BaseService<
  TDocument extends AbstractDocument = AbstractDocument,
  CreateDocumentDto extends Omit<TDocument, '_id'> = Omit<TDocument, '_id'>,
  UpdateDocumentDto extends
    Partial<CreateDocumentDto> = Partial<CreateDocumentDto>,
> {
  constructor(private readonly repository: AbstractRepository<TDocument>) {}

  create(createDocumentDto: CreateDocumentDto) {
    return this.repository.create(createDocumentDto);
  }

  findAll() {
    return this.repository.find();
  }

  findById(id: string) {
    return this.repository.findById(id);
  }

  update(id: string | Types.ObjectId, updateDocumentDto: UpdateDocumentDto) {
    return this.repository.findByIdAndUpdate(id, {
      $set: updateDocumentDto,
    });
  }

  remove(id: string | Types.ObjectId) {
    return this.repository.findByIdAndDelete(id);
  }
}
