interface Origin {
  name: string;
  code: string;
  url: string;
  data: unknown;
}

export class CreateNewsDto {
  readonly title: string;
  readonly cover?: string;
  readonly json?: string;
  readonly html?: string;
  readonly content?: string;
  readonly catLabel1?: string;
  readonly catLabel2?: string;
  readonly showHtml?: boolean;
  readonly tags?: string[];
  readonly photos?: string[];
  readonly origin?: Origin;
}
