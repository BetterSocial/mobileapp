var now = new Date().toISOString();
export const temporaryComment = (comment) => ({
  created_at: now,
  updated_at: '2021-09-27T07:14:53.680589Z',
  id: '788546ed-6400-40a8-9ca5-72b4ab23f26e',
  user_id: '36b2bcba-8a48-4c85-8664-d78459ed4e5a',
  user: {
    created_at: '2021-05-21T14:34:25.990387Z',
    updated_at: '2021-08-13T03:50:41.371991Z',
    id: '36b2bcba-8a48-4c85-8664-d78459ed4e5a',
    data: {
      human_id: 'dummyid',
      profile_pic_url: '',
      username: 'dummy user',
    },
  },
  kind: 'comment',
  activity_id: '8221d456-1f39-11ec-bc50-1254437355c5',
  data: {
    count_downvote: 0,
    count_upvote: 0,
    text: comment,
  },
  parent: '2cba9577-7785-4438-b462-9e95d5b41ca9',
  latest_children: {
    comment: [],
  },
  children_counts: {
    comment: 1,
  },
});
