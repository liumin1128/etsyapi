import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToSeatsService } from './usertoseats.service';
import { UserToSeatsResolver } from './usertoseats.resolver';
import { UserToSeat, UserToSeatSchema } from './usertoseats.schema';
import { UserToSeatsController } from './usertoseats.controller';
import { SeatsModule } from '../seats/seats.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserToSeat.name, schema: UserToSeatSchema },
    ]),
    SeatsModule,
  ],
  providers: [UserToSeatsService, UserToSeatsResolver],
  exports: [UserToSeatsService],
  controllers: [UserToSeatsController],
})
export class UserToSeatsModule {}
