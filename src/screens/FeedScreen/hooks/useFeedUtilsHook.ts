import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

import dimen from '../../../utils/dimen';

const useFeedUtilsHook = () => {
  const getCurrentPostViewed = (momentumEvent: NativeSyntheticEvent<NativeScrollEvent>): number => {
    const {y} = momentumEvent.nativeEvent.contentOffset;
    const shownIndex = Math.ceil(y / dimen.size.FEED_CURRENT_ITEM_HEIGHT);
    return shownIndex;
  };

  const isSamePostViewed = (
    momentumEvent: NativeSyntheticEvent<NativeScrollEvent>,
    viewPostTimeIndex: number
  ): boolean => {
    console.log(
      'isSamePostViewed',
      getCurrentPostViewed(momentumEvent),
      viewPostTimeIndex,
      getCurrentPostViewed(momentumEvent) === viewPostTimeIndex
    );
    return getCurrentPostViewed(momentumEvent) === viewPostTimeIndex;
  };

  return {
    getCurrentPostViewed,
    isSamePostViewed
  };
};

export default useFeedUtilsHook;
