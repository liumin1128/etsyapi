import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IDataService } from './idata.service';
import { QiniuModule } from '@/utils/qiniu/qiniu.module';

@Module({
  imports: [HttpModule, QiniuModule],
  providers: [IDataService],
  exports: [IDataService],
})
export class IDataModule {}
