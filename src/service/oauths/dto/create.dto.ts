import { IsNotEmpty } from 'class-validator';
import { UserDocument } from '@/service/users/schemas/users.schema';

export class CreateOAuthDto {
  @IsNotEmpty()
  readonly uuid: string;

  @IsNotEmpty()
  readonly platform: string;

  @IsNotEmpty()
  readonly data: any;

  @IsNotEmpty()
  readonly user: UserDocument;
}

export class FindOneOAuthDto {
  @IsNotEmpty()
  readonly uuid: string;

  @IsNotEmpty()
  readonly platform: string;
}

export class UpdateUserOAuthDto {
  @IsNotEmpty()
  readonly user: any;
}
