import AnalyticsEventTracking, {
  BetterSocialEventTracking as trackEnum
} from './analyticsEventTracking';

export type UseFollowingScreenAnalyticsHook = {
  // USERS FRAGMENT TAB
  user: {
    onSearchBarClicked: () => void;
    onBackButtonClicked: () => void;
    onDeleteSearchClicked: () => void;
    onUserItemClicked: () => void;
    onUserItemFollow: () => void;
    onUserItemUnfollow: () => void;
    onUserItemSuggestedClicked: () => void;
    onUserItemSuggestedFollow: () => void;
    onUserItemSuggestedUnfollow: () => void;
  };

  // COMMUNITY FRAGMENT TAB
  community: {
    onFollowingScreenCommunitySearchClicked: () => void;
    onFollowingScreenCommunityBackButtonClicked: () => void;
    onFollowingScreenCommunityDeleteSearchClicked: () => void;
    onFollowingScreenCommunityCreateCommunityClicked: () => void;
    onFollowingScreenYourCommunityFollowed: () => void;
    onFollowingScreenYourCommunityUnfollowed: () => void;
    onFollowingScreenYourCommunityClicked: () => void;
    onFollowingScreenSuggestedCommunityClicked: () => void;
    onFollowingScreenSuggestedCommunityFollow: () => void;
    onFollowingScreenSuggestedCommunityUnfollow: () => void;
  };
};

const useFollowingScreenAnalyticsHook = (): UseFollowingScreenAnalyticsHook => {
  const track = AnalyticsEventTracking.eventTrack;
  // USERS FRAGMENT TAB
  const onSearchBarClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_SEARCH_BAR_CLICKED);
  };

  const onBackButtonClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_BACK_BUTTON_CLICKED);
  };

  const onDeleteSearchClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_SEARCH_BAR_DELETED);
  };

  const onUserItemClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_USERS_TAB_ITEM_CLICKED);
  };

  const onUserItemFollow = () => {
    track(trackEnum.FOLLOWING_SCREEN_USERS_TAB_ITEM_FOLLOWED);
  };

  const onUserItemUnfollow = () => {
    track(trackEnum.FOLLOWING_SCREEN_USERS_TAB_ITEM_UNFOLLOWED);
  };

  const onUserItemSuggestedClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_USERS_TAB_SUGGESTED_ITEM_CLICKED);
  };

  const onUserItemSuggestedFollow = () => {
    track(trackEnum.FOLLOWING_SCREEN_USERS_TAB_SUGGESTED_ITEM_FOLLOWED);
  };

  const onUserItemSuggestedUnfollow = () => {
    track(trackEnum.FOLLOWING_SCREEN_USERS_TAB_SUGGESTED_ITEM_CLICKED);
  };

  // COMMUNITY FRAGMENT TAB
  const onFollowingScreenCommunitySearchClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_SEARCH_CLICKED);
  };

  const onFollowingScreenCommunityBackButtonClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_BACK_BUTTON_CLICKED);
  };

  const onFollowingScreenCommunityDeleteSearchClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_DELETE_SEARCH_CLICKED);
  };

  const onFollowingScreenCommunityCreateCommunityClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_CREATE_COMMUNITY_CLICKED);
  };

  const onFollowingScreenYourCommunityFollowed = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_YOUR_COMMUNITY_FOLLOWED);
  };

  const onFollowingScreenYourCommunityUnfollowed = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_YOUR_COMMUNITY_UNFOLLOWED);
  };

  const onFollowingScreenYourCommunityClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_YOUR_COMMUNITY_CLICKED);
  };

  const onFollowingScreenSuggestedCommunityClicked = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_SUGGESTED_COMMUNITY_CLICKED_OPEN_PAGE);
  };

  const onFollowingScreenSuggestedCommunityFollow = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_SUGGESTED_COMMUNITY_JOIN_CLICKED);
  };

  const onFollowingScreenSuggestedCommunityUnfollow = () => {
    track(trackEnum.FOLLOWING_SCREEN_COMMUNITY_TAB_SUGGESTED_COMMUNITY_UNJOIN_CLICKED);
  };

  return {
    // USERS FRAGMENT TAB
    user: {
      onSearchBarClicked,
      onBackButtonClicked,
      onDeleteSearchClicked,
      onUserItemClicked,
      onUserItemFollow,
      onUserItemUnfollow,
      onUserItemSuggestedUnfollow,
      onUserItemSuggestedFollow,
      onUserItemSuggestedClicked
    },
    community: {
      onFollowingScreenCommunitySearchClicked,
      onFollowingScreenCommunityBackButtonClicked,
      onFollowingScreenCommunityDeleteSearchClicked,
      onFollowingScreenCommunityCreateCommunityClicked,
      onFollowingScreenYourCommunityFollowed,
      onFollowingScreenYourCommunityUnfollowed,
      onFollowingScreenYourCommunityClicked,
      onFollowingScreenSuggestedCommunityClicked,
      onFollowingScreenSuggestedCommunityFollow,
      onFollowingScreenSuggestedCommunityUnfollow
    }
  };
};

export default useFollowingScreenAnalyticsHook;
