// import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/service/auth/auth.guard';
import { ProductSnapshotDocument as ProductSnapshot } from './productSnapshots.schema';
import { ProductSnapshotsService } from './productSnapshots.service';
import { CreateProductSnapshotDto } from './productSnapshots.dto';

@Resolver('ProductSnapshots')
export class ProductSnapshotsResolver {
  constructor(
    private readonly productSnapshotsService: ProductSnapshotsService,
  ) {}

  @Query('findProductSnapshots')
  async findProductSnapshots(
    @Args('limit') limit?: number,
    @Args('skip') skip?: number,
    @Args('search') search?: string,
  ): Promise<ProductSnapshot[]> {
    return this.productSnapshotsService.search({ limit, skip, search });
  }

  @Query('findProductSnapshot')
  async findProductSnapshot(
    @Args('_id') _id: string,
  ): Promise<ProductSnapshot> {
    const data = await this.productSnapshotsService.findById(_id);
    return data;
  }

  @Query('findProductSnapshotsCount')
  async findProductSnapshotsCount(
    @Args('search') search?: string,
  ): Promise<number> {
    const query: Record<string, unknown> = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    return await this.productSnapshotsService.count(query);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation('createProductSnapshot')
  async createProductSnapshot(
    @Args('input') input: CreateProductSnapshotDto,
  ): Promise<ProductSnapshot | null> {
    const createdProductSnapshot = await this.productSnapshotsService.create({
      ...input,
    });

    return createdProductSnapshot;
  }
}
