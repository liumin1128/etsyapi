import { Controller, Get } from '@nestjs/common';
import { CommonService } from './common.service';
import { QiniuService } from '@/utils/qiniu/qiniu.service';

@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly qiniuService: QiniuService,
  ) {}

  @Get('qiniu/token')
  async getCommonFromIData(): Promise<{ token: string; expires: number }> {
    return this.qiniuService.getQiniuToken();
  }
}
