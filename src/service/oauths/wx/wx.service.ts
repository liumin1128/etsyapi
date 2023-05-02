import { map, lastValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { randomString } from '@/utils/common';

export interface GetAccessTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  unionid?: string;
  scope: string;
}

export interface GetUserInfoResponse {
  openid: string;
  nickname: string;
  sex: number;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid: string;
}

@Injectable()
export class WxService {
  private appid = process.env.OAUTH_WX_APPID;
  private secret = process.env.OAUTH_WX_SECRET;
  private redirect_uri = process.env.OAUTH_WX_REDIRECT_URI;

  constructor(private readonly httpService: HttpService) {}

  // 文档地址
  // https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html

  getOAuthUrl(): string {
    const state = randomString(6);
    let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
    url += `?appid=${this.appid}`;
    url += `&redirect_uri=${this.redirect_uri}`;
    url += `&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`;
    return url;
  }

  getAccessTokenUrl(code): string {
    let url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
    url += `?appid=${this.appid}`;
    url += `&secret=${this.secret}`;
    url += `&code=${code}`;
    url += '&grant_type=authorization_code';
    return url;
  }

  // 文档地址
  // http://wiki.connect.qq.com/get_user_info
  getUserInfoUrl(access_token, openid: string): string {
    let url = 'https://api.weixin.qq.com/sns/userinfo';
    url += `?access_token=${access_token}`;
    url += `&openid=${openid}`;
    url += '&lang=zh_CN';
    return url;
  }

  getUserInfo(access_token, openid: string) {
    const url = this.getUserInfoUrl(access_token, openid);
    return lastValueFrom<GetUserInfoResponse>(
      this.httpService.get(url).pipe(
        map((response) => {
          return response.data;
        }),
      ),
    );
  }

  getAccessToken(code: string) {
    const url = this.getAccessTokenUrl(code);
    return lastValueFrom<GetAccessTokenResponse>(
      this.httpService.get(url).pipe(
        map((response) => {
          return response.data;
        }),
      ),
    );
  }
}
