import axios from 'axios';
import {act, renderHook} from '@testing-library/react-hooks';

import * as cache from '../../src/utils/cache';
import * as mainFeedAction from '../../src/context/actions/feeds';
import * as post from '../../src/service/post';
import * as vote from '../../src/service/vote';
import Store from '../../src/context/Store';
import useCoreFeed from '../../src/screens/FeedScreen/hooks/useCoreFeed';
import {getSpecificCache} from '../../src/utils/cache';

// import * as useCoreFeedAll from '../../src/screens/FeedScreen/hooks/useCoreFeed'

jest.mock('../../src/utils/cache', () => ({
  saveToCache: jest.fn(),
  getSpecificCache: jest.fn()
}));
jest.mock('../../src/context/actions/feeds');
jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({children}) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({children}) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset)
  };
});

jest.mock('axios');
describe('Main Feed should run correctly', () => {
  const responseMock = {
    data: [
      {
        anonimity: false,
        count_downvote: 0,
        count_upvote: 0,
        duration_feed: 'never',
        expired_at: '2122-11-04T10:33:48.226Z',
        final_score: 0,
        foreign_id: '',
        id: '2499afe8-6f08-11ed-809a-0a096a1cf185',
        images_url: ''
      },
      {
        anonimity: false,
        count_downvote: 0,
        count_upvote: 0,
        duration_feed: 'never',
        expired_at: '2122-11-04T10:33:48.226Z',
        final_score: 0,
        foreign_id: '',
        id: '3499afe8-6f08-11ed-809a-0a096a1cf189',
        images_url: ''
      }
    ],
    offset: 10
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('saveSearchHeight should run correctly', () => {
    const {result} = renderHook(() => useCoreFeed(), {wrapper: Store});

    act(() => {
      result.current.saveSearchHeight('20');
    });
    expect(result.current.searchHeight).toEqual(20);
  });

  // it('getDataFeeds should run correctly', async () => {
  //   const {result} = renderHook(() => useCoreFeed(), {wrapper: Store});
  //   axios.get.mockResolvedValue(responseMock);
  //   act(() => {
  //     const resp = result.current.getDataFeeds(10, false);
  //     expect(resp).resolves.toEqual(responseMock);
  //   });

  //   const setMainFeed = jest.spyOn(mainFeedAction, 'setMainFeeds');
  //   const saveToCache = jest.spyOn(cache, 'saveToCache');
  //   act(() => {
  //     result.current.handleDataFeeds(responseMock);
  //   });
  //   expect(setMainFeed).toHaveBeenCalled();
  //   expect(saveToCache).toHaveBeenCalled();
  //   act(() => {
  //     result.current.handleDataFeeds(responseMock, 10);
  //   });

  //   expect(setMainFeed).toHaveBeenCalled();
  //   expect(saveToCache).toHaveBeenCalled();
  // });

  // it('checkCacheFeed should run correctly', async () => {
  //   const {result} = renderHook(() => useCoreFeed(), {wrapper: Store});
  //   act(() => {
  //     result.current.checkCacheFeed();
  //   });
  //   expect(getSpecificCache).toHaveBeenCalledTimes(1);
  // });

  it('onBlockCompleted should run correctly', async () => {
    const {result} = renderHook(() => useCoreFeed(), {wrapper: Store});
    axios.get.mockResolvedValue(responseMock);
    act(() => {
      const resp = result.current.onBlockCompleted();
      expect(resp).resolves.toEqual(responseMock);
    });
  });

  it('onDeleteBlockedPostCompleted should run correctly', () => {
    const {result} = renderHook(() => useCoreFeed(), {wrapper: Store});
    const setMainFeed = jest.spyOn(mainFeedAction, 'setMainFeeds');
    act(() => {
      result.current.onDeleteBlockedPostCompleted(responseMock.data[0].id);
    });
    expect(setMainFeed).toHaveBeenCalled();
  });

  it('updateFeed should run correctly', () => {
    const {result} = renderHook(() => useCoreFeed(), {wrapper: Store});
    const setMainFeed = jest.spyOn(mainFeedAction, 'setMainFeeds');
    act(() => {
      result.current.handleUpdateFeed(responseMock, 10);
    });
    expect(setMainFeed).toHaveBeenCalled();
    const updatePost = {activity_id: responseMock.data[0].id};
    const spyUpdate = jest.spyOn(post, 'getFeedDetail').mockResolvedValue({data: responseMock[0]});
    const spySetFeedIndex = jest.spyOn(mainFeedAction, 'setFeedByIndex');
    act(() => {
      result.current.updateFeed(updatePost);
    });
    expect(spyUpdate).toHaveBeenCalled();
    expect(spySetFeedIndex).toHaveBeenCalled();
  });

  it('setDownVote should run correctly', () => {
    const {result} = renderHook(() => useCoreFeed(), {wrapper: Store});
    const spyDownvote = jest.spyOn(vote, 'downVote');
    act(() => {
      result.current.setDownVote(responseMock.data[0]);
    });
    expect(spyDownvote).toHaveBeenCalled();
  });
});
