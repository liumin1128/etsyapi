export class CreateRetroMessageDto {
  readonly user: string;
  readonly retro: string;
  readonly content: string;
  readonly type: string;
  readonly anonymous?: boolean;
  readonly pictures?: string[];
}

export class UpdateRetroMessageDto {
  readonly user?: string;
  readonly content?: string;
  readonly status?: string;
  readonly type?: string;
  readonly anonymous?: boolean;
  readonly pictures?: string[];
}
