import { Types } from 'mongoose';
import { lookupUser } from './user';
import { lookupLikeCount, lookupLikeStatus } from './like';
import { lookupCommentCount } from './comments';

export const getDynamicsPipline = (user: string): any[] => {
  return [
    {
      $sort: {
        createdAt: -1,
      },
    },

    ...lookupUser,

    ...lookupLikeCount,

    ...lookupCommentCount,

    ...lookupLikeStatus(user),
  ];
};

export const getDynamicPipline = (user: string, _id: string): any[] => {
  return [
    { $match: { $expr: { $eq: ['$_id', new Types.ObjectId(_id)] } } },

    ...lookupUser,

    ...lookupLikeCount,

    ...lookupCommentCount,

    ...lookupLikeStatus(user),
  ];
};
