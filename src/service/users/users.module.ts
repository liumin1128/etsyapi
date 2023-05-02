import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/users.schema';
import { UsersResolver } from './users.resolver';
import { UsersController } from './users.controller';
import { AuthModule } from '@/service/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UserModule {}
