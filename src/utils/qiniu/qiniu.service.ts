import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';

@Injectable()
export class QiniuService {
  private accessKey = process.env.QINIU_ACCESS_KEY;
  private secretKey = process.env.QINIU_SECRET_KEY;
  private bucket = process.env.QINIU_BUCKET_NAME;
  private expires = parseInt(process.env.QINIU_EXPIRES_TIME, 10);
  private domain = process.env.QINIU_BUCKET_DOMAIN;
  private mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
  private options = {
    scope: this.bucket,
    expires: this.expires,
    saveKey: '$(etag)$(ext)',
  };
  private config = new qiniu.conf.Config();
  private putPolicy = new qiniu.rs.PutPolicy(this.options);
  private bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);

  async fetch(url: string, options?: { path: string }): Promise<any> {
    const { path = '' } = options || {};
    const urlObj = new URL(url);
    const filename = urlObj.pathname.split('/').pop();
    let key = filename;
    if (path) {
      key = path + '/' + filename;
    }

    return new Promise((resolve, reject) => {
      this.bucketManager.fetch(
        url,
        this.bucket,
        key,
        (err, respBody, respInfo) => {
          if (err) {
            console.log(err);
            reject(err);
          } else if (respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject(respBody);
          }
        },
      );
    });
  }

  async fetchToQiniu(url: string, options?: any): Promise<any> {
    return this.fetch(url, options)
      .then(({ key }) => `${this.domain}/${key}`)
      .catch((err) => {
        console.log('拉取七牛图片出错');
        console.log(err);
        return '';
      });
  }

  getQiniuToken(): { token: string; expires: number } {
    console.log('xxxxx');
    return {
      token: this.putPolicy.uploadToken(this.mac),
      expires: this.expires,
    };
  }
}
