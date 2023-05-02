import { IsNotEmpty } from 'class-validator';

export default class LoginUserDto {
  @IsNotEmpty()
  readonly password: string;
  readonly nickname?: string;
  readonly phoneNumber?: string;
}
