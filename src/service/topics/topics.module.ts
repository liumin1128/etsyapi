import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicsService } from './topics.service';
import { TopicsResolver } from './topics.resolver';
import { Topic, TopicSchema } from './topics.schema';
import { TopicsController } from './topics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
  ],
  providers: [TopicsService, TopicsResolver],
  exports: [TopicsService],
  controllers: [TopicsController],
})
export class TopicsModule {}
