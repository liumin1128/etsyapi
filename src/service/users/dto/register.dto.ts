import { IsNotEmpty } from 'class-validator';

export default class RegisterUserDto {
  @IsNotEmpty()
  readonly password: string;
  readonly username: string;
  readonly nickname?: string;
  readonly phoneNumber?: string;
  readonly avatarUrl?: string;
  readonly sex?: number;
  readonly sign?: number;
  readonly birthday?: Date;
  readonly position?: number;
  readonly company?: number;
}
