import { Controller, Get, Query, Redirect } from '@nestjs/common';
import {
  WxService,
  GetUserInfoResponse,
  GetAccessTokenResponse,
} from '@/service/oauths/wx/wx.service';
import { OAuthsService } from '@/service/oauths/oauths.service';
import { UsersService } from '@/service/users/users.service';
import { QiniuService } from '@/utils/qiniu/qiniu.service';
import { UserDocument } from '@/service/users/schemas/users.schema';
import { OAuthDocument } from '@/service/oauths/oauths.schema';
import { AuthService } from '@/service/auth/auth.service';

@Controller('/oauth/wx')
export class WxController {
  constructor(
    private readonly wxService: WxService,
    private readonly oauthService: OAuthsService,
    private readonly userService: UsersService,
    private readonly qiniuService: QiniuService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Redirect()
  login(): { url: string; statusCode: number } {
    return { url: this.wxService.getOAuthUrl(), statusCode: 301 };
  }

  @Get('/callback')
  @Redirect()
  async callback(
    @Query('code') code: string,
  ): Promise<{ url: string; statusCode: number }> {
    try {
      const data: GetAccessTokenResponse = await this.wxService.getAccessToken(
        code,
      );
      console.log('data');
      console.log(data);
      const { access_token, openid, unionid } = data;
      if (!access_token) {
        console.log('微信获取access_token失败');
        return;
      }

      let user: UserDocument;
      let oauth: OAuthDocument;

      const uuid: string = unionid || openid;
      const platform = 'wx';

      oauth = await this.oauthService.findOne({ uuid, platform });

      console.log('oauth');
      console.log(oauth);

      // 检查第三方信息，不存在就创建新的
      if (!oauth) {
        const userInfo: GetUserInfoResponse = await this.wxService.getUserInfo(
          access_token,
          openid,
        );

        console.log('userInfo');
        console.log(userInfo);

        const { nickname, headimgurl } = userInfo;

        const avatarUrl = await this.qiniuService.fetchToQiniu(headimgurl);
        console.log('avatarUrl');
        console.log(avatarUrl);

        user = await this.userService.create({
          username: uuid,
          avatarUrl: avatarUrl,
          nickname: nickname,
        });

        oauth = await this.oauthService.create({
          uuid,
          user,
          platform,
          data: userInfo,
        });
      }

      const token = await this.authService.login({ _id: oauth.user._id });

      let url = '';

      url += process.env.FRONT_DOMAIN;
      if (process.env.FRONT_PORT) {
        url += ':';
        url += process.env.FRONT_PORT;
      }

      url += `/#/login/oauth?token=${token}`;

      console.log('url');
      console.log(url);

      return {
        url: url,
        statusCode: 301,
      };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
