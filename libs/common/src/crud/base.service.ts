import { AbstractRepository } from '../database/abstract.repository';
import { AbstractDocument } from '../database/abstract.schema';

export abstract class BaseService<
  TDocument extends AbstractDocument = AbstractDocument,
  CreateDocumentDto extends Omit<TDocument, '_id'> = Omit<TDocument, '_id'>,
  UpdateDocumentDto extends
    Partial<CreateDocumentDto> = Partial<CreateDocumentDto>,
> {
  constructor(private readonly repository: AbstractRepository<TDocument>) {}

  create(createReservationDto: CreateDocumentDto) {
    return this.repository.create(createReservationDto);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return this.repository.findById(id);
  }

  update(id: string, updateReservationDto: UpdateDocumentDto) {
    return this.repository.findByIdAndUpdate(id, {
      $set: updateReservationDto,
    });
  }

  remove(id: string) {
    return this.repository.findByIdAndDelete(id);
  }
}
