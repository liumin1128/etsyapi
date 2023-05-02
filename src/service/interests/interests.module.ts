import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterestsService } from './interests.service';
import { InterestsResolver } from './interests.resolver';
import { Interest, InterestSchema } from './interests.schema';
import { InterestsController } from './interests.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interest.name, schema: InterestSchema },
    ]),
  ],
  providers: [InterestsService, InterestsResolver],
  exports: [InterestsService],
  controllers: [InterestsController],
})
export class InterestsModule {}
