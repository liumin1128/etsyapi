import { Module } from '@nestjs/common';
import { OAuthModule } from './oauths.module';
import { GithubModule } from './github/github.module';
import { WechatModule } from './wechat/wechat.module';
import { WxModule } from './wx/wx.module';
@Module({
  imports: [OAuthModule, GithubModule, WechatModule, WxModule],
})
export class OAuthIndexModule {}
