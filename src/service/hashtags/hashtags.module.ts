import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashtagsService } from './hashtags.service';
import { HashtagsResolver } from './hashtags.resolver';
import { Hashtag, HashtagSchema } from './hashtags.schema';
import { HashtagsController } from './hashtags.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hashtag.name, schema: HashtagSchema }]),
  ],
  providers: [HashtagsService, HashtagsResolver],
  exports: [HashtagsService],
  controllers: [HashtagsController],
})
export class HashtagsModule {}
