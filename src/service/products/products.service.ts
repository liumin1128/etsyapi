import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';
import { map, lastValueFrom } from 'rxjs';
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
  return await sleep(Math.random() * 10000);
}

@Injectable()
export class ProductsService {
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

  async search(args): Promise<ProductDocument[]> {
    const { limit = 10, skip = 0, search = '' } = args;

    const query: Record<string, unknown> = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    return this.productsModel.find(query).skip(skip).limit(limit);
  }

  async findOne(query): Promise<ProductDocument> {
    return this.productsModel.findOne(query);
  }

  async findById(_id: string): Promise<ProductDocument> {
    return this.productsModel.findById(_id);
  }

  async count(query): Promise<number> {
    return this.productsModel.count(query);
  }

  async fetch(url: string): Promise<any> {
    return lastValueFrom<any>(
      this.httpService
        .get(url, {
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

    console.log(
      $('button[data-wt-popover-trigger] p.wt-text-caption-title')
        .text()
        .trim(),
    );

    console.log('title: ', title);
    console.log('stars: ', stars);
    console.log('pictures: ', pictures);
    console.log('sales: ', sales);
    console.log('price: ', price);
    console.log('reviews: ', reviews);
    console.log('favorites: ', favorites);
    console.log('kinds: ', kinds);
    console.log('tags: ', tags);
    console.log('description: ', description);
    console.log('starSeller: ', starSeller);
    console.log('etsyPick: ', etsyPick);
    console.log('bestSeller: ', bestSeller);
    console.log('freeShipping: ', freeShipping);

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
      // console.log('getDetail: ', item);
      const snapshot = await this.getProductSnapshot(item?.url);
      // console.log('snapshot: ', snapshot);
      const obj = { ...item, ...snapshot };
      console.log('obj: ', obj);

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
      console.error('getDetail error: ', error);
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
      10,
    );

    return list;
  }

  async fetchData(): Promise<ProductDocument[]> {
    const pageList = [];

    urlList.map((i) => {
      const page = 1; // 250
      new Array(page).fill('x').map((_, idx) => {
        pageList.push(i.split('?')[0] + '?ref=pagination&page=' + (idx + 1));
      });
    });

    const concurrent = 20;

    const fn = async (page) => {
      await sleepRandom();
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

    return [];
  }
}
