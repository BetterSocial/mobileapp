import {act, renderHook} from '@testing-library/react-hooks';

import useContentPoll from '../../src/screens/FeedScreen/hooks/useContentPoll';

describe('Content poll function should run correctly', () => {
  const polls = [
    {
      counter: '0',
      createdAt: '2022-11-28T01:26:14.000Z',
      option: 'Fre',
      polling_id: '732c5bdc-3bd2-4460-8baa-2bbdbb495185',
      polling_option_id: '35a46076-628c-4b68-b585-62dd9e19357b',
      updatedAt: '2022-11-28T01:26:14.000Z',
      isalreadypolling: false
    },
    {
      counter: '0',
      createdAt: '2022-11-28T01:26:14.000Z',
      option: 'Fra',
      polling_id: '732c5bdc-3bd2-4460-8baa-2bbdbb495185',
      polling_option_id: '05c3371d-f374-4c79-8c88-03cb1d86d07b',
      updatedAt: '2022-11-28T01:26:14.000Z',
      isalreadypolling: false
    }
  ];

  const itemPoll = {
    anonimity: false,
    count_downvote: 0,
    count_upvote: 0,
    duration_feed: 'never',
    expired_at: '2122-11-04T01:26:13.941Z',
    final_score: 0,
    foreign_id: '',
    id: 'a5e97dae-6ebb-11ed-9d8d-124f97b82f95',
    images_url: '',
    isalreadypolling: false
  };

  it('renderSeeResultButton should run correctly', () => {
    const {result} = renderHook(() => useContentPoll({polls}));

    expect(result.current.renderSeeResultButton(true)).toEqual('See Results');
    act(() => {
      result.current.setMultipleChoiceSelected([1]);
    });
    expect(result.current.renderSeeResultButton(true)).toEqual('Submit');
  });

  it('showSetResultsButton should run correctly', () => {
    const {result} = renderHook(() => useContentPoll({polls}));
    const expiredDate = '2022-11-25T02:14:14.499Z';
    const notExpiredDare = '2024-12-29T02:14:14.499Z';
    act(() => {
      result.current.setIsAlreadyPolling(false);
    });
    expect(result.current.showSetResultsButton(expiredDate)).toBeFalsy();
    expect(result.current.showSetResultsButton(notExpiredDare)).toBeTruthy();
    act(() => {
      result.current.setIsAlreadyPolling(true);
    });
    expect(result.current.showSetResultsButton(expiredDate)).toBeFalsy();
  });

  it('onSeeResultsClicked should run correctly', () => {
    const {result} = renderHook(() => useContentPoll({polls}));
    const callback = jest.fn();
    act(() => {
      result.current.onSeeResultsClicked(itemPoll, true, callback, 1);
      result.current.setMultipleChoiceSelected([]);
    });
    expect(callback).toHaveBeenCalled();
    expect(result.current.isAlreadyPolling).toBeTruthy();
    act(() => {
      result.current.onSeeResultsClicked(itemPoll, false, callback, 1);
    });
    expect(result.current.newPoll.isalreadypolling).toBe(true);
  });
});
