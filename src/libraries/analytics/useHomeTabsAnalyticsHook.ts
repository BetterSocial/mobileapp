import StorageUtils from '../../utils/storage';
import AnalyticsEventTracking, {BetterSocialEventTracking} from './analyticsEventTracking';

export type useHomeTabsAnalyticsHookType = {
  onTabClicked: (nextRoute: string) => void;
};

type PreviousRouteMap = {
  SignedChannelList: BetterSocialEventTracking | null;
  AnonymousChannelList: BetterSocialEventTracking | null;
  Feed: BetterSocialEventTracking | null;
  Profile: BetterSocialEventTracking | null;
};

const useHomeTabsAnalyticsHook = (): useHomeTabsAnalyticsHookType => {
  const track = AnalyticsEventTracking.eventTrack;
  const sendAnalyticsEvent = (nextRouteEvent: PreviousRouteMap) => {
    const previousRoute = StorageUtils.lastSelectedMenu.get();
    if (previousRoute && nextRouteEvent[previousRoute]) {
      track(nextRouteEvent[previousRoute]);
    }
  };

  const onHomeTabsScreenAnonChatButtonClicked = () => {
    sendAnalyticsEvent({
      AnonymousChannelList: null,
      Feed: BetterSocialEventTracking.HOME_BOTTOM_TABS_FEED_PAGE_TO_ANON_TAB_CLICKED,
      Profile: BetterSocialEventTracking.HOME_BOTTOM_TABS_PROFILE_PAGE_TO_INCOGNITO_TAB_CLICKED,
      SignedChannelList:
        BetterSocialEventTracking.HOME_BOTTOM_TABS_SIGNED_CHAT_PAGE_TO_ANON_TAB_CLICKED
    });
  };

  const onHomeTabsScreenSignedChatButtonClicked = () => {
    sendAnalyticsEvent({
      AnonymousChannelList:
        BetterSocialEventTracking.HOME_BOTTOM_TABS_ANON_CHAT_PAGE_TO_PRIMARY_TAB_CLICKED,
      Feed: BetterSocialEventTracking.HOME_BOTTOM_TABS_FEED_PAGE_TO_SIGNED_TAB_CLICKED,
      Profile: BetterSocialEventTracking.HOME_BOTTOM_TABS_PROFILE_PAGE_TO_PRIMARY_TAB_CLICKED,
      SignedChannelList: null
    });
  };

  const onHomeTabsScreenFeedButtonClicked = () => {
    sendAnalyticsEvent({
      AnonymousChannelList:
        BetterSocialEventTracking.HOME_BOTTOM_TABS_ANON_CHAT_PAGE_TO_FEED_TAB_CLICKED,
      Feed: null,
      Profile: BetterSocialEventTracking.HOME_BOTTOM_TABS_PROFILE_PAGE_TO_FEED_TAB_CLICKED,
      SignedChannelList:
        BetterSocialEventTracking.HOME_BOTTOM_TABS_SIGNED_CHAT_PAGE_TO_FEED_TAB_CLICKED
    });
  };

  const onHomeTabsScreenProfileButtonClicked = () => {
    sendAnalyticsEvent({
      AnonymousChannelList:
        BetterSocialEventTracking.HOME_BOTTOM_TABS_ANON_CHAT_PAGE_TO_PROFILE_TAB_CLICKED,
      Feed: BetterSocialEventTracking.HOME_BOTTOM_TABS_FEED_PAGE_TO_PROFILE_TAB_CLICKED,
      Profile: null,
      SignedChannelList:
        BetterSocialEventTracking.HOME_BOTTOM_TABS_SIGNED_CHAT_PAGE_TO_PROFILE_TAB_CLICKED
    });
  };

  const onTabClicked = (nexRoute: string) => {
    if (nexRoute === 'Feed') onHomeTabsScreenFeedButtonClicked();
    if (nexRoute === 'SignedChannelList') onHomeTabsScreenSignedChatButtonClicked();
    if (nexRoute === 'AnonymousChannelList') onHomeTabsScreenAnonChatButtonClicked();
    if (nexRoute === 'Profile') onHomeTabsScreenProfileButtonClicked();
  };

  return {
    onTabClicked
  };
};

export default useHomeTabsAnalyticsHook;
