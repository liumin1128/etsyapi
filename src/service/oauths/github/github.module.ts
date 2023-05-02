import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { OAuthModule } from '@/service/oauths/oauths.module';
import { UserModule } from '@/service/users/users.module';
import { AuthModule } from '@/service/auth/auth.module';
import { QiniuModule } from '@/utils/qiniu/qiniu.module';

@Module({
  imports: [HttpModule, OAuthModule, UserModule, QiniuModule, AuthModule],
  providers: [GithubService],
  controllers: [GithubController],
})
export class GithubModule {}
