import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicsService } from './dynamics.service';
import { DynamicsResolver } from './dynamics.resolver';
import { Dynamic, DynamicSchema } from './dynamics.schema';
import { DynamicsController } from './dynamics.controller';
import { AuthModule } from '@/service/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Dynamic.name, schema: DynamicSchema }]),
  ],
  providers: [DynamicsService, DynamicsResolver],
  exports: [DynamicsService],
  controllers: [DynamicsController],
})
export class DynamicsModule {}
