import AnalyticsEventTracking, {BetterSocialEventTracking} from './analyticsEventTracking';
import {
  DISCOVERY_TAB_DOMAINS,
  DISCOVERY_TAB_NEWS,
  DISCOVERY_TAB_TOPICS,
  DISCOVERY_TAB_USERS
} from '../../utils/constants';

const useDiscoveryScreenAnalyticsHook = (
  selectedScreen: number,
  setSelectedScreen: (number) => void
) => {
  const onSearchCommunityPressed = () => {
    if (selectedScreen === DISCOVERY_TAB_TOPICS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_SEARCHED_COMMUNITY_CLICKED
      );
    } else if (selectedScreen === DISCOVERY_TAB_NEWS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_SEARCH_NEWS_CLICKED
      );
    }
  };

  const onBackButtonPressed = () => {
    if (selectedScreen === DISCOVERY_TAB_NEWS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_BACK_BUTTON_CLICKED
      );
    }
  };

  const __handleSelectedTabClickedFromNewsScreen = (index: number) => {
    if (index === DISCOVERY_TAB_USERS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_USERS_TAB_CLICKED
      );
    } else if (index === DISCOVERY_TAB_TOPICS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_COMMUNITY_TAB_CLICKED
      );
    } else if (index === DISCOVERY_TAB_DOMAINS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_DOMAINS_TAB_CLICKED
      );
    }
  };

  const onTabClicked = (index: number) => {
    setSelectedScreen((prev: number) => {
      if (prev === DISCOVERY_TAB_NEWS) __handleSelectedTabClickedFromNewsScreen(index);

      return index;
    });
  };

  const onOpenLinkPressed = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_OPEN_LINK_CLICKED
    );
  };

  const onOpenLinkContextScreen = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_OPEN_LINK_CONTEXT_SCREEN
    );
  };

  const onClearRecentSearch = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_CLEAR_RECENT_SEARCH_CLICKED
    );
  };

  const onRecentSearchItemClicked = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_RECENT_SEARCH_CLICKED
    );
  };

  return {
    common: {
      onSearchCommunityPressed,
      onBackButtonPressed,
      onTabClicked
    },
    news: {
      onOpenLinkPressed,
      onOpenLinkContextScreen,
      onClearRecentSearch,
      onRecentSearchItemClicked
    }
  };
};

export default useDiscoveryScreenAnalyticsHook;
