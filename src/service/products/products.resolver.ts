// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/service/auth/auth.guard';
import { ProductDocument as Product } from './products.schema';
import { ProductsService } from './products.service';
import { CreateProductDto } from './products.dto';

@Resolver('Products')
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query('findProducts')
  async findProducts(
    @Args('limit') limit?: number,
    @Args('skip') skip?: number,
    @Args('search') search?: string,
  ): Promise<Product[]> {
    const data = await this.productsService.search({ limit, skip, search });
    return data;
  }

  @Query('findProduct')
  async findProduct(@Args('_id') _id: string): Promise<Product> {
    const data = await this.productsService.findById(_id);
    return data;
  }

  @Query('findProductById')
  async findProductById(@Args('id') id: string): Promise<Product> {
    const data = await this.productsService.findOne({ id });
    if (data && data.length === 1) {
      return data[0];
    }
    return null;
  }

  @Query('findProductsCount')
  async findProductsCount(@Args('search') search?: string): Promise<number> {
    const query: Record<string, unknown> = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    return await this.productsService.count(query);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createProduct')
  async createProduct(
    @Args('input') input: CreateProductDto,
  ): Promise<Product | null> {
    const createdProduct = await this.productsService.create({
      ...input,
    });

    return createdProduct;
  }
}
