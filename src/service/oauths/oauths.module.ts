import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { OAuthsService } from './oauths.service';
// import { GithubService } from './github/github.service';
// import { GithubModule } from './github/github.module';
import { OAuth, OAuthSchema } from './oauths.schema';
import { OAuthsResolver } from './oauths.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OAuth.name, schema: OAuthSchema }]),
    HttpModule,
    // GithubModule,
  ],
  providers: [OAuthsService, OAuthsResolver],
  exports: [OAuthsService],
})
export class OAuthModule {}
