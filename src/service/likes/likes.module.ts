import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesService } from './likes.service';
import { LikesResolver, LikeObjectUnionResolver } from './likes.resolver';
import { NewsModule } from '@/service/news/news.module';
import { CommentsModule } from '@/service/comments/comments.module';
import { DynamicsModule } from '@/service/dynamics/dynamics.module';
import { RetroMessagesModule } from '@/service/retros/messages/module';
import { Like, LikeSchema } from './likes.schema';
import { LikesController } from './likes.controller';

@Module({
  imports: [
    DynamicsModule,
    NewsModule,
    RetroMessagesModule,
    CommentsModule,
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
  ],
  providers: [LikesService, LikesResolver, LikeObjectUnionResolver],
  exports: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
