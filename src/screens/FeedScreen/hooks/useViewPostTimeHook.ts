import useFeedUtilsHook from './useFeedUtilsHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../../libraries/analytics/analyticsEventTracking';
import {SOURCE_FEED_TAB} from '../../../utils/constants';
import {setTimer, setViewPostTimeIndex} from '../../../context/actions/feeds';
import {viewTimePost} from '../../../service/post';

export type OnVillSendViewPostTimeOptions = {
  eventName?: BetterSocialEventTracking;
};

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

  const onWillSendViewPostTime = (
    event,
    feedParams,
    options: OnVillSendViewPostTimeOptions = {}
  ) => {
    if (isSamePostViewed(event, viewPostTimeIndex)) return;
    if (viewPostTimeIndex < 0) return;
    if (viewPostTimeIndex > feedParams?.length) return;
    sendViewPostTimeWithFeeds(feedParams);
    updateViewPostTime(event);
    if (options?.eventName) {
      AnalyticsEventTracking.eventTrack(options?.eventName);
    }
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
