import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WechatController } from '@/service/oauths/wechat/wechat.controller';
import { WechatService } from '@/service/oauths/wechat/wechat.service';
import { OAuthModule } from '@/service/oauths/oauths.module';
import { UserModule } from '@/service/users/users.module';
import { AuthModule } from '@/service/auth/auth.module';
import { QiniuModule } from '@/utils/qiniu/qiniu.module';

@Module({
  imports: [HttpModule, OAuthModule, UserModule, QiniuModule, AuthModule],
  providers: [WechatService],
  controllers: [WechatController],
})
export class WechatModule {}
