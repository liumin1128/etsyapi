import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WxController } from '@/service/oauths/wx/wx.controller';
import { WxService } from '@/service/oauths/wx/wx.service';
import { OAuthModule } from '@/service/oauths/oauths.module';
import { UserModule } from '@/service/users/users.module';
import { AuthModule } from '@/service/auth/auth.module';
import { QiniuModule } from '@/utils/qiniu/qiniu.module';

@Module({
  imports: [HttpModule, OAuthModule, UserModule, QiniuModule, AuthModule],
  providers: [WxService],
  controllers: [WxController],
})
export class WxModule {}
