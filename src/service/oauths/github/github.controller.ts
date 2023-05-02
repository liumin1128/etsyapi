import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { GithubService } from './github.service';
import { OAuthsService } from '@/service/oauths/oauths.service';
import { UsersService } from '@/service/users/users.service';
import { QiniuService } from '@/utils/qiniu/qiniu.service';
import { UserDocument } from '@/service/users/schemas/users.schema';
import { OAuthDocument } from '@/service/oauths/oauths.schema';
import { AuthService } from '@/service/auth/auth.service';

@Controller('/oauth/github')
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private readonly oauthService: OAuthsService,
    private readonly userService: UsersService,
    private readonly qiniuService: QiniuService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Redirect()
  login(): { url: string; statusCode: number } {
    return { url: this.githubService.getOAuthUrl(), statusCode: 301 };
  }

  @Get('/callback')
  @Redirect()
  async callback(
    @Query('code') code: string,
  ): Promise<{ url: string; statusCode: number }> {
    try {
      let user: UserDocument;
      let oauth: OAuthDocument;

      const data = await this.githubService.getAccessToken(code);

      const { access_token } = data;

      const userInfo = await this.githubService.getUserInfo(access_token);

      // 设置唯一ID
      const uuid = userInfo.id + '';

      oauth = await this.oauthService.findOne({
        platform: 'github',
        uuid: uuid,
      });

      // 检查第三方信息，不存在就创建新的
      if (!oauth) {
        const { avatar_url, name } = userInfo;
        const avatarUrl = await this.qiniuService.fetchToQiniu(avatar_url);
        console.log('avatarUrl');
        console.log(avatarUrl);

        user = await this.userService.create({
          username: uuid,
          avatarUrl: avatarUrl,
          nickname: name,
        });

        oauth = await this.oauthService.create({
          uuid: uuid,
          platform: 'wechat',
          data: userInfo,
          user: user,
        });
      }

      const token = await this.authService.login({ _id: oauth.user._id });

      console.log('token');
      console.log(token);

      // 重定向页面到用户登录页，并返回token
      return {
        url: `${process.env.FRONT_DOMAIN}:${process.env.FRONT_PORT}/#/login/oauth?token=${token}`,
        statusCode: 301,
      };
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }
}
