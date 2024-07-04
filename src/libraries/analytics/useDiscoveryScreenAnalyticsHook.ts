import {useRoute} from '@react-navigation/core';

import useFollowingScreenAnalyticsHook from './useFollowingScreenAnalyticsHook';
import AnalyticsEventTracking, {BetterSocialEventTracking} from './analyticsEventTracking';
import {
  DISCOVERY_TAB_DOMAINS,
  DISCOVERY_TAB_NEWS,
  DISCOVERY_TAB_TOPICS,
  DISCOVERY_TAB_USERS
} from '../../utils/constants';

export type DiscoveryScreenFragments = 'news' | 'domain' | 'topic' | 'user';
export type DiscoveryScreenAnalyticsHook = {
  common: {
    onSearchCommunityPressed: () => void;
    onBackButtonPressed: () => void;
    onTabClicked: (index: number) => void;
    onCommonClearRecentSearch: (from: DiscoveryScreenFragments) => void;
    onCommonRecentItemClicked: (from: DiscoveryScreenFragments) => void;
  };
  topic: {
    onFollowUnfollow: (willFollow: boolean, section: string) => void;
    onTopicPressed: (section: 'your-communities' | 'suggested-communities') => void;
    onStartNewCommunityAnalyticsPressed: () => void;
  };
  news: {
    onOpenLinkPressed: () => void;
    onOpenLinkContextScreen: () => void;
    onClearRecentSearch: () => void;
    onRecentSearchItemClicked: () => void;
  };
  domain: {
    onDomainPageOpened: (from: 'your-domain' | 'suggested-domain') => void;
    onDomainPageFollowButtonClicked: (from: 'your-domain' | 'suggested-domain') => void;
    onDomainPageUnfollowButtonClicked: (from: 'your-domain' | 'suggested-domain') => void;
  };
  user: {
    onUserPageOpened: (from: 'your-user' | 'suggested-user') => void;
    onUserPageFollowButtonClicked: (from: 'your-user' | 'suggested-user') => void;
    onUserPageUnfollowButtonClicked: (from: 'your-user' | 'suggested-user') => void;
  };
};

const FOLLOWING_SCREEN_ROUTE_NAME = 'Followings';

const useDiscoveryScreenAnalyticsHook = (
  selectedScreen: number,
  setSelectedScreen: (number) => void
) => {
  const route = useRoute();

  // FOLLOWING SCREEN ANALYTICS
  const {
    onBackButtonClicked,
    onDeleteSearchClicked,
    onUserItemClicked,
    onUserItemFollow,
    onUserItemSuggestedFollow,
    onUserItemSuggestedClicked,
    onSearchBarClicked
  } = useFollowingScreenAnalyticsHook();

  // Common Discovery Screen
  const onSearchCommunityPressed = () => {
    if (route.name === FOLLOWING_SCREEN_ROUTE_NAME && selectedScreen === DISCOVERY_TAB_USERS) {
      return onSearchBarClicked();
    }

    if (selectedScreen === DISCOVERY_TAB_TOPICS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_SEARCHED_COMMUNITY_CLICKED
      );
    } else if (selectedScreen === DISCOVERY_TAB_NEWS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_SEARCH_NEWS_CLICKED
      );
    } else if (selectedScreen === DISCOVERY_TAB_DOMAINS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_SEARCH_DOMAIN_CLICKED
      );
    } else if (selectedScreen === DISCOVERY_TAB_USERS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_SEARCH_USER_CLICKED
      );
    }
  };

  const onBackButtonPressed = () => {
    if (route.name === FOLLOWING_SCREEN_ROUTE_NAME && selectedScreen === DISCOVERY_TAB_USERS) {
      return onBackButtonClicked();
    }

    if (selectedScreen === DISCOVERY_TAB_NEWS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_BACK_BUTTON_CLICKED
      );
    } else if (selectedScreen === DISCOVERY_TAB_DOMAINS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_BACK_BUTTON_CLICKED
      );
    } else if (selectedScreen === DISCOVERY_TAB_USERS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_BACK_BUTTON_CLICKED
      );
    }
  };

  const __handleSelectedTabClickedFromNewsFragment = (index: number) => {
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

  const __handleSelectedTabClickedFromDomainFragment = (index: number) => {
    if (index === DISCOVERY_TAB_USERS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_USERS_TAB_CLICKED
      );
    } else if (index === DISCOVERY_TAB_TOPICS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_COMMUNITY_TAB_CLICKED
      );
    } else if (index === DISCOVERY_TAB_NEWS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_NEWS_TAB_CLICKED
      );
    }
  };

  const __handleSelectedTabClickedFromUserFragment = (index: number) => {
    if (index === DISCOVERY_TAB_DOMAINS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_DOMAINS_TAB_CLICKED
      );
    } else if (index === DISCOVERY_TAB_TOPICS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_COMMUNITY_TAB_CLICKED
      );
    } else if (index === DISCOVERY_TAB_NEWS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_NEWS_TAB_CLICKED
      );
    }
  };

  const __handleSelectedTabClickedFromFollowingUserFragment = (index: number) => {
    if (index === DISCOVERY_TAB_DOMAINS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.FOLLOWING_SCREEN_USERS_TAB_DOMAIN_TAB_CLICKED
      );
    } else if (index === DISCOVERY_TAB_TOPICS) {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.FOLLOWING_SCREEN_USERS_TAB_COMMUNITY_TAB_CLICKED
      );
    }
  };

  const onTabClicked = (index: number) => {
    setSelectedScreen((prev: number) => {
      if (route.name === FOLLOWING_SCREEN_ROUTE_NAME && selectedScreen === DISCOVERY_TAB_USERS)
        __handleSelectedTabClickedFromFollowingUserFragment(index);
      else if (prev === DISCOVERY_TAB_NEWS) __handleSelectedTabClickedFromNewsFragment(index);
      else if (prev === DISCOVERY_TAB_DOMAINS) __handleSelectedTabClickedFromDomainFragment(index);
      else if (prev === DISCOVERY_TAB_USERS) __handleSelectedTabClickedFromUserFragment(index);

      return index;
    });
  };

  const onCommonClearRecentSearch = (from: DiscoveryScreenFragments) => {
    if (from === 'news') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_CLEAR_RECENT_SEARCH_CLICKED
      );
    } else if (from === 'domain') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_CLEAR_RECENT_SEARCH_CLICKED
      );
    } else if (from === 'topic') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_CLEAR_RECENT_SEARCH_CLICKED
      );
    } else if (from === 'user') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_CLEAR_RECENT_SEARCH_CLICKED
      );
    }
  };

  const onCommonRecentItemClicked = (from: DiscoveryScreenFragments) => {
    if (from === 'news') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_NEWS_RECENT_SEARCH_CLICKED
      );
    } else if (from === 'domain') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_RECENT_SEARCH_CLICKED
      );
    } else if (from === 'topic') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_RECENT_SEARCH_CLICKED
      );
    } else if (from === 'user') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_RECENT_SEARCH_CLICKED
      );
    }
  };

  const onCommonSearchBarDeletedClicked = (from: DiscoveryScreenFragments) => {
    if (route.name === FOLLOWING_SCREEN_ROUTE_NAME && selectedScreen === DISCOVERY_TAB_USERS) {
      onDeleteSearchClicked();
    }
  };

  // Topic Discovery Screen
  const onFollowUnfollow = (willFollow: boolean, section: string) => {
    if (willFollow && section === 'your-communities') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_YOUR_COMMUNITY_JOIN
      );
    }

    if (!willFollow && section === 'your-communities') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_YOUR_COMMUNITY_LEFT
      );
    }

    if (willFollow && section === 'suggested-communities') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_SUGGESTED_COMMUNITY_JOIN
      );
    }

    if (!willFollow && section === 'suggested-communities') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_SUGGESTED_COMMUNITY_LEFT
      );
    }
  };

  const onTopicPressed = (section: 'your-communities' | 'suggested-communities') => {
    if (section === 'your-communities') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_YOUR_COMMUNITY_OPENED
      );
    } else if (section === 'suggested-communities') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_SUGGESTED_COMMUNITY_OPENED
      );
    }
  };

  const onStartNewCommunityAnalyticsPressed = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_COMMUNITY_OPEN_CREATE_COMMUNITY
    );
  };

  // News Discovery Screen
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

  // Domain Discovery Screen
  const onDomainPageOpened = (from: 'your-domain' | 'suggested-domain') => {
    if (from === 'your-domain') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_YOUR_DOMAIN_OPENED
      );
    } else if (from === 'suggested-domain') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_SUGGESTED_DOMAIN_OPENED
      );
    }
  };

  const onDomainPageFollowButtonClicked = (from: 'your-domain' | 'suggested-domain') => {
    if (from === 'suggested-domain') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_SUGGESTED_DOMAIN_JOIN
      );
    }
  };

  const onDomainPageUnfollowButtonClicked = (from: 'your-domain' | 'suggested-domain') => {
    if (from === 'suggested-domain') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_DOMAIN_SUGGESTED_DOMAIN_LEFT
      );
    }
  };

  // Users Discovery Screen
  const onUserPageOpened = (from: 'your-user' | 'suggested-user') => {
    if (
      route.name === FOLLOWING_SCREEN_ROUTE_NAME &&
      selectedScreen === DISCOVERY_TAB_USERS &&
      from === 'your-user'
    ) {
      return onUserItemClicked();
    }

    if (
      route.name === FOLLOWING_SCREEN_ROUTE_NAME &&
      selectedScreen === DISCOVERY_TAB_USERS &&
      from === 'suggested-user'
    ) {
      return onUserItemSuggestedClicked();
    }

    if (from === 'your-user') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_YOUR_USER_OPENED
      );
    } else if (from === 'suggested-user') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_SUGGESTED_USER_OPENED
      );
    }
  };

  const onUserPageFollowButtonClicked = (from: 'your-user' | 'suggested-user') => {
    if (
      route.name === FOLLOWING_SCREEN_ROUTE_NAME &&
      selectedScreen === DISCOVERY_TAB_USERS &&
      from === 'your-user'
    ) {
      return onUserItemFollow();
    }

    if (
      route.name === FOLLOWING_SCREEN_ROUTE_NAME &&
      selectedScreen === DISCOVERY_TAB_USERS &&
      from === 'suggested-user'
    ) {
      return onUserItemSuggestedFollow();
    }

    if (from === 'suggested-user') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_SUGGESTED_USER_FOLLOWED
      );
    } else if (from === 'your-user') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_YOUR_USER_FOLLOWED
      );
    }
  };

  const onUserPageUnfollowButtonClicked = (from: 'your-user' | 'suggested-user') => {
    if (from === 'suggested-user') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_SUGGESTED_USER_UNFOLLOWED
      );
    } else if (from === 'your-user') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.DISCOVERY_SCREEN_SEARCH_USERS_YOUR_USER_UNFOLLOWED
      );
    }
  };

  return {
    common: {
      onSearchCommunityPressed,
      onBackButtonPressed,
      onTabClicked,
      onCommonClearRecentSearch,
      onCommonRecentItemClicked,
      onCommonSearchBarDeletedClicked
    },
    topic: {
      onFollowUnfollow,
      onTopicPressed,
      onStartNewCommunityAnalyticsPressed
    },
    news: {
      onOpenLinkPressed,
      onOpenLinkContextScreen,
      onClearRecentSearch,
      onRecentSearchItemClicked
    },
    domain: {
      onDomainPageOpened,
      onDomainPageFollowButtonClicked,
      onDomainPageUnfollowButtonClicked
    },
    user: {
      onUserPageOpened,
      onUserPageFollowButtonClicked,
      onUserPageUnfollowButtonClicked
    }
  };
};

export default useDiscoveryScreenAnalyticsHook;
