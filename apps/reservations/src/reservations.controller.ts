import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationDocument } from './models/reservation.schema';
import { BaseController } from '@app/common/crud';
import { JwtAuthGuard } from '@app/common';

@Controller('reservations')
export class ReservationsController extends BaseController<
  ReservationDocument,
  CreateReservationDto,
  UpdateReservationDto
> {
  constructor(private readonly reservationsService: ReservationsService) {
    super(reservationsService);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create({
      ...createReservationDto,
      userId: '1234567890',
      timestamp: new Date(),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateReservationDto,
  ): Promise<ReservationDocument> {
    return super.update(id, updateDocumentDto);
  }
}
