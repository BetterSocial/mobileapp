import moment from 'moment';
import {act, renderHook} from '@testing-library/react-hooks';

import * as feedApi from '../../src/service/feeds';
import * as feedSrvice from '../../src/service/post';
import Store from '../../src/context/Store';
import useReplyComment from '../../src/components/ReplyComment/hooks/useReplyComment';

const mockPush = jest.fn();

jest.mock('@react-navigation/core', () => ({
  ...jest.requireActual('@react-navigation/core'),
  useNavigation: () => ({goBack: jest.fn(), push: mockPush}),
  useRoute: () => ({
    params: {}
  })
}));

const updateFeedData = {
  actor: {
    created_at: '2022-06-10T13:11:47.095310Z',
    data: {
      human_id: 'HQEGNQCHA8J1OIX4G2CP',
      profile_pic_url:
        'https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg',
      username: 'Fajarism'
    },
    id: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
    updated_at: '2022-08-16T03:34:45.197566Z'
  },
  anonimity: false,
  count_downvote: 0,
  count_upvote: 0,
  duration_feed: 'never',
  expired_at: null,
  final_score: 0,
  foreign_id: '',
  id: '5426276d-8c9e-11ed-a813-0e0d34fb440f',
  images_url: [],
  latest_reactions: {
    comment: [
      {
        activity_id: '5426276d-8c9e-11ed-a813-0e0d34fb440f',
        children_counts: {},
        created_at: '2023-01-09T05:05:24.112120Z',
        data: {
          count_downvote: 0,
          count_upvote: 0,
          isNotSeen: true,
          text: 'hmmm'
        },
        id: '0e9d7cde-cfe2-4ad9-ac1b-53943ac4ea67',
        kind: 'comment',
        latest_children: {},
        parent: '',
        target_feeds: ['notification:f19ce509-e8ae-405f-91cf-ed19ce1ed96e'],
        updated_at: '2023-01-09T05:05:24.112120Z',
        user: {
          created_at: '2022-06-10T13:11:47.095310Z',
          data: {
            human_id: 'HQEGNQCHA8J1OIX4G2CP',
            profile_pic_url:
              'https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg',
            username: 'Fajarism'
          },
          id: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
          updated_at: '2022-08-16T03:34:45.197566Z'
        },
        user_id: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e'
      }
    ]
  },
  location: 'Everywhere',
  message: 'new #kispray again',
  object:
    '{"feed_group":"main_feed","message":"new #kispray again","profile_pic_path":"https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg","real_name":null,"topics":["kispray"],"username":"Fajarism","verb":"tweet"}',
  origin: null
};

const itemProp = {
  activity_id: '5426276d-8c9e-11ed-a813-0e0d34fb440f',
  data: {
    count_downvote: 0,
    count_upvote: 1,
    targetFeeds: [
      'notification:c6c91b04-795c-404e-b012-ea28813a2006',
      'notification:f19ce509-e8ae-405f-91cf-ed19ce1ed96e'
    ],
    text: 'halo halo'
  },
  duration: '13.29ms',
  id: 'cc86999d-b7cd-4bec-accf-d7e57e301e90',
  kind: 'comment',
  latest_children: {
    comment: [
      {
        activity_id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
        updated_at: '2022-09-22T00:20:23.011138Z',
        children_counts: {},
        created_at: '2023-01-12T11:00:06.912432Z',
        data: {
          count_downvote: 1,
          count_upvote: 0,
          targetFeeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
          text: 'favorite'
        },
        id: 'd0da5ec6-a964-4876-bfc4-0363f8ffc6e0',
        kind: 'comment',
        parent: 'cc86999d-b7cd-4bec-accf-d7e57e301e90',
        user: {
          created_at: '2022-06-10T13:11:53.385703Z',
          data: {
            human_id: 'I4K3M10FGR78EWQQDNQ2',
            profile_pic_url:
              'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg',
            username: 'Agita'
          },
          id: 'c6c91b04-795c-404e-b012-ea28813a2006',
          updated_at: '2022-07-29T12:54:03.879150Z'
        },
        user_id: 'c6c91b04-795c-404e-b012-ea28813a2006'
      },
      {
        activity_id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
        updated_at: '2022-09-21T00:20:23.011138Z',
        parent: 'cc86999d-b7cd-4bec-accf-d7e57e301e90',
        children_counts: {},
        created_at: '2023-01-12T11:00:06.912432Z',
        data: {
          count_downvote: 1,
          count_upvote: 0,
          targetFeeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
          text: 'favorite baru'
        },
        id: 'd0da5ec6-a964-4876-bfc4-0363f8ffc6e0',
        kind: 'comment',
        user: {
          created_at: '2022-06-10T13:11:53.385703Z',
          data: {
            human_id: 'I4K3M10FGR78EWQQDNQ2',
            profile_pic_url:
              'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg',
            username: 'Agita'
          },
          id: 'c6c91b04-795c-404e-b012-ea28813a2006',
          updated_at: '2022-07-29T12:54:03.879150Z'
        },
        user_id: 'c6c91b04-795c-404e-b012-ea28813a2006'
      }
    ]
  },
  children_counts: {
    comment: 2
  },
  user: {
    created_at: '2022-06-10T13:11:47.095310Z',
    data: {
      human_id: 'HQEGNQCHA8J1OIX4G2CP',
      profile_pic_url:
        'https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg',
      username: 'Fajarism'
    },
    id: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
    updated_at: '2022-08-16T03:34:45.197566Z'
  },
  user_id: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e'
};

const comments = [
  {
    activity_id: '029ec53e-281d-11ed-b3e4-0a6648bb8f8d',
    data: {
      count_downvote: 0,
      count_upvote: 0,
      text: 'gulai'
    },
    id: '98d99e1e-182a-42b0-b3f8-4f3d27403f51'
    // latest_children: itemProp.latest_children
  },
  {
    activity_id: '029ec53e-281d-11ed-b3e4-0a6648bb8f8d',
    data: {
      count_downvote: 0,
      count_upvote: 0,
      text: 'gulai'
    },
    id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739'
    // latest_children: itemProp.latest_children
  }
];

describe('hooks function should run correctly', () => {
  const itemReply = {
    activity_id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
    updated_at: '2022-09-22T00:20:23.011138Z',
    children_counts: {},
    created_at: '2023-01-12T11:00:06.912432Z',
    data: {
      count_downvote: 1,
      count_upvote: 0,
      targetFeeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
      text: 'favorite'
    },
    id: 'd0da5ec6-a964-4876-bfc4-0363f8ffc6e0',
    kind: 'comment',
    parent: 'cc86999d-b7cd-4bec-accf-d7e57e301e90',
    user: {
      created_at: '2022-06-10T13:11:53.385703Z',
      data: {
        human_id: 'I4K3M10FGR78EWQQDNQ2',
        profile_pic_url:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg',
        username: 'Agita'
      },
      id: 'c6c91b04-795c-404e-b012-ea28813a2006',
      updated_at: '2022-07-29T12:54:03.879150Z'
    },
    user_id: 'c6c91b04-795c-404e-b012-ea28813a2006'
  };

  it('handle temporary comment should run correctly', () => {
    const {result} = renderHook(() => useReplyComment({itemProp}), {wrapper: Store});
    act(() => {
      result.current.setCommentHook('test');
    });
    expect(result.current.temporaryText).toStrictEqual('test');
  });

  it('isLastInParent should run correctly', () => {
    const {result} = renderHook(() => useReplyComment({itemProp}), {wrapper: Store});
    expect(result.current.isLastInParentHook(1, itemProp)).toStrictEqual(true);
    expect(result.current.isLastInParentHook(0, itemProp)).toStrictEqual(false);
  });

  it('updatevote reply should update children vote', async () => {
    const {result} = renderHook(() => useReplyComment({itemProp}), {wrapper: Store});
    const data = {
      data: {
        count_downvote: 0,
        count_upvote: 1,
        text: 'gulai'
      }
    };
    await result.current.setNewCommentList(comments);
    expect(
      result.current.findCommentAndUpdateHook('51d6e8b4-6ba2-4d5b-a843-a3adb58f9739', data)
    ).toStrictEqual([
      {
        activity_id: '029ec53e-281d-11ed-b3e4-0a6648bb8f8d',
        data: {
          count_downvote: 0,
          count_upvote: 0,
          text: 'gulai'
        },
        id: '98d99e1e-182a-42b0-b3f8-4f3d27403f51'
      },
      {
        activity_id: '029ec53e-281d-11ed-b3e4-0a6648bb8f8d',
        data: {
          count_downvote: 0,
          count_upvote: 1,
          text: 'gulai'
        },
        id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739'
      }
    ]);
  });

  it('vote reply children shuld update parent', () => {
    const data = {
      code: 200,
      data: {
        activity_id: '029ec53e-281d-11ed-b3e4-0a6648bb8f8d',
        data: {
          count_downvote: 0,
          count_upvote: 2,
          text: 'gulai'
        },
        id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739'
      }
    };
    const myDataVote = {
      activity_id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739',
      status: 'downvote',
      text: 'Gandos'
    };
    const newComments = {
      activity_id: '029ec53e-281d-11ed-b3e4-0a6648bb8f8d',
      id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9710',
      data: {
        count_downvote: 0,
        count_upvote: 0,
        text: 'gulai'
      },
      latest_children: {
        comment: [
          {
            activity_id: '029ec53e-281d-11ed-b3e4-0a6648bb8f8d',
            data: {
              count_downvote: 0,
              count_upvote: 0,
              text: 'gulai'
            },
            id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739'
          }
        ]
      }
    };
    const {result} = renderHook(() => useReplyComment({itemProp}), {wrapper: Store});
    expect(result.current.updateVoteParentPostHook(data, myDataVote, newComments)).toStrictEqual([
      {
        activity_id: '029ec53e-281d-11ed-b3e4-0a6648bb8f8d',
        data: {count_downvote: 0, count_upvote: 2, text: 'gulai'},
        id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739'
      }
    ]);
  });

  it('updateVoteLatestChildrenParentHook should run correctly', () => {
    const {result} = renderHook(() => useReplyComment({itemProp}), {wrapper: Store});
    const response = {
      data: {
        count_downvote: 0,
        count_upvote: 1,
        text: 'Baksp'
      }
    };
    const dataVote = {
      parent: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739',
      id: '6fbdf69c-689d-4641-8130-bae29e916a90'
    };

    const comment = {
      latest_children: {
        comment: [
          {
            id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739',
            latest_children: {
              comment: [
                {
                  id: '6fbdf69c-689d-4641-8130-bae29e916a90',
                  data: {
                    count_downvote: 0,
                    count_upvote: 1,
                    text: 'Baksp'
                  }
                }
              ]
            }
          }
        ]
      }
    };
    expect(
      result.current.updateVoteLatestChildrenParentHook(response, dataVote, comment)
    ).toStrictEqual([
      {
        id: '51d6e8b4-6ba2-4d5b-a843-a3adb58f9739',
        latest_children: {
          comment: [
            {
              data: {
                count_downvote: 0,
                count_upvote: 1,
                text: 'Baksp'
              },
              id: '6fbdf69c-689d-4641-8130-bae29e916a90'
            }
          ]
        }
      }
    ]);
  });

  it('handleFirstTextCommentHook should run correctly', async () => {
    const {result} = renderHook(() => useReplyComment({itemProp}), {wrapper: Store});
    await result.current.setTemporaryText('test agite');
    await result.current.handleFirstTextCommentHook();
    expect(result.current.textComment).toEqual('test agite');
  });

  it('updateVoteParentPostHook should run correctly', () => {
    const data = {
      data: {
        data: {
          text: 'bola bola'
        }
      }
    };

    const dataVote = {
      activity_id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11'
    };

    const dataVote2 = {
      activity_id: '123'
    };

    const comment = {
      latest_children: {
        comment: [{id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11', data: {text: 'agita'}}]
      }
    };

    const {result} = renderHook(() => useReplyComment({itemProp}), {wrapper: Store});
    expect(result.current.updateVoteParentPostHook(data, dataVote, comment)).toEqual([
      {id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11', data: {text: 'bola bola'}}
    ]);
    expect(result.current.updateVoteParentPostHook(data, dataVote2, comment)).toEqual([
      {id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11', data: {text: 'agita'}}
    ]);
  });

  it('updateVoteLatestChildrenParentHook should run correctly', () => {
    const comment = {
      latest_children: {
        comment: [
          {
            id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
            latest_children: {
              comment: [{id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11', data: {text: 'agita'}}]
            }
          }
        ]
      }
    };
    const dataVote = {
      activity_id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
      parent: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
      id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11'
    };
    const dataVote2 = {
      activity_id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
      parent: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
      id: '123'
    };
    const dataVote3 = {
      activity_id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
      parent: '123',
      id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11'
    };
    const response = {
      data: {
        text: 'madurasa'
      }
    };
    const comment2 = null;
    const {result} = renderHook(() => useReplyComment({itemProp}), {wrapper: Store});
    expect(result.current.updateVoteLatestChildrenParentHook(response, dataVote, comment)).toEqual([
      {
        id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
        latest_children: {
          comment: [
            {
              data: {
                text: 'madurasa'
              },
              id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11'
            }
          ]
        }
      }
    ]);
    expect(result.current.updateVoteLatestChildrenParentHook(response, dataVote2, comment)).toEqual(
      [
        {
          id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
          latest_children: {
            comment: [
              {
                data: {
                  text: 'agita'
                },
                id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11'
              }
            ]
          }
        }
      ]
    );
    expect(result.current.updateVoteLatestChildrenParentHook(response, dataVote3, comment)).toEqual(
      [
        {
          id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11',
          latest_children: {
            comment: [
              {
                data: {
                  text: 'agita'
                },
                id: 'bea7567e-38f1-11ed-8bdd-0e4b8d0e7a11'
              }
            ]
          }
        }
      ]
    );

    expect(
      result.current.updateVoteLatestChildrenParentHook(response, dataVote3, comment2)
    ).toEqual([]);
  });

  it('updateReplyPostHook should run correctly', async () => {
    const oldComment = [{text: 'agita'}];
    const commentId = '123';
    const commenId2 = '1234';
    const newComment = [{text: 'superman'}];
    const itemParentProps = {
      latest_children: {
        comment: [
          {
            id: '123',
            latest_children: {comment: oldComment},
            children_counts: {comment: oldComment.length}
          }
        ]
      }
    };
    const {result} = renderHook(() => useReplyComment({itemProp}), {wrapper: Store});
    expect(result.current.updateReplyPostHook(newComment, itemParentProps, commentId)).toEqual({
      replaceComment: {
        latest_children: {
          comment: [
            {
              children_counts: {comment: 1},
              id: '123',
              latest_children: {comment: [{text: 'superman'}]}
            }
          ]
        }
      },
      updateMyComment: [
        {children_counts: {comment: 1}, id: '123', latest_children: {comment: [{text: 'superman'}]}}
      ]
    });
    expect(result.current.updateReplyPostHook(newComment, itemParentProps, commenId2)).toEqual({
      replaceComment: {
        latest_children: {
          comment: [
            {
              children_counts: {comment: 1},
              id: '123',
              latest_children: {comment: [{text: 'agita'}]}
            }
          ]
        }
      },
      updateMyComment: [
        {children_counts: {comment: 1}, id: '123', latest_children: {comment: [{text: 'agita'}]}}
      ]
    });
    await result.current.updateReplyPost(newComment, itemParentProps, commentId);
    expect(result.current.item).toEqual({
      latest_children: {
        comment: [
          {
            children_counts: {comment: 1},
            id: '123',
            latest_children: {comment: [{text: 'superman'}]}
          }
        ]
      }
    });
    await result.current.updateReplyPost(newComment, itemParentProps, commenId2);
    expect(result.current.item).toEqual({
      latest_children: {
        comment: [
          {children_counts: {comment: 1}, id: '123', latest_children: {comment: [{text: 'agita'}]}}
        ]
      }
    });
  });

  it('showChildrenCommentView should open reply page', async () => {
    const updateParent = jest.fn();
    const {result} = renderHook(() => useReplyComment({itemProp, updateParent}), {wrapper: Store});
    await result.current.showChildrenCommentView(itemReply);
    expect(mockPush).toHaveBeenCalled();
  });

  it('updateFeed should run correctly', async () => {
    const updateParent = jest.fn();
    const spyFeedService = jest.spyOn(feedSrvice, 'getFeedDetail');
    const {result} = renderHook(() => useReplyComment({itemProp, updateParent}), {wrapper: Store});
    await result.current.updateFeed();
    expect(spyFeedService).toHaveBeenCalled();
  });

  it('handleUpdateFeed should update correctly', async () => {
    const updateParent = jest.fn();
    const {result} = renderHook(() => useReplyComment({itemProp, updateParent}), {wrapper: Store});
    await result.current.handleUpdateFeed(updateFeedData);
    expect(updateParent).toHaveBeenCalled();
  });

  it('createComment should run as expected', async () => {
    const updateParent = jest.fn();
    const {result} = renderHook(() => useReplyComment({itemProp, updateParent}), {wrapper: Store});
    await result.current.createComment();
    expect(result.current.temporaryText).toEqual('');
    expect(result.current.newCommentList[0].data.text).toEqual('');
  });

  it('getComment should run as expected', async () => {
    const updateParent = jest.fn();
    const spy = jest
      .spyOn(feedApi, 'getCommentChild')
      .mockImplementation(() => ({data: itemProp.latest_children}));
    const {result} = renderHook(() => useReplyComment({itemProp, updateParent}), {wrapper: Store});
    await result.current.getThisComment(true);
    expect(result.current.newCommentList).toEqual(itemProp.latest_children);
    expect(spy).toHaveBeenCalled();
    await result.current.getThisComment(false);
    expect(result.current.newCommentList).toEqual(itemProp.latest_children);
  });
});
