import AnalyticsEventTracking, {
  BetterSocialEventTracking as trackEnum
} from './analyticsEventTracking';

export type useCreateCommunityScreenAnalyticsHookType = {
  onCreateCommunityScreenNameNextButtonOpenCCCustomizePage: () => void;
  onCreateCommunityScreenBackButtonClicked: () => void;
  onCreateCommunityScreenChangeIconButtonClicked: () => void;
  onCreateCommunityScreenChangeCommunityCoverButtonClicked: () => void;
  onCreateCommunityScreenSearchUserClicked: () => void;
  onCreateCommunityScreenNextButtonOpenCreatePostFlow: () => void;
  onCreateCommunityScreenShareInvitationLinkButtonOpenExternalSharingPage: () => void;
  onCreateCommunityScreenExternalSharingCancelButtonClicked: () => void;
  onCreateCommunityScreenNextButtonOpenCCInternalSharePage: () => void;
  onCreateCommunityScreenUserNameSelected: () => void;
  onCreateCommunityScreenUserNameUnselected: () => void;
};

const useCreateCommunityScreenAnalyticsHook = (): useCreateCommunityScreenAnalyticsHookType => {
  const {eventTrack} = AnalyticsEventTracking;

  const onCreateCommunityScreenNameNextButtonOpenCCCustomizePage = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_NAME_NEXT_BUTTON_OPEN_CC_CUSTOMIZE_PAGE);
  };

  const onCreateCommunityScreenBackButtonClicked = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_BACK_BUTTON_CLICKED);
  };

  const onCreateCommunityScreenChangeIconButtonClicked = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_CHANGE_ICON_BUTTON_CLICKED);
  };

  const onCreateCommunityScreenChangeCommunityCoverButtonClicked = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_CHANGE_COMMUNITY_COVER_BUTTON_CLICKED);
  };

  const onCreateCommunityScreenSearchUserClicked = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_SEARCH_USER_CLICKED);
  };

  const onCreateCommunityScreenNextButtonOpenCreatePostFlow = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_NEXT_BUTTON_OPEN_CREATE_POST_FLOW);
  };

  const onCreateCommunityScreenShareInvitationLinkButtonOpenExternalSharingPage = () => {
    eventTrack(
      trackEnum.CREATE_COMMUNITY_SCREEN_SHARE_INVITATION_LINK_BUTTON_OPEN_EXTERNAL_SHARING_PAGE
    );
  };

  const onCreateCommunityScreenExternalSharingCancelButtonClicked = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_EXTERNAL_SHARING_CANCEL_BUTTON_CLICKED);
  };

  const onCreateCommunityScreenNextButtonOpenCCInternalSharePage = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_NEXT_BUTTON_OPEN_CC_INTERNAL_SHARE_PAGE);
  };

  const onCreateCommunityScreenUserNameSelected = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_USER_NAME_SELECTED);
  };

  const onCreateCommunityScreenUserNameUnselected = () => {
    eventTrack(trackEnum.CREATE_COMMUNITY_SCREEN_USER_NAME_UNSELECTED);
  };

  return {
    onCreateCommunityScreenNameNextButtonOpenCCCustomizePage,
    onCreateCommunityScreenBackButtonClicked,
    onCreateCommunityScreenChangeIconButtonClicked,
    onCreateCommunityScreenChangeCommunityCoverButtonClicked,
    onCreateCommunityScreenSearchUserClicked,
    onCreateCommunityScreenNextButtonOpenCreatePostFlow,
    onCreateCommunityScreenShareInvitationLinkButtonOpenExternalSharingPage,
    onCreateCommunityScreenExternalSharingCancelButtonClicked,
    onCreateCommunityScreenNextButtonOpenCCInternalSharePage,
    onCreateCommunityScreenUserNameSelected,
    onCreateCommunityScreenUserNameUnselected
  };
};

export default useCreateCommunityScreenAnalyticsHook;
