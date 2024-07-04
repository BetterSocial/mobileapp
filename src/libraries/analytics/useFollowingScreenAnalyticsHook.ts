import AnalyticsEventTracking, {
  BetterSocialEventTracking as trackEnum
} from './analyticsEventTracking';

export type UseFollowingScreenAnalyticsHook = {
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

const useFollowingScreenAnalyticsHook = (): UseFollowingScreenAnalyticsHook => {
  const track = AnalyticsEventTracking.eventTrack;
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

  return {
    onSearchBarClicked,
    onBackButtonClicked,
    onDeleteSearchClicked,
    onUserItemClicked,
    onUserItemFollow,
    onUserItemUnfollow,
    onUserItemSuggestedUnfollow,
    onUserItemSuggestedFollow,
    onUserItemSuggestedClicked
  };
};

export default useFollowingScreenAnalyticsHook;
