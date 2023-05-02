import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { map, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import { batchTask } from '@/utils/promise';
import { QiniuService } from '@/utils/qiniu/qiniu.service';
import { CreateProductDto } from './products.dto';
import { Product, ProductDocument } from './products.schema';
import { urlList } from './products.utils';

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

async function sleepRandom() {
  return await sleep(Math.random() * 10000);
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productsModel: Model<ProductDocument>,
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

  async findOne(user: string, object: string): Promise<ProductDocument> {
    return this.productsModel.findOne({ user, object });
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

  async getList(url: string): Promise<any> {
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

    const fn = async (obj) => {
      // await sleepRandom();
      try {
        const coverCdn = await this.qiniuService.fetchToQiniu(obj.cover, {
          path: 'product',
        });

        obj.cover = coverCdn;

        return obj;
      } catch (error) {
        console.log(error);

        return 'error';
      }
    };

    // cdn处理所有图片
    const data = await batchTask(fn, list, 100);

    return data;
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
        // console.log('page: ', page);
        const data = await this.getList(page);
        // console.log('data:', data);
        await this.productsModel.insertMany(data);
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
