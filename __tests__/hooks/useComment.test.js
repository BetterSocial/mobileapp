import {act, renderHook} from '@testing-library/react-hooks';
import * as serviceVote from '../../src/service/vote';
import useComment from '../../src/components/Comments/hooks/useComment';

describe('useComment should run correctly', () => {
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
  const level = 1;

  it('iVote function should run correctly', async () => {
    const spy = jest.spyOn(serviceVote, 'iVoteComment');
    const updateVote = jest.fn();
    const findCommentAndUpdate = jest.fn();
    const {result} = renderHook(() =>
      useComment({comment, level, updateVote, findCommentAndUpdate})
    );
    await result.current.iVote();
    expect(spy).toHaveBeenCalled();
  });

  it('upvote status none should run correctly', async () => {
    const updateVote = jest.fn();
    const findCommentAndUpdate = jest.fn();
    const spy = jest.spyOn(serviceVote, 'voteCommentV2');
    const {result} = renderHook(() =>
      useComment({comment, level, updateVote, findCommentAndUpdate})
    );
    expect(result.current.statusVote).toEqual('none');

    act(() => {
      result.current.onUpVote();
    });

    expect(spy).toHaveBeenCalled();

    expect(result.current.statusVote).toEqual('upvote');
    expect(result.current.totalVote).toEqual(1);
  });

  it('downvote status none should run correctly', async () => {
    const updateVote = jest.fn();
    const findCommentAndUpdate = jest.fn();
    const spy = jest.spyOn(serviceVote, 'voteCommentV2');
    const {result} = renderHook(() =>
      useComment({comment, level, updateVote, findCommentAndUpdate})
    );
    expect(result.current.statusVote).toEqual('none');
    act(() => {
      result.current.onDownVote();
    });
    expect(spy).toHaveBeenCalled();
    expect(result.current.statusVote).toEqual('downvote');
    expect(result.current.totalVote).toEqual(-1);
  });

  it('upvote status upvote should run correctly', async () => {
    const updateVote = jest.fn();
    const findCommentAndUpdate = jest.fn();
    const spy = jest.spyOn(serviceVote, 'voteCommentV2');
    const {result} = renderHook(() =>
      useComment({
        comment: {...comment, data: {...comment.data, count_upvote: 1, count_downvote: 0}},
        level,
        updateVote,
        findCommentAndUpdate
      })
    );
    await result.current.setStatusVote('upvote');
    act(() => {
      result.current.onUpVote();
    });
    expect(result.current.totalVote).toEqual(0);
    expect(result.current.statusVote).toEqual('none');
    expect(spy).toHaveBeenCalled();
  });

  it('upvote status downvote should run correctly', async () => {
    const updateVote = jest.fn();
    const findCommentAndUpdate = jest.fn();
    const spy = jest.spyOn(serviceVote, 'voteCommentV2');
    const {result} = renderHook(() =>
      useComment({
        comment: {...comment, data: {...comment.data, count_upvote: 0, count_downvote: 2}},
        level,
        updateVote,
        findCommentAndUpdate
      })
    );
    await result.current.setStatusVote('downvote');
    act(() => {
      result.current.onUpVote();
    });
    expect(result.current.totalVote).toEqual(0);
    expect(result.current.statusVote).toEqual('upvote');
    expect(spy).toHaveBeenCalled();
  });

  it('downvote status downvote should run correctly', async () => {
    const updateVote = jest.fn();
    const findCommentAndUpdate = jest.fn();
    const spy = jest.spyOn(serviceVote, 'voteCommentV2');
    const {result} = renderHook(() =>
      useComment({comment, level, updateVote, findCommentAndUpdate})
    );
    await result.current.setStatusVote('downvote');
    act(() => {
      result.current.onDownVote();
    });
    expect(spy).toHaveBeenCalled();
    expect(result.current.statusVote).toEqual('none');
    expect(result.current.totalVote).toEqual(1);
  });

  it('downvote status upvote should run correctly', async () => {
    const updateVote = jest.fn();
    const findCommentAndUpdate = jest.fn();
    const spy = jest.spyOn(serviceVote, 'voteCommentV2');
    const {result} = renderHook(() =>
      useComment({comment, level, updateVote, findCommentAndUpdate})
    );
    await result.current.setStatusVote('upvote');
    act(() => {
      result.current.onDownVote();
    });
    expect(spy).toHaveBeenCalled();
    expect(result.current.statusVote).toEqual('downvote');
    expect(result.current.totalVote).toEqual(-2);
  });
});
