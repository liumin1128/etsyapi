import { Types } from 'mongoose';

export const lookupLikeCount = [
  // 聚合查询点赞信息
  {
    $lookup: {
      from: 'likes',
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
      as: 'likeCount',
    },
  },
  {
    $addFields: {
      likeCount: { $first: '$likeCount' },
    },
  },
  {
    $addFields: {
      likeCount: '$likeCount.count',
    },
  },
];

export const lookupLikeStatus = (user) => {
  return [
    {
      $lookup: {
        from: 'likes',
        let: {
          currenUser: new Types.ObjectId(user),
          object: '$_id',
        },
        pipeline: [
          {
            $match: {
              $and: [
                { $expr: { $eq: ['$$object', '$object'] } },
                { $expr: { $eq: ['$$currenUser', '$user'] } },
              ],
            },
          },
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
        as: 'likeStatus',
      },
    },
    {
      $addFields: {
        likeStatus: { $first: '$likeStatus' },
      },
    },
    {
      $addFields: {
        likeStatus: {
          $cond: {
            if: {
              $gt: ['$likeStatus.count', 0],
            },
            then: true,
            else: false,
          },
        },
      },
    },
  ];
};
