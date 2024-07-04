import AnalyticsEventTracking, {
  BetterSocialEventTracking as trackEnum
} from './analyticsEventTracking';

export type ProfileScreenAnalyticsEventTracking = {
  onEditBioClicked: () => void;
  onSaveBioClicked: () => void;
  onShareUserClicked: () => void;
  onSettingsClicked: () => void;
  onShareLinkClicked: () => void;
  onAllowAllAnonMessagesClicked: () => void;
  onAllowAnonMessagesFollowedClicked: () => void;
  onProfilePicClicked: () => void;
  onProfileLibraryClicked: () => void;
  onProfilePhotoClicked: () => void;
  onRemoveCurrentProfilePicClicked: () => void;
  onViewProfilePictureClicked: () => void;
  onBannerClosed: () => void;
  onSignedPostTabClicked: () => void;
  onAnonPostTabClicked: () => void;
  onFollowerClicked: () => void;
  onFollowingClicked: () => void;
};

const useProfileScreenAnalyticsHook = (): ProfileScreenAnalyticsEventTracking => {
  const track = AnalyticsEventTracking.eventTrack;
  const onEditBioClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_EDIT_BIO_CLICKED);
  };
  const onSaveBioClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_EDIT_BIO_SAVE_PROMPT_CLICKED);
  };
  const onShareUserClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_SHARE_USER_CLICKED);
  };
  const onSettingsClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_SETTINGS_CLICKED);
  };
  const onShareLinkClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_SHARE_LINK_CLICKED);
  };
  const onAllowAllAnonMessagesClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_ALLOW_ALL_ANON_MESSAGES_CLICKED);
  };
  const onAllowAnonMessagesFollowedClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_ALLOW_ANON_MESSAGES_FOLLOWED_CLICKED);
  };
  const onProfilePicClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_PROFILE_PIC_OPEN_BANNER);
  };
  const onViewProfilePictureClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_PROFILE_PIC_VIEW_PROFILE_PIC);
  };
  const onProfileLibraryClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_PROFILE_LIBRARY_CLICKED);
  };
  const onProfilePhotoClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_PROFILE_PHOTO_CLICKED);
  };
  const onRemoveCurrentProfilePicClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_PROFILE_REMOVE_CURRENT_CLICKED);
  };
  const onBannerClosed = () => {
    track(trackEnum.MY_PROFILE_HEADER_PROFILE_BANNER_CLOSED);
  };
  const onSignedPostTabClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_SIGNED_POST_TAB_CLICKED);
  };
  const onAnonPostTabClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_ANON_POST_TAB_CLICKED);
  };
  const onFollowerClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_FOLLOWER_CLICKED);
  };
  const onFollowingClicked = () => {
    track(trackEnum.MY_PROFILE_HEADER_FOLLOWING_CLICKED);
  };

  return {
    onEditBioClicked,
    onSaveBioClicked,
    onShareUserClicked,
    onSettingsClicked,
    onShareLinkClicked,
    onAllowAllAnonMessagesClicked,
    onAllowAnonMessagesFollowedClicked,
    onProfilePicClicked,
    onProfileLibraryClicked,
    onProfilePhotoClicked,
    onRemoveCurrentProfilePicClicked,
    onViewProfilePictureClicked,
    onBannerClosed,
    onSignedPostTabClicked,
    onAnonPostTabClicked,
    onFollowerClicked,
    onFollowingClicked
  };
};

export default useProfileScreenAnalyticsHook;
