// import { Types } from 'mongoose';

export const lookupUser = [
  // 聚合查询用户信息
  {
    $lookup: {
      from: 'users',
      let: { user: '$user' },
      pipeline: [
        { $match: { $expr: { $eq: ['$$user', '$_id'] } } },
        {
          $project: {
            _id: 1,
            nickname: 1,
            avatarUrl: 1,
          },
        },
      ],
      as: 'user',
    },
  },
  {
    $addFields: {
      user: { $first: '$user' },
    },
  },
];

// export const lookupLikeStatus = (user) => {
//   return [
//     {
//       $match: {
//         _id: new Types.ObjectId(user),
//       },
//     },

//     {
//       $lookup: {
//         from: 'likes',
//         let: {
//           currenUser: new Types.ObjectId(user),
//           object: '$_id',
//         },
//         pipeline: [
//           {
//             $match: {
//               $and: [
//                 { $expr: { $eq: ['$$object', '$object'] } },
//                 { $expr: { $eq: ['$$currenUser', '$user'] } },
//               ],
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               count: { $sum: 1 },
//             },
//           },
//           {
//             $project: {
//               _id: 0,
//             },
//           },
//         ],
//         as: 'likeStatus',
//       },
//     },
//     {
//       $addFields: {
//         likeStatus: { $first: '$likeStatus' },
//       },
//     },
//     {
//       $addFields: {
//         likeStatus: {
//           $cond: {
//             if: {
//               $gt: ['$likeStatus.count', 0],
//             },
//             then: true,
//             else: false,
//           },
//         },
//       },
//     },
//   ];
// };
