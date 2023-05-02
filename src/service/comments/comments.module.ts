import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import {
  CommentsResolver,
  CommentObjectUnionResolver,
} from './comments.resolver';
import { NewsModule } from '@/service/news/news.module';
import { DynamicsModule } from '@/service/dynamics/dynamics.module';
import { RetroMessagesModule } from '@/service/retros/messages/module';
import { Comment, CommentSchema } from './comments.schema';
import { CommentsController } from './comments.controller';
import { AuthModule } from '@/service/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    DynamicsModule,
    NewsModule,
    RetroMessagesModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  providers: [CommentsService, CommentsResolver, CommentObjectUnionResolver],
  exports: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
