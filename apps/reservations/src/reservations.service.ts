import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { BaseService } from '@app/common/crud';
import { ReservationDocument } from './models/reservation.schema';

@Injectable()
export class ReservationsService extends BaseService<
  ReservationDocument,
  CreateReservationDto,
  UpdateReservationDto
> {
  constructor(private readonly reservationsRepository: ReservationsRepository) {
    super(reservationsRepository);
  }
}
