import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { QiniuModule } from '@/utils/qiniu/qiniu.module';

@Module({
  imports: [QiniuModule],
  providers: [CommonService],
  exports: [CommonService],
  controllers: [CommonController],
})
export class CommonModule {}
