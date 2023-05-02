export class CreateUserToSeatDto {
  readonly user: string;
  readonly seat: string;
  readonly date: number;
}

export class DeleteUserToSeatDto {
  readonly user: string;
  readonly seat: string;
  readonly date: number;
}
