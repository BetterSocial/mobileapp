import React, {useRef} from 'react';
import {fireEvent, render} from '@testing-library/react-native';

import * as UserUtil from '../../../src/utils/users';
import * as serviceVote from '../../../src/service/vote';
import Comment, {isEqual} from '../../../src/components/Comments/Comment';

jest.mock('react-native/Libraries/Pressability/usePressability');
jest.mock('react-native/Libraries/Components/Pressable/Pressable');
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({goBack: jest.fn(), navigate: mockNavigate}),
  useRoute: () => ({
    params: {}
  })
}));

const setState = jest.fn();
const openBlockComponent = jest.fn();
jest.mock('react', () => {
  const actualReact = jest.requireActual('react');

  return {
    ...actualReact,
    useState: jest.fn(),
    useRef: jest.fn()
  };
});

describe('Comment test should run correctly', () => {
  const user = {
    created_at: '2022-06-10T13:11:53.385703Z',
    data: {
      human_id: 'I4K3M10FGR78EWQQDNQ2',
      profile_pic_url:
        'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg',
      username: 'Agita'
    },
    id: 'c6c91b04-795c-404e-b012-ea28813a2006',
    updated_at: '2022-07-29T12:54:03.879150Z'
  };

  const comment = {
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
  };
  const photo =
    'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg';
  const level = 1;

  beforeEach(() => {
    jest.spyOn(React, 'useState').mockImplementation((initState) => [initState, setState]);
    useRef.mockReturnValueOnce({current: openBlockComponent});
  });

  it('open profile should run correctly', () => {
    const onPress = jest.fn();
    const findComment = jest.fn();
    const updateVote = jest.fn();
    const time = '2023-01-09T14:13:31.890300Z';
    const {getByTestId} = render(
      <Comment
        user={user}
        comment={comment}
        photo={photo}
        level={level}
        onPress={onPress}
        findCommentAndUpdate={findComment}
        updateVote={updateVote}
        time={time}
      />
    );
    fireEvent.press(getByTestId('openProfile'));
    // expect()
  })

  it('Should match snapshot', () => {
    const onPress = jest.fn();
    const findComment = jest.fn();
    const updateVote = jest.fn();
    const time = '2023-01-09T14:13:31.890300Z';
    const {toJSON} = render(
      <Comment
        user={user}
        comment={comment}
        photo={photo}
        level={level}
        onPress={onPress}
        findCommentAndUpdate={findComment}
        updateVote={updateVote}
        time={time}
      />
    );
    expect(toJSON).toMatchSnapshot();
  });

  it('textPress fuction should run correctly', () => {
    const onPress = jest.fn();
    const findComment = jest.fn();
    const updateVote = jest.fn();
    const time = '2023-01-09T14:13:31.890300Z';
    const {getByTestId} = render(
      <Comment
        user={user}
        comment={comment}
        photo={photo}
        level={level}
        onPress={onPress}
        findCommentAndUpdate={findComment}
        updateVote={updateVote}
        time={time}
      />
    );
    fireEvent.press(getByTestId('textPress'));
    expect(onPress).toHaveBeenCalled();
    const {getByTestId: getByTestIdLevel2} = render(
      <Comment
        user={user}
        comment={comment}
        photo={photo}
        level={2}
        onPress={onPress}
        findCommentAndUpdate={findComment}
        updateVote={updateVote}
        time={time}
      />
    );
    fireEvent.press(getByTestIdLevel2('textPress'));
    expect(onPress).toHaveBeenCalled();
  });

  it('openProfile should run correctly', async () => {
    const onPress = jest.fn();
    const findComment = jest.fn();
    const updateVote = jest.fn();
    const time = '2023-01-09T14:13:31.890300Z';
    const spyGeUserId = jest.spyOn(UserUtil, 'getUserId');
    const {getByTestId} = render(
      <Comment
        user={user}
        comment={comment}
        photo={photo}
        level={level}
        onPress={onPress}
        findCommentAndUpdate={findComment}
        updateVote={updateVote}
        time={time}
      />
    );
    fireEvent.press(getByTestId('openProfile'));
    expect(spyGeUserId).toHaveBeenCalled();
  });

  it('textPress fuction should run correctly', () => {
    const onPress = jest.fn();
    const findComment = jest.fn();
    const updateVote = jest.fn();
    const time = '2023-01-09T14:13:31.890300Z';
    const {getByTestId} = render(
      <Comment
        user={user}
        comment={comment}
        photo={photo}
        level={level}
        onPress={onPress}
        findCommentAndUpdate={findComment}
        updateVote={updateVote}
        time={time}
      />
    );
    fireEvent.press(getByTestId('textPress'));
    expect(onPress).toHaveBeenCalled();
    const {getByTestId: getByTestIdLevel2} = render(
      <Comment
        user={user}
        comment={comment}
        photo={photo}
        level={2}
        onPress={onPress}
        findCommentAndUpdate={findComment}
        updateVote={updateVote}
        time={time}
      />
    );
    fireEvent.press(getByTestIdLevel2('textPress'));
    expect(onPress).toHaveBeenCalled();

    expect(setState).toHaveBeenCalled();
  });

  it('upvoteBtn should run correctly', () => {
    const onPress = jest.fn();
    const findComment = jest.fn();
    const updateVote = jest.fn();
    const time = '2023-01-09T14:13:31.890300Z';
    const serviceIvoteMock = jest.spyOn(serviceVote, 'iVoteComment');
    const {getByTestId} = render(
      <Comment
        user={user}
        comment={comment}
        photo={photo}
        level={level}
        onPress={onPress}
        findCommentAndUpdate={findComment}
        updateVote={updateVote}
        time={time}
      />
    );
    fireEvent.press(getByTestId('upvoteBtn'));
    expect(setState).toHaveBeenCalled();
    expect(serviceIvoteMock).toHaveBeenCalled();
  });

  it('react memo should should run correctly', async () => {
    expect(isEqual({comment: '1'}, {comment: '2'})).toBeFalsy();
    expect(isEqual({comment: '1'}, {comment: '1'})).toBeTruthy();
  });
});
