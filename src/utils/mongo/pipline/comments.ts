import { Types } from 'mongoose';
import { lookupUser } from './user';
import { lookupLikeCount, lookupLikeStatus } from './like';

export const lookupComments = (user) => {
  return [
    {
      $lookup: {
        from: 'comments',
        let: { commentTo: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$$commentTo', '$commentTo'] } } },

          {
            $sort: {
              createdAt: -1,
            },
          },

          // 聚合查询回复对象具体内容
          {
            $lookup: {
              from: 'comments',
              let: { replyTo: '$replyTo' },
              pipeline: [
                { $match: { $expr: { $eq: ['$$replyTo', '$_id'] } } },

                // 聚合查询回复对象用户信息
                ...lookupUser,
              ],
              as: 'replyTo',
            },
          },
          {
            $addFields: {
              replyTo: { $first: '$replyTo' },
            },
          },

          ...lookupLikeCount,

          ...lookupLikeStatus(user),

          // 聚合查询回复对象用户信息
          ...lookupUser,
        ],
        as: 'comments',
      },
    },
  ];
};

export const lookupCommentCount = [
  {
    $lookup: {
      from: 'comments',
      let: { object: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$$object', '$object'] } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },

        {
          $project: {
            _id: 0,
          },
        },
      ],
      as: 'commentCount',
    },
  },
  {
    $addFields: {
      commentCount: { $first: '$commentCount' },
    },
  },
  {
    $addFields: {
      commentCount: '$commentCount.count',
    },
  },
];

export const getCommentsPipline = (object: string, user: string): any[] => {
  return [
    {
      $match: {
        $and: [{ object: new Types.ObjectId(object) }, { commentTo: null }],
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },

    ...lookupComments(user),

    ...lookupUser,

    ...lookupLikeCount,

    ...lookupLikeStatus(user),
  ];
};
