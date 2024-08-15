import AnalyticsEventTracking, {
  BetterSocialEventTracking as trackEnum
} from './analyticsEventTracking';

export type FollowerScreenAnalyticsEventTracking = {
  onSearchBarClicked: () => void;
  onDeleteSearchClicked: () => void;
  onUserItemClicked: () => void;
  onBackButtonClicked: () => void;
  onUserItemFollow: () => void;
  onUserItemUnfollow: () => void;
};

const useFollowerScreenAnalyticsHook = () => {
  const track = AnalyticsEventTracking.eventTrack;
  const onSearchBarClicked = () => {
    track(trackEnum.FOLLOWER_SCREEN_SEARCH_BAR_CLICKED);
  };
  const onDeleteSearchClicked = () => {
    track(trackEnum.FOLLOWER_SCREEN_DELETE_SEARCH_CLICKED);
  };
  const onUserItemClicked = () => {
    track(trackEnum.FOLLOWER_SCREEN_USER_ITEM_CLICKED);
  };
  const onBackButtonClicked = () => {
    track(trackEnum.FOLLOWER_SCREEN_BACK_BUTTON_CLICKED);
  };
  const onUserItemFollow = () => {
    track(trackEnum.FOLLOWER_SCREEN_USER_ITEM_FOLLOW);
  };
  const onUserItemUnfollow = () => {
    track(trackEnum.FOLLOWER_SCREEN_USER_ITEM_UNFOLLOW);
  };

  return {
    onSearchBarClicked,
    onDeleteSearchClicked,
    onUserItemClicked,
    onBackButtonClicked,
    onUserItemFollow,
    onUserItemUnfollow
  };
};

export default useFollowerScreenAnalyticsHook;
