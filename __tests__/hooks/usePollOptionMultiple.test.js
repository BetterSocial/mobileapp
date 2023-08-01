import {act, renderHook} from '@testing-library/react-hooks';

// eslint-disable-next-line import/no-named-as-default
import usePollOptionMultiple from '../../src/components/PollOptionsMultipleChoice/hooks/usePollOptionMultiple';

describe('usePollOptionMultiple should run correctly', () => {
  const item = {
    post_type: 1,
    message: 'halo',
    images_url: '',
    pollOptions: [
      {
        counter: '0',
        createdAt: '2022-11-28T01:24:25.000Z',
        option: 'bahaya123',
        polling_id: 'dee1ff13-9e1e-46b2-8ffc-46afdd38acca',
        polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53b',
        updatedAt: '2022-11-28T01:24:25.000Z'
      },
      {
        counter: '1',
        createdAt: '2022-11-28T01:24:25.000Z',
        option: 'bahaya1',
        polling_id: 'dee1ff13-9e1e-46b2-8ffc-46afdd38acca',
        polling_option_id: '3bc4ec5e-ac8f-4704-8256-1018edd9224c',
        updatedAt: '2022-11-28T01:25:15.000Z'
      }
    ],
    polls_expired_at: '2022-11-29T01:24:25.170Z',
    multiplechoice: true,
    isalreadypolling: true,
    voteCount: 2,
    topics: ['poll']
  };
  it('isPollDisabled should run correctly', () => {
    const {result} = renderHook(() =>
      usePollOptionMultiple({
        maxpolls: [{polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53a'}],
        item: item.pollOptions[0],
        isalreadypolling: true,
        isexpired: true,
        mypoll: ['c4d16d91-89f5-423c-acb5-95a1b91ec53b'],
        selectedindex: '1'
      })
    );
    expect(result.current.isPollDisabled).toBeTruthy();
  });

  it('handleStyleBar should run correctly', () => {
    const {result} = renderHook(() =>
      usePollOptionMultiple({
        maxpolls: [{polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53a'}],
        item: item.pollOptions[0],
        isalreadypolling: true,
        isexpired: true,
        mypoll: ['c4d16d91-89f5-423c-acb5-95a1b91ec53b'],
        selectedindex: '1'
      })
    );
    expect(result.current.handleStyleBar()).toEqual(0);
    expect(result.current.handleStyleBar(200)).toEqual(100);
  });

  it('isPollNotEndedAndIsMine should run correctly', () => {
    const {result} = renderHook(() =>
      usePollOptionMultiple({
        maxpolls: ['c4d16d91-89f5-423c-acb5-95a1b91ec53b'],
        item: item.pollOptions[0],
        isalreadypolling: true,
        isexpired: false,
        mypoll: [{polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53b'}],
        selectedindex: '1'
      })
    );
    expect(result.current.isPollNotEndedAndIsMine).toBeTruthy();
  });

  it('isMax should run correctly', () => {
    const {result} = renderHook(() =>
      usePollOptionMultiple({
        maxpolls: ['c4d16d91-89f5-423c-acb5-95a1b91ec53b'],
        item: item.pollOptions[0],
        isalreadypolling: true,
        isexpired: false,
        mypoll: [{polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53a'}],
        selectedindex: '1'
      })
    );
    expect(result.current.isMax).toBeTruthy();
  });

  it('onOptionsClicked should run correctly', () => {
    const {result} = renderHook(() =>
      usePollOptionMultiple({
        maxpolls: ['c4d16d91-89f5-423c-acb5-95a1b91ec53b'],
        item: item.pollOptions[0],
        isalreadypolling: true,
        isexpired: true,
        mypoll: [{polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53a'}],
        selectedindex: '1'
      })
    );
    expect(result.current.onOptionsClicked()).toBeNull();
  });

  it('onSelected props should call', () => {
    const onSelected = jest.fn();
    const {result} = renderHook(() =>
      usePollOptionMultiple({
        maxpolls: ['c4d16d91-89f5-423c-acb5-95a1b91ec53b'],
        item: item.pollOptions[0],
        isalreadypolling: false,
        isexpired: false,
        mypoll: [{polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53a'}],
        selectedindex: '1',
        onselected: onSelected,
        index: '1'
      })
    );
    act(() => {
      result.current.onOptionsClicked();
    });
    expect(onSelected).toHaveBeenCalledTimes(1);
  });
});
