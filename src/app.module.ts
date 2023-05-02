import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import serviceModules from '@/service/modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get('MONGODB_URI');
        console.log('MONGODB_URI: ', uri);
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      typePaths: ['./src/**/*.graphql'],
      definitions: {
        path: './src/graphql/graphql.schema.ts',
        outputAs: 'class',
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      cache: 'bounded',
      persistedQueries: false,
      allowBatchedHttpRequests: true,
    }),

    ...serviceModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
