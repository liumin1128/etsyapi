export default class UpdateUserInfoDto {
  readonly nickname?: string;
  readonly avatarUrl?: string;
  readonly sex?: number;
  readonly sign?: string;
  readonly birthday?: Date;
  readonly position?: string;
  readonly company?: string;
}
