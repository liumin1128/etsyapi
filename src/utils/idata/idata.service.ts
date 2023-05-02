import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { QiniuService } from '@/utils/qiniu/qiniu.service';
import { serializeObjectToQueryString } from '@/utils/common';

interface getNewsListParams {
  keyword: string;
}

export interface OriginNews {
  cover: string;
  photos: string[];
  publishDate: number; //1574234748 发布时间
  html: string; //<article>.....</article> content对应的html代码，包含格式标签等
  id: string; // 302f2a6a3abd705f0e2dd032b4925a51 id
  viewCount: number; // 8574 观看数
  catDist2: string[]; // [...] 二级分类概率分布列表
  spamLabel: string; // null 文本审核标签
  copyDate: number; // 1574237926 数据处理的时间
  commentCount: number; // 99 评论数
  sentimentDist: Record<string, unknown>; // {...} content的情感分布
  posterScreenName: string; // 菱镜头 发布者名称
  url: string; // http://toutiao.com/group/6761286761273360907/ url
  catLabel1: string; // 体育 一级分类标签
  sourceRegion: string; //中国 数据源地区
  spamDist: string[]; // [...] 文本审核分布列表
  catDist1: string[]; //[...] 一级分类概率分布列表
  createDate: number; // 1574236088 采集时间
  likeCount: number; // 27 点赞数
  spamCode: number; // 0 文本审核代码：0=非违禁，1=违禁，2=人工复审
  appTags: string[]; // [...] 网站内部标签
  catLabel2: string; // 足球 二级分类标签
  appName: string; // 今日头条 appCode的名称
  posterId: string; //5836885863_5836885863 发布者id
  sourceType: string; // APP 数据源类型
  content: string; //.... 文章内容
  title: string; // 足协官方：12月初公布联赛新政细则，降低俱乐部负担规范薪酬体系 标题
  imageUrls: string[]; //[...] 图片链接列表
  topkeyword: string[]; // [...] 文章内容top关键词
  appCode: string; //toutiao.com app代码
  sentimentDistTitle: Record<string, unknown>; // {...} title的情感分布列表
  entities: string[]; // [...] 命名实体
  total: number; // 4949865 总和
  dataType: string; //idata 数据类型
  hasNext: boolean; //true 是否有下一页
  pageToken: string; // 20:WzE1NzQyMzQzMTgsMTU3NDIzNjMyOSwidG91d 页面语言
  retcode: string; //000000 状态码
}

interface FormatedNews extends OriginNews {
  date: number;
  tags: string[];
  showHtml: boolean;
}

const canShowHtmlList = [
  // 知名网站
  '3dmgame.com',
  'qq.com',
  'duowan.com',
  'eastday.com',
  'ifeng.com',
  'doyo.cn',
  // 其他
  'ikanchai.com',
  'pcpop.com',
  'vrtuoluo.cn',
  'gao7.com',
  '37txt.cn',
];

const blackList = [
  'ali213.net', // 翻页有问题
  'weixin', // 图片不显示
  'weixinpro',
  'yxdown.com', // 图片不显示
  'game234.com', // 内容质量过低
  'myzaker.com', // 内容质量过低
  'pcgames.com.cn', // 内容质量过低
  'yzz.cn', // 内容质量过低
  'china.com', // 分页异常
  // 'gamersky.com', // 分页异常
  'uuu9.com', // 图片不显示
  'e23.cn',
  'quxiu.com',
  'erhainews.com',
  'ledanji.com', // 内容质量过低
];

function isInBlackList(appCode: string): boolean {
  return blackList.indexOf(appCode) !== -1;
}

function canShowHtml(appCode: string): boolean {
  return canShowHtmlList.indexOf(appCode) !== -1;
}

export function format(data: OriginNews): FormatedNews {
  return {
    ...data,
    date: data.publishDate,
    photos: data.imageUrls,
    tags: data.topkeyword,
    showHtml: canShowHtml(data.appCode),
  };
}

export function filter(data: OriginNews): boolean {
  // 排除腾讯网，已经有腾讯新闻了
  if (data.appName === '腾讯网') return false;

  // 排除垃圾
  if (data.spamLabel === '恶意推广') return false;

  if (isInBlackList(data.appCode)) return false;

  // 排除国外源
  // if (data.sourceRegion !== '中国') return false;

  // 排除无图的
  if (!Array.isArray(data.imageUrls) || !data.imageUrls[0]) return false;
  return true;
}

@Injectable()
export class IDataService {
  constructor(
    private readonly httpService: HttpService,
    private readonly qiniuService: QiniuService,
  ) {}

  private apiKey = process.env.IDATA_API_KEY;

  async getNewList({ keyword }: getNewsListParams): Promise<any> {
    const params = {
      kw: keyword,
      apikey: this.apiKey,
      // sourceRegion: '中国',
    };

    const api = `http://api01.idataapi.cn:8000/article/idataapi?${serializeObjectToQueryString(
      params,
    )}`;

    console.log('抓取综合文章：', api);

    const data = await this.httpService
      .get(api, { method: 'GET' })
      .pipe(map((response) => response.data))
      .toPromise();

    if (data.retcode === '000000') {
      return data;
    }

    throw data;
  }

  async formatOriginNews(originNews: OriginNews): Promise<OriginNews> {
    const i = format(originNews);

    // 抓图片
    const photos = await Promise.all(
      i.photos.map((j) => this.qiniuService.fetchToQiniu(j)),
    );
    // 抓封面
    let { cover, html } = i;
    if (cover) {
      cover = await this.qiniuService.fetchToQiniu(cover);
    }
    // 替换html中的图片
    i.photos.map((j, idx) => {
      html = html.replace(new RegExp(j, 'g'), photos[idx]);
    });
    // 修复今日头条图片不显示的问题
    if (i.appCode === 'toutiao.com') {
      if (html.indexOf('<div class="pgc-img"') !== -1) {
        photos.map((j) => {
          html = html.replace(
            /<div class="pgc-img"(([\s\S])*?)<\/div>/i,
            `<figure><img src="${j}" alt=""/></figure>`,
          );
        });
      } else {
        photos.map((j) => {
          html = html.replace(
            /<a class="image"(([\s\S])*?)<\/a>/i,
            `<figure><img src="${j}" alt=""/></figure>`,
          );
        });
      }
    }

    return { ...i, cover, html, photos };
  }
}
