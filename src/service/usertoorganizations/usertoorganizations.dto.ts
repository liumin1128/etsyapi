export class CreateUserToOrganizationDto {
  readonly user: string;
  readonly organization: string;
  readonly isCurrent?: boolean;
}
