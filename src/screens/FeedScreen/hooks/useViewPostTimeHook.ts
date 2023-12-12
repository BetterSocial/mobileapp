import dimen from '../../../utils/dimen';
import {SOURCE_FEED_TAB} from '../../../utils/constants';
import {setTimer, setViewPostTimeIndex} from '../../../context/actions/feeds';
import {viewTimePost} from '../../../service/post';

const useViewPostTimeHook = (dispatch, timer, viewPostTimeIndex) => {
  const sendViewPostTimeWithFeeds = async (feedsParam = [], withResetTime = false) => {
    const currentTime = new Date();
    const diffTime = currentTime.getTime() - timer.getTime();
    const id = (feedsParam?.[viewPostTimeIndex] as any)?.id;
    if (!id) return;

    viewTimePost(id, diffTime, SOURCE_FEED_TAB);
    if (withResetTime) setTimer(new Date(), dispatch);
  };

  const getCurrentPostViewed = (momentumEvent) => {
    const {y} = momentumEvent.nativeEvent.contentOffset;
    const shownIndex = Math.ceil(y / dimen.size.FEED_CURRENT_ITEM_HEIGHT);
    return shownIndex;
  };

  const updateViewPostTime = (momentumEvent) => {
    setViewPostTimeIndex(getCurrentPostViewed(momentumEvent), dispatch);
    setTimer(new Date(), dispatch);
  };

  const isSamePostViewed = (momentumEvent) => {
    return getCurrentPostViewed(momentumEvent) === viewPostTimeIndex;
  };

  const onWillSendViewPostTime = (event, feedParams) => {
    if (isSamePostViewed(event)) return;
    sendViewPostTimeWithFeeds(feedParams);
    updateViewPostTime(event);
  };

  return {
    sendViewPostTimeWithFeeds,
    updateViewPostTime,
    isSamePostViewed,
    onWillSendViewPostTime
  };
};

export default useViewPostTimeHook;
