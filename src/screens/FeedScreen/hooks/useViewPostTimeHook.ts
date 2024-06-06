import moment from 'moment';

import useFeedUtilsHook from './useFeedUtilsHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../../libraries/analytics/analyticsEventTracking';
import {SOURCE_FEED_TAB, getPostType} from '../../../utils/constants';
import {setTimer, setViewPostTimeIndex} from '../../../context/actions/feeds';
import {viewTimePost} from '../../../service/post';

export type OnWillSendViewPostTimeOptions = {
  scrollEventName?: BetterSocialEventTracking;
  scrollEventItemName?: BetterSocialEventTracking;
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
    options: OnWillSendViewPostTimeOptions = {}
  ) => {
    if (isSamePostViewed(event, viewPostTimeIndex)) return;
    if (viewPostTimeIndex < 0) return;
    if (viewPostTimeIndex > feedParams?.length) return;
    sendViewPostTimeWithFeeds(feedParams);
    updateViewPostTime(event);
    if (options?.scrollEventName) {
      AnalyticsEventTracking.eventTrack(options?.scrollEventName);
    }

    const scrolledInIndex = viewPostTimeIndex + 1;
    if (scrolledInIndex > feedParams?.length) return;

    const scrolledInItem = feedParams?.at(scrolledInIndex);
    if (options?.scrollEventItemName) {
      const trackData = {
        index: scrolledInIndex,
        anon: scrolledInItem?.anonimity,
        postType: getPostType(scrolledInItem?.post_type),
        hasComment: scrolledInItem?.latest_reactions?.comment?.length || 0,
        postAge: moment(scrolledInItem?.created_at).diff(moment(), 'days')
      };
      console.log('scroll', trackData);
      AnalyticsEventTracking.eventTrack(options?.scrollEventItemName, trackData);
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
