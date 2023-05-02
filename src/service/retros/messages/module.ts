import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RetroMessagesService } from './service';
import { RetroMessagesResolver } from './resolver';
import { RetroMessage, RetroMessageSchema } from './schema';
import { RetroMessagesController } from './controller';
import { RetrosModule } from '@/service/retros/retros.module';
import { UserToOrganizationModule } from '@/service/usertoorganizations/usertoorganizations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RetroMessage.name, schema: RetroMessageSchema },
    ]),
    RetrosModule,
    UserToOrganizationModule,
  ],
  providers: [RetroMessagesService, RetroMessagesResolver],
  exports: [RetroMessagesService],
  controllers: [RetroMessagesController],
})
export class RetroMessagesModule {}
