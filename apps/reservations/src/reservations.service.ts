import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { toObjectId, UserDto } from '@app/common';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(
    createDocumentDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    return this.paymentsService
      .send('create_charge', { ...createDocumentDto.charge, email })
      .pipe(
        map((res) => {
          return this.reservationsRepository.create({
            ...createDocumentDto,
            userId: toObjectId(userId),
            timestamp: new Date(),
            invoiceId: res.id,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationsRepository.find();
  }

  async findById(id: string) {
    return this.reservationsRepository.findById(id);
  }

  async update(
    id: string | Types.ObjectId,
    updateDocumentDto: UpdateReservationDto,
  ) {
    return this.reservationsRepository.findByIdAndUpdate(id, {
      $set: updateDocumentDto,
    });
  }

  async remove(id: string | Types.ObjectId) {
    return this.reservationsRepository.findByIdAndDelete(id);
  }
}
