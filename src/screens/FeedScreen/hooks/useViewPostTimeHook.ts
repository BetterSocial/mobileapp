import useFeedUtilsHook from './useFeedUtilsHook';
import {SOURCE_FEED_TAB} from '../../../utils/constants';
import {setTimer, setViewPostTimeIndex} from '../../../context/actions/feeds';
import {viewTimePost} from '../../../service/post';

const useViewPostTimeHook = (dispatch, timer, viewPostTimeIndex) => {
  const {getCurrentPostViewed, isSamePostViewed} = useFeedUtilsHook();
  const sendViewPostTimeWithFeeds = async (feedsParam = [], withResetTime = false) => {
    const currentTime = new Date();
    const diffTime = currentTime.getTime() - timer.getTime();
    const id = (feedsParam?.[viewPostTimeIndex] as any)?.id;
    if (!id) return;

    viewTimePost(id, diffTime, SOURCE_FEED_TAB);
    if (withResetTime) setTimer(new Date(), dispatch);
  };

  const updateViewPostTime = (momentumEvent) => {
    setViewPostTimeIndex(getCurrentPostViewed(momentumEvent), dispatch);
    setTimer(new Date(), dispatch);
  };

  const onWillSendViewPostTime = (event, feedParams) => {
    if (isSamePostViewed(event, viewPostTimeIndex)) return;
    sendViewPostTimeWithFeeds(feedParams);
    updateViewPostTime(event);
  };

  return {
    getCurrentPostViewed,
    sendViewPostTimeWithFeeds,
    updateViewPostTime,
    isSamePostViewed,
    onWillSendViewPostTime
  };
};

export default useViewPostTimeHook;
