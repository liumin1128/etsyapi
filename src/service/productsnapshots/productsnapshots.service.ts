import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { map, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import { QiniuService } from '@/utils/qiniu/qiniu.service';
import { CreateProductSnapshotDto } from './productSnapshots.dto';
import {
  ProductSnapshot,
  ProductSnapshotDocument,
} from './productSnapshots.schema';

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

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

async function sleepRandom() {
  return await sleep(Math.random() * 10000);
}

@Injectable()
export class ProductSnapshotsService {
  constructor(
    @InjectModel(ProductSnapshot.name)
    private readonly productSnapshotsModel: Model<ProductSnapshotDocument>,
    private readonly httpService: HttpService,
    private readonly qiniuService: QiniuService,
  ) {}
  async create(
    createProductSnapshotDto: CreateProductSnapshotDto,
  ): Promise<ProductSnapshotDocument> {
    const createdProductSnapshot = new this.productSnapshotsModel(
      createProductSnapshotDto,
    );
    await createdProductSnapshot.save();
    return createdProductSnapshot;
  }

  async findAll(): Promise<ProductSnapshotDocument[]> {
    return this.productSnapshotsModel.find();
  }

  async search(args): Promise<ProductSnapshotDocument[]> {
    const { limit = 10, skip = 0, search = '' } = args;

    const query: Record<string, unknown> = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    return this.productSnapshotsModel.find(query).skip(skip).limit(limit);
  }

  async findOne(
    user: string,
    object: string,
  ): Promise<ProductSnapshotDocument> {
    return this.productSnapshotsModel.findOne({ user, object });
  }

  async findById(_id: string): Promise<ProductSnapshotDocument> {
    return this.productSnapshotsModel.findById(_id);
  }

  async count(query): Promise<number> {
    return this.productSnapshotsModel.count(query);
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
}
