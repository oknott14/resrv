import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { DatabaseModule } from '@app/common';
import { ReservationModelDef } from './reservations/models/reservation.schema';

@Module({
  imports: [
    DatabaseModule.forFeature([ReservationModelDef]),
    ReservationsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
