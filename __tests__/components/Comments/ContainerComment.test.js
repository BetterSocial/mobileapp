import React from 'react';
import {View} from 'react-native';
import {cleanup, fireEvent, render} from '@testing-library/react-native';
import {renderHook} from '@testing-library/react-hooks';

import useContainerComment from '../../../src/components/Comments/hooks/useContainerComment';
import useReplyComment from '../../../src/components/Comments/hooks/useReplyComment';
import ContainerComment, {
  ContainerReply,
  ReplyComment,
  isEqual
} from '../../../src/components/Comments/ContainerComment';
import {Context} from '../../../src/context/Store';
import {feedsState} from '../../../src/context/reducers/FeedReducer';

jest.mock('react-native/Libraries/Pressability/usePressability');
jest.mock('react-native/Libraries/Components/Pressable/Pressable');

jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({children}) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({children}) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset)
  };
});

describe('ContainerComment should run correctly', () => {
  const comments = [
    {
      activity_id: 'eeb07336-8fe8-11ed-b458-0e0d34fb440f',
      children_counts: {},
      data: {
        count_downvote: 0,
        count_upvote: 0,
        isNotSeen: true,
        text: 'from postman 1'
      },
      id: 'dd8e0ece-a27b-4356-9a37-0427afa86258',
      kind: 'comment',
      latest_children: {},
      parent: '',
      target_feeds: [
        'notification:f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
        'notification:c6c91b04-795c-404e-b012-ea28813a2006'
      ],
      updated_at: '2023-01-09T06:57:52.892334Z',
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
  ];

  const comments2 = [
    {
      activity_id: 'eeb07336-8fe8-11ed-b458-0e0d34fb440f',
      children_counts: {
        comment: 1
      },
      data: {
        count_downvote: 0,
        count_upvote: 0,
        isNotSeen: true,
        text: 'from postman 1'
      },
      id: 'dd8e0ece-a27b-4356-9a37-0427afa86258',
      kind: 'comment',
      latest_children: {
        comment: [
          {
            activity_id: 'cdfa2a76-8cb5-11ed-ab69-0e4b8d0e7a11',
            children_counts: {},
            created_at: '2023-01-09T01:37:20.225354Z',
            data: {
              count_downvote: 1,
              count_upvote: 0,
              targetFeeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
              text: 'Wow'
            },
            id: '8729cdfc-ae7b-458e-a999-af967124c171',
            kind: 'comment',
            latest_children: {},
            parent: 'd9c0baea-adf7-4624-ae04-e257bd80c101',
            target_feeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
            updated_at: '2023-01-09T01:38:14.677925Z',
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
      parent: '',
      target_feeds: [
        'notification:f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
        'notification:c6c91b04-795c-404e-b012-ea28813a2006'
      ],
      updated_at: '2023-01-09T06:57:52.892334Z',
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
  ];

  afterEach(cleanup);
  it('Should match snapshot', () => {
    const refreshComment = jest.fn();
    const refreshChildComment = jest.fn();
    const navigateToReplyView = jest.fn();
    const findCommentAndUpdate = jest.fn();

    const contextValue = {
      feeds: [feedsState, () => jest.fn()],
      profile: [{}, jest.fn()]
    };

    const {toJSON} = render(
      <Context.Provider value={contextValue}>
        <ContainerComment
          refreshChildComment={refreshChildComment}
          navigateToReplyView={navigateToReplyView}
          findCommentAndUpdate={findCommentAndUpdate}
          refreshComment={refreshComment}
          comments={comments}
          indexFeed={undefined}
          isLoading={false}
        />
      </Context.Provider>
    );
    expect(toJSON).toMatchSnapshot();
  });

  it('ContainerReply should match snapshot', () => {
    const {toJSON, getAllByTestId} = render(
      <ContainerReply>
        <View testID="children" />{' '}
      </ContainerReply>
    );
    expect(toJSON).toMatchSnapshot();
    expect(getAllByTestId('children')).toHaveLength(1);
  });

  it('isLast level should correct', () => {
    const refreshComment = jest.fn();
    const refreshChildComment = jest.fn();
    const navigateToReplyView = jest.fn();
    const findCommentAndUpdate = jest.fn();

    const contextValue = {
      feeds: [feedsState, () => jest.fn()],
      profile: [{}, jest.fn()]
    };

    const {getAllByTestId} = render(
      <Context.Provider value={contextValue}>
        <ContainerComment
          refreshChildComment={refreshChildComment}
          navigateToReplyView={navigateToReplyView}
          findCommentAndUpdate={findCommentAndUpdate}
          refreshComment={refreshComment}
          comments={comments}
          indexFeed={undefined}
          isLoading={false}
        />
      </Context.Provider>
    );
    expect(getAllByTestId('memoComment')).toHaveLength(1);
  });

  it('react memo should change if comment has change', () => {
    expect(isEqual('1', '1')).toBeTruthy();
  });

  it('ReplyComment should match snapshot', () => {
    const navigateToReplyView = jest.fn();
    const indexFeed = 0;
    const findCommentAndUpdate = jest.fn();

    const contextValue = {
      feeds: [feedsState, () => jest.fn()],
      profile: [{}, jest.fn()]
    };

    const {toJSON} = render(
      <Context.Provider value={contextValue}>
        <ReplyComment
          countComment={comments2[0].children_counts.comment}
          indexFeed={indexFeed}
          findCommentAndUpdate={findCommentAndUpdate}
          navigateToReplyView={navigateToReplyView}
          data={comments2[0].latest_children.comment}
        />
      </Context.Provider>
    );
    expect(toJSON).toMatchSnapshot();
  });
});

describe('useContainerHooks should run correctly', () => {
  const comments2 = [
    {
      activity_id: 'eeb07336-8fe8-11ed-b458-0e0d34fb440f',
      children_counts: {
        comment: 1
      },
      data: {
        count_downvote: 0,
        count_upvote: 0,
        isNotSeen: true,
        text: 'from postman 1'
      },
      id: 'dd8e0ece-a27b-4356-9a37-0427afa86258',
      kind: 'comment',
      latest_children: {
        comment: [
          {
            activity_id: 'cdfa2a76-8cb5-11ed-ab69-0e4b8d0e7a11',
            children_counts: {},
            created_at: '2023-01-09T01:37:20.225354Z',
            data: {
              count_downvote: 1,
              count_upvote: 0,
              targetFeeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
              text: 'Wow'
            },
            id: '8729cdfc-ae7b-458e-a999-af967124c171',
            kind: 'comment',
            latest_children: {},
            parent: 'd9c0baea-adf7-4624-ae04-e257bd80c101',
            target_feeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
            updated_at: '2023-01-09T01:38:14.677925Z',
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
      parent: '',
      target_feeds: [
        'notification:f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
        'notification:c6c91b04-795c-404e-b012-ea28813a2006'
      ],
      updated_at: '2023-01-09T06:57:52.892334Z',
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
  ];

  const twoComments = [
    {
      activity_id: 'cdfa2a76-8cb5-11ed-ab69-0e4b8d0e7a11',
      children_counts: {},
      created_at: '2023-01-09T01:37:20.225354Z',
      data: {
        count_downvote: 1,
        count_upvote: 0,
        targetFeeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
        text: 'Wow'
      },
      id: '8729cdfc-ae7b-458e-a999-af967124c171',
      kind: 'comment',
      latest_children: {},
      parent: 'd9c0baea-adf7-4624-ae04-e257bd80c101',
      target_feeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
      updated_at: '2023-01-09T01:38:14.677925Z',
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
      activity_id: 'cdfa2a76-8cb5-11ed-ab69-0e4b8d0e7a12',
      children_counts: {},
      created_at: '2023-01-09T01:37:20.225354Z',
      data: {
        count_downvote: 1,
        count_upvote: 0,
        targetFeeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
        text: 'Wow'
      },
      id: '8729cdfc-ae7b-458e-a999-af967124c171',
      kind: 'comment',
      latest_children: {},
      parent: 'd9c0baea-adf7-4624-ae04-e257bd80c101',
      target_feeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
      updated_at: '2023-01-09T01:38:14.677925Z',
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
  ];

  it('isLastInParent function should run correctly', () => {
    const {result} = renderHook(() => useContainerComment());

    expect(result.current.isLastInParent(0, comments2[0].latest_children.comment)).toBeTruthy();
    expect(result.current.isLastInParent(0, twoComments)).toBeFalsy();
  });

  it('hideLeftConnector function should run correctly', () => {
    const {result} = renderHook(() => useContainerComment());
    expect(result.current.hideLeftConnector(0, comments2[0].latest_children.comment)).toBeTruthy();
    expect(result.current.hideLeftConnector(0, twoComments)).toBeFalsy();
  });

  it('isLast should run correctly', () => {
    const {result} = renderHook(() => useContainerComment());
    expect(result.current.isLast(0, comments2[0], twoComments)).toBeFalsy();
  });
});

describe('useReplyComment', () => {
  const comments2 = [
    {
      activity_id: 'eeb07336-8fe8-11ed-b458-0e0d34fb440f',
      children_counts: {
        comment: 1
      },
      data: {
        count_downvote: 0,
        count_upvote: 0,
        isNotSeen: true,
        text: 'from postman 1'
      },
      id: 'dd8e0ece-a27b-4356-9a37-0427afa86258',
      kind: 'comment',
      latest_children: {
        comment: [
          {
            activity_id: 'cdfa2a76-8cb5-11ed-ab69-0e4b8d0e7a11',
            children_counts: {
              comment: 0
            },
            created_at: '2023-01-09T01:37:20.225354Z',
            data: {
              count_downvote: 1,
              count_upvote: 0,
              targetFeeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
              text: 'Wow'
            },
            id: '8729cdfc-ae7b-458e-a999-af967124c171',
            kind: 'comment',
            latest_children: {},
            parent: 'd9c0baea-adf7-4624-ae04-e257bd80c101',
            target_feeds: ['notification:c6c91b04-795c-404e-b012-ea28813a2006'],
            updated_at: '2023-01-09T01:38:14.677925Z',
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
      parent: '',
      target_feeds: [
        'notification:f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
        'notification:c6c91b04-795c-404e-b012-ea28813a2006'
      ],
      updated_at: '2023-01-09T06:57:52.892334Z',
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
  ];

  it('isLast should run correcty', () => {
    const {result} = renderHook(() => useReplyComment());
    expect(result.current.isLastInParent(0, 1)).toBeTruthy();
  });
});
