import * as mongoose from 'mongoose';

export class CreateCommentDto {
  readonly user: string;
  readonly content: string;
  readonly object: string;
  readonly objectModel: 'Dynamic' | 'News' | 'Comment' | 'RetroMessage';
  readonly commentTo?: string;
  readonly replyTo?: string;
}

export class ReplyCommentDto {
  readonly user: string;
  readonly content: string;
  readonly to: string;
}
