import { Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BaseService } from './base.service';
import { AbstractDocument } from '../database';

export class BaseController<
  TDocument extends AbstractDocument,
  CreateDocumentDto extends Omit<TDocument, '_id'>,
  UpdateDocumentDto extends Partial<CreateDocumentDto>,
> {
  constructor(
    private readonly service: BaseService<
      TDocument,
      CreateDocumentDto,
      UpdateDocumentDto
    >,
  ) {}

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.service.create({
      ...createDocumentDto,
      userId: '1234567890',
      timestamp: new Date(),
    });
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.service.update(id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
