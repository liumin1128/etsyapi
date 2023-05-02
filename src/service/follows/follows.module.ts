import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsService } from './follows.service';
import { FollowsResolver } from './follows.resolver';
import { NewsModule } from '@/service/news/news.module';
import { CommentsModule } from '@/service/comments/comments.module';
import { DynamicsModule } from '@/service/dynamics/dynamics.module';
import { RetroMessagesModule } from '@/service/retros/messages/module';
import { Follow, FollowSchema } from './follows.schema';
import { FollowsController } from './follows.controller';

@Module({
  imports: [
    DynamicsModule,
    NewsModule,
    RetroMessagesModule,
    CommentsModule,
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
  ],
  providers: [FollowsService, FollowsResolver],
  exports: [FollowsService],
  controllers: [FollowsController],
})
export class FollowsModule {}
