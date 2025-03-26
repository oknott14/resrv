import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = await new this.model({
      _id: new Types.ObjectId(),
      ...document,
    }).save();

    return createdDocument.toObject<TDocument>({ flattenMaps: true });
  }

  async find(query: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(query).lean<TDocument[]>(true);
  }

  private ensureDocument(
    document: TDocument | null,
    query: FilterQuery<TDocument>,
  ): TDocument {
    if (!document) {
      this.logger.warn('Document was not found with query', query);
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  async findOne(query: FilterQuery<TDocument>): Promise<TDocument> {
    return this.model
      .findOne(query)
      .lean<TDocument>(true)
      .then((doc) => this.ensureDocument(doc, query));
  }

  async findOneAndUpdate(
    query: FilterQuery<TDocument>,
    updates: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model
      .findOneAndUpdate(query, updates, { new: true })
      .lean<TDocument>(true)
      .then((doc) => this.ensureDocument(doc, query));
  }

  async findOneAndDelete(query: FilterQuery<TDocument>): Promise<TDocument> {
    return await this.model
      .findOneAndDelete(query)
      .lean<TDocument>(true)
      .then((doc) => this.ensureDocument(doc, query));
  }

  async findById(_id: Types.ObjectId): Promise<TDocument> {
    return this.findOne({ _id });
  }

  async findByIdAndUpdate(
    _id: Types.ObjectId,
    updates: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    return this.findOneAndUpdate({ _id }, updates);
  }

  async fundByIdAndDelete(_id: Types.ObjectId): Promise<TDocument> {
    return this.findOneAndDelete({ _id });
  }
}
