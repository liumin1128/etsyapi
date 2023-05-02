import { map, lastValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

export interface GetAccessTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
}

export interface GetUserInfoResponse {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username?: any;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: Plan;
}

interface Plan {
  name: string;
  space: number;
  collaborators: number;
  private_repos: number;
}

@Injectable()
export class GithubService {
  private client_id = process.env.OAUTH_GITHUB_CLIENT_ID;
  private client_secret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  private scope = ['user'];

  constructor(private readonly httpService: HttpService) {}

  getOAuthUrl(): string {
    const dataStr = new Date().valueOf();
    let url = 'https://github.com/login/oauth/authorize';
    url += `?client_id=${this.client_id}`;
    url += `&scope=${this.scope}`;
    url += `&state=${dataStr}`;
    return url;
  }

  getAccessToken(code: string) {
    const url = 'https://github.com/login/oauth/access_token';

    const params = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      code,
    };

    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
    };

    return lastValueFrom<GetAccessTokenResponse>(
      this.httpService
        .post(url, params, {
          headers,
        })
        .pipe(
          map((response) => {
            return response.data;
          }),
        ),
    );
  }

  getUserInfo(access_token: string) {
    const headers = {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: 'token ' + access_token,
    };

    return lastValueFrom<GetUserInfoResponse>(
      this.httpService.get(`https://api.github.com/user`, { headers }).pipe(
        map((response) => {
          return response.data;
        }),
      ),
    );
  }
}
