import { Module } from '@nestjs/common';
import { DateScalar } from '@/graphql/scalars/date.scalar';
// import { LoggingPlugin } from '@/graphql/plugins/logging.plugin';

@Module({
  providers: [
    DateScalar,
    // LoggingPlugin
  ],
})
export class GraphqlModule {}
