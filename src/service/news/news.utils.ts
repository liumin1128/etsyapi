import { OriginNews } from '@/utils/idata/idata.service';
import { CreateNewsDto } from './dto/create.dto';

export function formatNews(data: OriginNews): CreateNewsDto {
  return {
    title: data.title,
    cover: data.cover,
    html: data.html,
    content: data.content,
    catLabel1: data.catLabel1,
    catLabel2: data.catLabel2,
    origin: {
      name: data.appName,
      code: data.appCode,
      url: data.url,
      data: data,
    },
  };
}
