import * as React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react-native';
import Store from '../../../src/context/Store';

import * as serviceUser from '../../../src/utils/users';
import * as serviceVote from '../../../src/service/vote';
import ReplyCommentItem from '../../../src/components/Comments/ReplyCommentItem';

jest.mock('react-native');
jest.mock('react-native/Libraries/Pressability/usePressability');
jest.mock('react-native/Libraries/Components/Pressable/Pressable');

jest.useFakeTimers();

describe('ReplyCommentItem should run correctly', () => {
  const spyDownvote = jest.spyOn(serviceVote, 'voteCommentV2');

  afterEach(cleanup);
  const user = {
    created_at: '2022-06-10T13:11:47.095310Z',
    data: {
      human_id: 'HQEGNQCHA8J1OIX4G2CP',
      profile_pic_url:
        'https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg',
      username: 'Fajarism'
    },
    id: 'f19ce509-e8ae-405f-91cf-ed19ce1ed96e',
    updated_at: '2022-08-16T03:34:45.197566Z'
  };

  const comments = {
    activity_id: '4fb32f25-7a1c-11ed-a1bd-124f97b82f95',
    children_counts: {},
    created_at: '2022-12-12T12:58:01.801974Z',
    data: {
      count_downvote: 2,
      count_upvote: 0,
      isNotSeen: true,
      text: 'Good to see u'
    },
    id: '016dfff6-49d2-4279-ae29-fd6997bcae9a',
    kind: 'comment',
    latest_children: {comment: [], length: 0},
    parent: '',

    updated_at: '2022-12-12T12:58:01.801974Z',
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

  it('should match snapshot', () => {
    const onPress = jest.fn();
    const refreshComment = jest.fn();
    const {toJSON, getAllByText} = render(
      <ReplyCommentItem
        comment={comments}
        user={user}
        onPress={onPress}
        isLast={false}
        isLastInParent={false}
        time={'26/08/2022'}
        photo="https://detil.jpg"
        level={0}
        refreshComment={refreshComment}
        showLeftConnector={false}
        disableOnTextPress={false}
      />,
      {wrapper: Store}
    );
    expect(toJSON).toMatchSnapshot();
    expect(getAllByText('-2')).toHaveLength(1);
  });

  it('should match snapshot', () => {
    const onPress = jest.fn();
    const refreshComment = jest.fn();
    const {toJSON, getAllByText} = render(
      <ReplyCommentItem
        comment={comments}
        user={user}
        onPress={onPress}
        isLast={false}
        isLastInParent={false}
        time={'26/08/2022'}
        photo="https://detil.jpg"
        level={0}
        refreshComment={refreshComment}
        showLeftConnector={false}
        disableOnTextPress={false}
      />,
      {wrapper: Store}
    );
    expect(toJSON).toMatchSnapshot();
    expect(getAllByText('-2')).toHaveLength(1);
  });

  it('ontextpress function should run correctly and the children text should correct', () => {
    const onPress = jest.fn();
    const refreshComment = jest.fn();
    const {getByTestId} = render(
      <ReplyCommentItem
        comment={comments}
        user={user}
        onPress={onPress}
        isLast={false}
        isLastInParent={false}
        time={'26/08/2022'}
        photo="https://detil.jpg"
        level={0}
        refreshComment={refreshComment}
        showLeftConnector={false}
        disableOnTextPress={false}
      />,
      {wrapper: Store}
    );
    fireEvent.press(getByTestId('ontextpress'));
    expect(onPress).toHaveBeenCalled();
    const {getByTestId: getLevelMore2} = render(
      <ReplyCommentItem
        comment={comments}
        user={user}
        onPress={onPress}
        isLast={false}
        isLastInParent={false}
        time={'26/08/2022'}
        photo="https://detil.jpg"
        level={2}
        refreshComment={refreshComment}
        showLeftConnector={false}
        disableOnTextPress={false}
      />,
      {wrapper: Store}
    );
    fireEvent.press(getLevelMore2('ontextpress'));
  });
  it('replyBtn should run correctly', () => {
    const onPress = jest.fn();
    const refreshComment = jest.fn();
    const {getByTestId} = render(
      <ReplyCommentItem
        comment={comments}
        user={user}
        onPress={onPress}
        isLast={false}
        isLastInParent={false}
        time={'26/08/2022'}
        photo="https://detil.jpg"
        level={0}
        refreshComment={refreshComment}
        showLeftConnector={false}
        disableOnTextPress={false}
      />,
      {wrapper: Store}
    );
    fireEvent.press(getByTestId('replyBtn'));
    expect(onPress).toHaveBeenCalled();
  });

  it('downcoteBtn should run correctly', () => {
    const onPress = jest.fn();
    const refreshComment = jest.fn();
    const {getByTestId} = render(
      <ReplyCommentItem
        comment={comments}
        user={user}
        onPress={onPress}
        isLast={false}
        isLastInParent={false}
        time={'26/08/2022'}
        photo="https://detil.jpg"
        level={0}
        refreshComment={refreshComment}
        showLeftConnector={false}
        disableOnTextPress={false}
      />,
      {wrapper: Store}
    );
    fireEvent.press(getByTestId('downvoteBtn'));
    expect(spyDownvote).toHaveBeenCalled();
  });
  it('upvoteBtn should run correctly', () => {
    const onPress = jest.fn();
    const refreshComment = jest.fn();
    const {getByTestId} = render(
      <ReplyCommentItem
        comment={comments}
        user={user}
        onPress={onPress}
        isLast={false}
        isLastInParent={false}
        time={'26/08/2022'}
        photo="https://detil.jpg"
        level={0}
        refreshComment={refreshComment}
        showLeftConnector={false}
        disableOnTextPress={false}
      />,
      {wrapper: Store}
    );
    fireEvent.press(getByTestId('upvotebtn'));
    expect(spyDownvote).toHaveBeenCalled();
  });

  it('onOpenProfile should run correctly', () => {
    const onPress = jest.fn();
    const spyUser = jest.spyOn(serviceUser, 'getUserId');
    const refreshComment = jest.fn();
    const {getByTestId} = render(
      <ReplyCommentItem
        comment={comments}
        user={user}
        onPress={onPress}
        isLast={false}
        isLastInParent={false}
        time={'26/08/2022'}
        photo="https://detil.jpg"
        level={0}
        refreshComment={refreshComment}
        showLeftConnector={false}
        disableOnTextPress={false}
      />,
      {wrapper: Store}
    );
    fireEvent.press(getByTestId('profileOpen'));
    expect(spyUser).toHaveBeenCalled();
  });
});
