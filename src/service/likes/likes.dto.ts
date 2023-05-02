export class CreateLikeDto {
  readonly user: string;
  readonly object: string;
  readonly objectModel: 'Dynamic' | 'News' | 'Comment' | 'RetroMessage';
}
