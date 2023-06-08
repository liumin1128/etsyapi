import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';
import { map, lastValueFrom, catchError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import { batchTask } from '@/utils/promise';
import { QiniuService } from '@/utils/qiniu/qiniu.service';
import { CreateProductDto } from './products.dto';
import { Product, ProductDocument } from './products.schema';
import {
  ProductSnapshot,
  ProductSnapshotDocument,
} from '@/service/productsnapshots/productsnapshots.schema';
import { urlList } from './products.utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { HttpsProxyAgent } = require('https-proxy-agent');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SocksProxyAgent = require('socks-proxy-agent');

interface Auth {
  username: string;
  password: string;
}

interface ProxyConfig {
  host: string;
  port: number;
  auth: Auth;
  protocol: string;
}

interface ProxyItem {
  id: string;
  username: string;
  password: string;
  proxy_address: string;
  port: number;
  valid: boolean;
  last_verification: string;
  country_code: string;
  city_name: string;
  asn_name: string;
  asn_number: number;
  high_country_confidence: boolean;
  created_at: string;
}

export interface Snapshot {
  title: string;
  description: string;
  stars: number;
  sales: number;
  currencyValue: number;
  reviews: number;
  favorites: number;
  starSeller: boolean;
  etsyPick: boolean;
  bestSeller: boolean;
  freeShipping: boolean;
  kinds: string[];
  tags: string[];
  pictures: string[];
}

interface ListItem {
  url: string;
  title: string;
  id: string;
  name: string;
  cover: string;
  stars: number;
  commentCount: number;
  currencyValue: number;
  currencySymbol: string;
  starSeller: boolean;
  tags: string[];
}

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

async function sleepRandom() {
  return await sleep(2 + Math.random() * 3);
}

@Injectable()
export class ProductsService {
  proxyList: ProxyItem[] = [];

  constructor(
    @InjectModel(Product.name)
    private readonly productsModel: Model<ProductDocument>,

    @InjectModel(ProductSnapshot.name)
    private readonly productSnapshotsModel: Model<ProductSnapshotDocument>,

    private readonly httpService: HttpService,
    private readonly qiniuService: QiniuService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productsModel(createProductDto);
    await createdProduct.save();
    return createdProduct;
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productsModel.find();
  }

  async count(query): Promise<number> {
    return this.productsModel.count(query);
  }

  async search(args): Promise<ProductDocument[]> {
    const { limit = 10, skip = 0, search = '' } = args;

    let matchRules = [];
    if (search) {
      matchRules = [
        {
          $match: {
            title: {
              $regex: search,
              $options: 'i',
            },
            /* 其他筛选条件 */
          },
        },
      ];
    }

    return this.productsModel.aggregate([
      // 首先匹配商品
      ...matchRules,
      {
        $skip: skip,
      },

      {
        $limit: limit,
      },

      //  关联最近的快照表
      {
        $lookup: {
          from: 'productsnapshots',
          let: { productID: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product', '$$productID'] },
                    // { $gte: ['$createdAt', threeDaysAgo] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            {
              $limit: 7,
            },
            {
              $project: {
                /* 快照表需要保留的字段 */
                sales: 1,
                stars: 1,
                favorites: 1,
                reviews: 1,
                currencyValue: 1,
                createdAt: 1,
              },
            },
          ],
          as: 'snapshots',
        },
      },
    ]);

    // return this.productsModel.find(query).skip(skip).limit(limit);
  }

  async findOne(query): Promise<ProductDocument[]> {
    return this.productsModel.aggregate([
      // 首先匹配商品
      {
        $match: query,
      },

      //  关联整个快照表
      // {
      //   $lookup: {
      //     from: "snapshot",
      //     localField: "_id",
      //     foreignField: "product",
      //     as: "snapshots"
      //   }
      // },

      //  关联最近的快照表
      {
        $lookup: {
          from: 'productsnapshots',
          let: { productID: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product', '$$productID'] },
                    // { $gte: ['$createdAt', threeDaysAgo] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            {
              $limit: 90,
            },
            {
              $project: {
                /* 快照表需要保留的字段 */
                sales: 1,
                stars: 1,
                favorites: 1,
                reviews: 1,
                currencyValue: 1,
                createdAt: 1,
              },
            },
          ],
          as: 'snapshots',
        },
      },

      //  下面是修改最终结果的形态
      // {
      //   $project: {
      //     titles: '$snapshots.title', // 将查询结果中的price字段保存到snapshots字段中
      //     snapshots: '$snapshots.currencyValue', // 将查询结果中的price字段保存到snapshots字段中
      //   },
      // },

      // {
      //   $addFields: {
      //     snapshots: {
      //       $map: {
      //         input: '$snapshots',
      //         as: 'snapshot',
      //         in: {
      //           sales: '$$snapshot.sales',
      //         },
      //       },
      //     },
      //   },
      // },
    ]);

    return this.productsModel.aggregate([
      // 首先匹配商品
      {
        $match: {},
      },

      //  关联整个快照表
      // {
      //   $lookup: {
      //     from: "snapshot",
      //     localField: "_id",
      //     foreignField: "product",
      //     as: "snapshots"
      //   }
      // },

      //  关联最近的快照表
      {
        $lookup: {
          from: 'productsnapshots',
          let: { productID: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product', '$$productID'] },
                    // { $gte: ['$createdAt', threeDaysAgo] },
                  ],
                },
              },
            },
            {
              $limit: 100,
            },
            {
              $project: {
                /* 快照表需要保留的字段 */
                sales: 1,
                stars: 1,
                favorites: 1,
                reviews: 1,
                currencyValue: 1,
                createdAt: 1,
              },
            },
          ],
          as: 'snapshots',
        },
      },

      //  下面是修改最终结果的形态
      // {
      //   $project: {
      //     titles: '$snapshots.title', // 将查询结果中的price字段保存到snapshots字段中
      //     snapshots: '$snapshots.currencyValue', // 将查询结果中的price字段保存到snapshots字段中
      //   },
      // },

      // {
      //   $addFields: {
      //     snapshots: {
      //       $map: {
      //         input: '$snapshots',
      //         as: 'snapshot',
      //         in: {
      //           sales: '$$snapshot.sales',
      //         },
      //       },
      //     },
      //   },
      // },
    ]);
    // .populate({
    //   path: 'snapshots',
    //   select: '_id',
    //   strictPopulate: false,
    //   match: { product: '$$_id' },
    //   model: this.productSnapshotsModel,
    // });
  }

  async findById(_id: string): Promise<ProductDocument> {
    return this.productsModel.findById(_id);
  }

  async getAgentList(): Promise<ProxyItem[]> {
    console.log('getAgentList');
    const url =
      'https://proxy.webshare.io/api/v2/proxy/list/?page=1&page_size=100&mode=direct';

    const proxy = {
      host: '104.239.37.40',
      port: 5692,
      auth: {
        username: 'bxqycapg',
        password: 'ph4aadbj8pr',
      },
      protocol: 'http', // 增加此项声明使用http代理
    };

    return lastValueFrom<any>(
      this.httpService
        .get(url, {
          proxy,
          headers: {
            // Authorization: 'Token 66tpg1pk04u42dbm0sie6my2f5xmt8kw39imnum9', // 自己
            Authorization: 'Token o8xkqfirseuiape46z49tov7aqbrxb0qv4hgscev',
          },
        })
        .pipe(
          map((response) => {
            return response.data.results;
          }),
        ),
    );
  }

  async getRandomAgent(): Promise<ProxyConfig> {
    if (this.proxyList.length === 0) {
      const list = await this.getAgentList();
      console.log('Agent list: ', list.length);
      this.proxyList = list;
    }

    const proxyItem =
      this.proxyList[Math.floor(Math.random() * this.proxyList.length)];

    return {
      host: proxyItem.proxy_address,
      port: proxyItem.port,
      auth: {
        username: proxyItem.username,
        password: proxyItem.password,
      },
      protocol: 'http', // 增加此项声明使用http代理
    };
  }

  async removeProxyAgent(proxy) {
    console.log('removeProxyAgent: ', proxy);
    console.log('this.proxyList: ', this.proxyList.length);
    this.proxyList = this.proxyList.filter((item) => {
      return item.proxy_address !== proxy.host;
    });
    console.log('this.proxyList: ', this.proxyList.length);
  }

  async fetch(url: string, retryCount = 3): Promise<any> {
    console.log('url: ', url);

    await sleepRandom();

    const proxy = await this.getRandomAgent();

    return lastValueFrom<any>(
      this.httpService
        .get(url, {
          proxy,
          timeout: 10000,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain',
            'user-agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
          },
        })
        .pipe(
          map((response) => {
            return response.data;
          }),
          catchError((error) => {
            console.log('error: ', error);
            this.removeProxyAgent(proxy);
            console.log('retryCount', retryCount);
            if (retryCount === 0) {
              console.log('retryCount === 0');
              throw error;
            }
            return this.fetch(url, retryCount - 1);
          }),
        ),
    );
  }

  async getProductSnapshot(url: string): Promise<Snapshot> {
    console.log('getList: ', url);
    const html = await this.fetch(url);

    const $ = cheerio.load(html);
    const list = [];

    const pictures = [];
    $('ul.carousel-pane-list li').each((i, el) => {
      let src = $(el).find('img').attr('src');
      if (!src) {
        src = $(el).find('img').attr('data-src');
      }
      if (!src) {
        src = $(el).find('video source').attr('src');
      }
      if (src) {
        pictures.push(src);
      }
    });

    const sales = $(
      '#listing-page-cart span.wt-mb-xs-1.wt-display-inline-block span.wt-text-caption',
    )
      .text()
      .trim()
      .replace(/[^\d]/g, '');

    const price = $(
      '#listing-page-cart div[data-buy-box-region="price"] p.wt-text-title-03',
    )
      .text()
      .trim()
      .replace(/[^\d]/g, '');

    const reviews = $('#reviews h2.wt-text-body-03')
      .text()
      .trim()
      .replace(/[^\d]/g, '');

    const favorites = $(
      'div.wt-display-flex-xs.wt-align-items-baseline.wt-flex-direction-row-xs .wt-text-caption a.wt-text-link',
    )
      .text()
      .trim()
      .replace(/[^\d]/g, '');

    const description = $(
      'p[data-product-details-description-text-content].wt-text-body-01',
    ).toString();

    const kinds = [];

    $('div.wt-text-caption.wt-text-center-xs.wt-text-left-lg a').each(
      (i, el) => {
        if (i === 0) {
          return;
        }
        kinds.push($(el).text().trim());
      },
    );

    const tags = [...kinds];

    $('ul.wt-display-flex-xs.tag-cards-with-image.wt-flex-wrap li').each(
      (i, el) => {
        tags.push($(el).find('li a').text().trim());
      },
    );

    $('ul.wt-action-group.wt-list-inline.wt-mb-xs-2 li').each((i, el) => {
      tags.push($(el).find('li a').text().trim());
    });

    const title = $('h1.wt-text-body-01').text().trim();
    const stars = $('input[name="rating"]').attr('value');

    const starSeller =
      $('button[data-wt-popover-trigger] p.wt-text-caption-title')
        .text()
        .trim() === 'Star Seller';

    const etsyPick =
      $('button.wt-popover__trigger span.wt-badge').text().trim() ===
      'Etsy’s Pick';
    const bestSeller =
      $('button.wt-popover__trigger span.wt-badge').text().trim() ===
      'Bestseller';
    const freeShipping =
      $('#impact-narrative-banner .wt-show-lg').text().trim() ===
      'Etsy offsets carbon emissions from shipping and packaging on this purchase.';

    console.log('Snapshot Title: ', title);
    return {
      title,
      pictures,
      kinds,
      tags,
      description,

      starSeller,
      etsyPick,
      bestSeller,
      freeShipping,

      stars: parseFloat(stars) || 0,
      sales: parseInt(sales, 10) || 0,
      currencyValue: parseInt(price, 10) || 0,
      reviews: parseInt(reviews, 10) || 0,
      favorites: parseInt(favorites, 10) || 0,
    };
  }

  async getDetail(item: ListItem): Promise<any> {
    try {
      const snapshot = await this.getProductSnapshot(item?.url);
      const obj = { ...item, ...snapshot };

      const product = await this.productsModel.findOneAndUpdate(
        { id: item.id }, // 查询条件
        { $set: obj }, // 更新的字段
        { upsert: true, new: true }, // upsert 为 true 表示如果不存在则创建；new 为 true 表示返回更新后的对象，默认为更新前的对象
      );

      // 创建商品当日快照
      await this.productSnapshotsModel.findOneAndUpdate(
        {
          product: product._id,
          createdAt: {
            $gte: dayjs().startOf('day'),
            $lt: dayjs().endOf('day'),
          },
        }, // 查询条件
        { $set: obj }, // 更新的字段
        { upsert: true, new: true }, // upsert 为 true 表示如果不存在则创建；new 为 true 表示返回更新后的对象，默认为更新前的对象
      );
    } catch (error) {
      console.error('getDetail error: ', error.response?.data);
    }
  }

  async getList(url: string): Promise<ListItem[]> {
    console.log('getList: ', url);
    const html = await this.fetch(url);

    const $ = cheerio.load(html);
    const list = [];

    $('ol.tab-reorder-container li').each((i, el) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const title = $(el).find('h3').text().replaceAll('\n', '').trim();
      const url = $(el).find('a').attr('href');
      const cover = $(el).find('img').attr('src');
      const stars = $(el).find('input[name="rating"]').attr('value');
      const commentCount = $(el)
        .find('.wt-align-items-center>span>span:last')
        .text()
        .replace('(', '')
        .replace(')', '')
        .trim();

      const starSeller =
        $(el).find('p.star-seller-badge-lavender-text-light').text() ===
        'Star Seller';

      const currencyValue = $(el).find('.lc-price span.currency-value').text();
      const currencySymbol = $(el)
        .find('.lc-price span.currency-symbol')
        .text();

      const originalCurrencyValue = $(el)
        .find('.search-collage-promotion-price span.currency-value')
        .text();
      const originalCurrencySymbol = $(el)
        .find('.search-collage-promotion-price span.currency-symbol')
        .text();

      const tags = [];

      $(el)
        .find('span.wt-badge')
        .each((i, el) => {
          tags.push($(el).text().trim());
        });

      // 解析店铺 ID
      const id = url.split('/listing/')[1].split('/')[0];

      // 解析商品名
      const name = url
        .split('/listing/')[1]
        .split('/')[1]
        .split('?')[0]
        .split('-')
        .join(' ');

      const obj = {
        title,
        url,
        // url: new URL(url).host,
        id,
        name,
        cover,
        stars: parseFloat(stars) || 0,
        commentCount: parseInt(commentCount) || 0,
        currencyValue: parseFloat(currencyValue) || 0,
        currencySymbol,
        starSeller,
        tags,
      };

      if (originalCurrencySymbol && originalCurrencyValue) {
        obj['originalCurrencyValue'] = parseFloat(originalCurrencyValue) || 0;
        obj['originalCurrencySymbol'] = originalCurrencySymbol;
      }

      list.push(obj);
    });

    await batchTask(
      async (obj) => {
        try {
          await this.getDetail(obj);
          return obj;
        } catch (error) {
          console.log(error);
          return 'error';
        }
      },
      list,
      64,
    );

    return list;
  }

  async fetchData(): Promise<ProductDocument[]> {
    const pageList = [];

    urlList.map((i) => {
      const page = 10; // 250
      new Array(page).fill('x').map((_, idx) => {
        pageList.push(i.split('?')[0] + '?ref=pagination&page=' + (idx + 1));
      });
    });

    const concurrent = 1;

    console.log('urlList:', urlList);

    try {
      const fn = async (page) => {
        try {
          const productList = await this.getList(page);
          console.log('productList:', productList);
          // await this.productsModel.insertMany(productList);
          return 'ok';
        } catch (error) {
          console.log(error);
          return 'error';
        }
      };

      const data = await batchTask(fn, pageList, concurrent);
      console.log('data');
      console.log(data);
    } catch (error) {
      console.log('final error');
      console.log(error);
    }

    console.log('final success');

    return [];
  }
}
