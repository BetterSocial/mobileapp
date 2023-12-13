import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

import useFeedUtilsHook from './useFeedUtilsHook';
import {FEEDS_DIFF_TO_FETCH} from '../../../utils/constants';

const useFeedPreloadHook = (feedLength: number, fetchCallback: () => void) => {
  const {getCurrentPostViewed} = useFeedUtilsHook();

  function __shouldFetchNextFeeds(momentumEvent: NativeSyntheticEvent<NativeScrollEvent>): boolean {
    const shownIndex = getCurrentPostViewed(momentumEvent);
    console.log(`shown index ${shownIndex} vs ${feedLength}`);
    return feedLength - shownIndex <= FEEDS_DIFF_TO_FETCH;
  }

  function fetchNextFeeds(momentumEvent: NativeSyntheticEvent<NativeScrollEvent>) {
    const shouldFetch = __shouldFetchNextFeeds(momentumEvent);
    if (shouldFetch && fetchCallback) {
      console.log('fetch next feeds');
      fetchCallback();
    }
  }

  return {
    fetchNextFeeds
  };
};

export default useFeedPreloadHook;
