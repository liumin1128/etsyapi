import { CommonModule } from '@/service/common/common.module';
import { AuthModule } from '@/service/auth/auth.module';
import { DynamicsModule } from '@/service/dynamics/dynamics.module';
import { NewsModule } from '@/service/news/news.module';
import { InterestsModule } from '@/service/interests/interests.module';
import { HashtagsModule } from '@/service/hashtags/hashtags.module';
import { CommentsModule } from '@/service/comments/comments.module';
import { LikesModule } from '@/service/likes/likes.module';
import { OAuthIndexModule } from '@/service/oauths/oauths.index.module';
import { RetrosModule } from '@/service/retros/retros.module';
import { RetroMessagesModule } from '@/service/retros/messages/module';
import { OrganizationsModule } from '@/service/organizations/organizations.module';
import { UserToOrganizationModule } from '@/service/usertoorganizations/usertoorganizations.module';
import { SeatsModule } from '@/service/seats/seats.module';
import { UserToSeatsModule } from '@/service/usertoseats/usertoseats.module';
import { ProductsModule } from '@/service/products/products.module';

export default [
  CommonModule,
  AuthModule,
  DynamicsModule,
  NewsModule,
  CommentsModule,
  LikesModule,
  InterestsModule,
  HashtagsModule,
  OAuthIndexModule,
  RetrosModule,
  RetroMessagesModule,
  OrganizationsModule,
  UserToOrganizationModule,
  SeatsModule,
  UserToSeatsModule,
  ProductsModule,
];
