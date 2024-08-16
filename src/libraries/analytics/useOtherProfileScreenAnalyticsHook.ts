import AnalyticsEventTracking, {
  BetterSocialEventTracking as trackEnum
} from './analyticsEventTracking';

const useOtherProfileScreenAnalyticsHook = () => {
  const track = AnalyticsEventTracking.eventTrack;

  const onDownvoteInserted = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_POST_DOWNVOTE_INSERTED);
  };

  const onDownvoteRemoved = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_POST_DOWNVOTE_REMOVED);
  };

  const onUpvoteInserted = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_POST_UPVOTE_INSERTED);
  };

  const onUpvoteRemoved = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_POST_UPVOTE_REMOVED);
  };

  const onReplyButtonClicked = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_POST_ON_REPLY_BUTTON_CLICKED);
  };

  const onPostOptionClicked = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_POST_OPTION_CLICKED);
  };

  const onShareButtonClicked = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_POST_OPTION_SHARE_LINK);
  };

  const onShareUserButtonClicked = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_HEADER_SHARE_USER_CLICKED);
  };

  const onDmButtonClicked = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_POST_DM_BUTTON_CLICKED);
  };

  const onHeaderFollowUser = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_HEADER_USER_FOLLOW);
  };

  const onHeaderUnfollowUser = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_HEADER_USER_UNFOLLOW);
  };

  const onBioAnonButtonOn = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_BIO_ANON_BUTTON_ON);
  };

  const onBioAnonButtonOff = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_BIO_ANON_BUTTON_OFF);
  };

  const onBioSendDm = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_BIO_SEND_DM);
  };

  const onPostBlockButtonClicked = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_POST_BLOCK_BUTTON_CLICKED);
  };

  const onBlockUserBottomSheetClosed = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_BLOCK_USER_BOTTOM_SHEET_CLOSED);
  };

  const onBlockUserBlockAndReportClicked = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_BLOCK_USER_BLOCK_AND_REPORT_CLICKED);
  };

  const onBlockUserBlockIndefinitelyClicked = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_BLOCK_USER_BLOCK_INDEFINITELY_CLICKED);
  };

  const onBlockUserBlockAndReportReason = (v) => {
    track(trackEnum.OTHER_PROFILE_SCREEN_BLOCK_USER_BLOCK_AND_REPORT_REASON, v);
  };

  const onBlockUserReportInfoSubmitted = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_BLOCK_USER_REPORT_INFO_SUBMITTED);
  };

  const onBlockUserReportInfoSkipped = () => {
    track(trackEnum.OTHER_PROFILE_SCREEN_BLOCK_USER_REPORT_INFO_SKIPPED);
  };

  return {
    onDownvoteInserted,
    onDownvoteRemoved,
    onUpvoteInserted,
    onUpvoteRemoved,
    onReplyButtonClicked,
    onPostOptionClicked,
    onShareButtonClicked,
    onShareUserButtonClicked,
    onDmButtonClicked,
    onHeaderFollowUser,
    onHeaderUnfollowUser,
    onBioAnonButtonOn,
    onBioAnonButtonOff,
    onBioSendDm,
    onPostBlockButtonClicked,
    onBlockUserBottomSheetClosed,
    onBlockUserBlockAndReportClicked,
    onBlockUserBlockIndefinitelyClicked,
    onBlockUserBlockAndReportReason,
    onBlockUserReportInfoSubmitted,
    onBlockUserReportInfoSkipped
  };
};

export default useOtherProfileScreenAnalyticsHook;
