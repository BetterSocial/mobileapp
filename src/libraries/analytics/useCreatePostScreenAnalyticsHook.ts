import {useRoute} from '@react-navigation/core';

import AnalyticsEventTracking, {
  BetterSocialEventTracking as trackEnum
} from './analyticsEventTracking';

export type useCreatePostScreenAnalyticsHook = {
  onAnonButtonOn: () => void;
  onAnonButtonOff: () => void;
  onBackButtonClicked: () => void;
  onProfileButtonClicked: () => void;
  onTextBoxTyped: (text: string) => void;
  onAddMediaPollButtonClicked: () => void;
  onAddMediaPollPageAddPollClicked: () => void;
  onPollSectionDurationButtonClicked: () => void;
  onSetPollDurationSetButtonClicked: () => void;
  onSetPollDurationCancelClicked: () => void;
  onSetPollDurationChangeDaysSet: (days: number) => void;
  onSetPollDurationChangeHoursSet: (hours: number) => void;
  onSetPollDurationChangeMinutesSet: (minutes: number) => void;
  onPollSectionMultipleChoiceButtonOn: () => void;
  onPollSectionMultipleChoiceButtonOff: () => void;
  onPollSectionRemovePollButtonClicked: () => void;
  onAddMediaPollUploadFromLibClicked: () => void;
  onAddMediaPollTakePhotoClicked: () => void;
  onPhotoUploadedRemoveAllPhotosClicked: () => void;
  onPhotoUploadedXButtonClicked: () => void;
  onPhotoUploadedAddMorePhotosPhotoRemoved: (photos: string[]) => void;
  onAdSetAddCommunitiesOpenCommunityTags: () => void;
  onCommunityTags: (tags: string[]) => void;
  onCommunityTagsSaveButtonClicked: () => void;
  onCommunityTagsCancelClicked: () => void;
  onAdSetExpirationButtonOpenExpirationSetting: () => void;
  onExpirationSettingCancelClicked: () => void;
  onExpirationSettingChoice24HrClicked: () => void;
  onExpirationSettingChoice7DaysClicked: () => void;
  onExpirationSettingChoice30DaysClicked: () => void;
  onExpirationSettingChoiceNeverClicked: () => void;
  onPostButtonEmptyAlerted: () => void;
  onPostButtonOpenMainFeed: () => void;
  onAddCommunityButtonOpenAddComms: () => void;
  onAddCommsAddedCommNewCommAdded: (community: string) => void;
  onAddCommsDeleteCommCommDeleted: (community: string) => void;
  onAddCommsSaveCommsUpdated: (communities: string[]) => void;
  onAddCommsExitClicked: () => void;
};

export type CreatePostNavigationParams = {
  isCreateCommunity: boolean;
  followType?: string;
  topic?: string;
};

const useCreatePostScreenAnalyticsHook = (): useCreatePostScreenAnalyticsHook => {
  const {params} = useRoute();
  const isFromCommunity = (params as CreatePostNavigationParams)?.isCreateCommunity;
  const track = (regularEvent: trackEnum, communityEvent?: trackEnum, additionalData?: any) => {
    if (isFromCommunity && communityEvent) {
      return AnalyticsEventTracking.eventTrack(communityEvent, additionalData);
    }

    return AnalyticsEventTracking.eventTrack(regularEvent, additionalData);
  };

  const onAnonButtonOn = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_ANON_BUTTON_ON,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ANON_ON
    );
  };

  const onAnonButtonOff = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_ANON_BUTTON_OFF,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ANON_OFF
    );
  };

  const onBackButtonClicked = () => {
    track(
      trackEnum.UNDEFINED_EVENT,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_BACK_BUTTON_CLICKED
    );
  };

  const onProfileButtonClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_PROFILE_BUTTON_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_PROFILE_BUTTON_CLICKED
    );
  };

  const onTextBoxTyped = (text: string) => {
    track(
      trackEnum.CREATE_POST_SCREEN_TEXT_BOX_TYPED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_TEXT_BOX_TYPED,
      {text}
    );
  };

  const onAddMediaPollButtonClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_ADD_MEDIA_POLL_BUTTON_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_MEDIA_OR_POLL_BUTTON_POST_TYPE_BANNER_OPENED
    );
  };

  const onAddMediaPollPageAddPollClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_ADD_MEDIA_POLL_PAGE_ADD_POLL_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_MEDIA_OR_POLL_BUTTON_POST_TYPE_BANNER_OPENED
    );
  };

  const onPollSectionDurationButtonClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_POLL_SECTION_DURATION_BUTTON_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_TYPE_BANNER_NON_SELECTED
    );
  };

  const onSetPollDurationSetButtonClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_SET_POLL_DURATION_SET_BUTTON_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_TYPE_BANNER_NON_SELECTED
    );
  };

  const onSetPollDurationCancelClicked = () => {
    track(trackEnum.CREATE_POST_SCREEN_SET_POLL_DURATION_CANCEL_CLICKED);
  };

  const onSetPollDurationChangeDaysSet = (days: number) => {
    track(
      trackEnum.CREATE_POST_SCREEN_SET_POLL_DURATION_CHANGE_DAYS_SET,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_SET_POLL_DURATION_CHANGE_DAYS_SET,
      {days}
    );
  };

  const onSetPollDurationChangeHoursSet = (hours: number) => {
    track(
      trackEnum.CREATE_POST_SCREEN_SET_POLL_DURATION_CHANGE_HOURS_SET,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_SET_POLL_DURATION_CHANGE_HOURS_SET,
      {hours}
    );
  };

  const onSetPollDurationChangeMinutesSet = (minutes: number) => {
    track(
      trackEnum.CREATE_POST_SCREEN_SET_POLL_DURATION_CHANGE_MINUTES_SET,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_SET_POLL_DURATION_CHANGE_MINUTES_SET,
      {minutes}
    );
  };

  const onPollSectionMultipleChoiceButtonOn = () => {
    track(trackEnum.CREATE_POST_SCREEN_POLL_SECTION_MULTIPLE_CHOICE_BUTTON_ON);
  };

  const onPollSectionMultipleChoiceButtonOff = () => {
    track(trackEnum.CREATE_POST_SCREEN_POLL_SECTION_MULTIPLE_CHOICE_BUTTON_OFF);
  };

  const onPollSectionRemovePollButtonClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_POLL_SECTION_REMOVE_POLL_BUTTON_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_REMOVE_POLL_CLICKED
    );
  };

  const onAddMediaPollUploadFromLibClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_ADD_MEDIA_POLL_UPLOAD_FROM_LIB_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_UPLOAD_PHOTO_BANNER_UPLOAD_MEDIA
    );
  };

  const onAddMediaPollTakePhotoClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_ADD_MEDIA_POLL_TAKE_PHOTO_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_UPLOAD_PHOTO_BANNER_TAKE_PHOTO
    );
  };

  const onPhotoUploadedRemoveAllPhotosClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_PHOTO_UPLOADED_REMOVE_ALL_PHOTOS_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_PHOTO_UPLOADED_REMOVE_ALL_PHOTOS_CLICKED
    );
  };

  const onPhotoUploadedXButtonClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_PHOTO_UPLOADED_X_BUTTON_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_PHOTO_UPLOADED_X_BUTTON_CLICKED
    );
  };

  const onPhotoUploadedAddMorePhotosPhotoRemoved = (photos) => {
    track(
      trackEnum.CREATE_POST_SCREEN_PHOTO_UPLOADED_ADD_MORE_PHOTOS_PHOTO_REMOVED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_PHOTO_UPLOADED_ADD_MORE_PHOTOS_UPLOAD_PHOTO_BANNER
    );
  };

  const onAdSetAddCommunitiesOpenCommunityTags = () => {
    track(trackEnum.CREATE_POST_SCREEN_AD_SET_ADD_COMMUNITIES_OPEN_COMMUNITY_TAGS);
  };

  const onCommunityTags = (tags: string[]) => {
    track(trackEnum.CREATE_POST_SCREEN_COMMUNITY_TAGS);
  };

  const onCommunityTagsSaveButtonClicked = () => {
    track(trackEnum.CREATE_POST_SCREEN_COMMUNITY_TAGS_SAVE_BUTTON_CLICKED);
  };

  const onCommunityTagsCancelClicked = () => {
    track(trackEnum.CREATE_POST_SCREEN_COMMUNITY_TAGS_CANCEL_CLICKED);
  };

  const onAdSetExpirationButtonOpenExpirationSetting = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_AD_SET_EXPIRATION_BUTTON_OPEN_EXPIRATION_SETTING,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_BUTTON_OPEN_POST_DURATION
    );
  };

  const onExpirationSettingCancelClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_EXPIRATION_SETTING_CANCEL_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_CANCEL_CLICKED
    );
  };

  const onExpirationSettingChoice24HrClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_EXPIRATION_SETTING_CHOICE_24HR_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_SET_24_HOURS_CLICKED
    );
  };

  const onExpirationSettingChoice7DaysClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_EXPIRATION_SETTING_CHOICE_7DAYS_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_SET_7_DAYS_CLICKED
    );
  };

  const onExpirationSettingChoice30DaysClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_EXPIRATION_SETTING_CHOICE_30DAYS_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_SET_30_DAYS_CLICKED
    );
  };

  const onExpirationSettingChoiceNeverClicked = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_EXPIRATION_SETTING_CHOICE_NEVER_CLICKED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_SET_NEVER_CLICKED
    );
  };

  const onPostButtonEmptyAlerted = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_POST_BUTTON_EMPTY_ALERTED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_BUTTON_EMPTY_ALERTED
    );
  };

  const onPostButtonOpenMainFeed = () => {
    track(
      trackEnum.CREATE_POST_SCREEN_POST_BUTTON_OPEN_MAIN_FEED,
      trackEnum.CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_AND_CREATE_COMMUNITY_CREATED
    );
  };

  const onAddCommunityButtonOpenAddComms = () => {
    console.log('onAddCommunityButtonOpenAddComms');
  };

  const onAddCommsAddedCommNewCommAdded = (community: string) => {
    console.log('onAddCommsAddedCommNewCommAdded', community);
  };

  const onAddCommsDeleteCommCommDeleted = (community: string) => {
    console.log('onAddCommsDeleteCommCommDeleted', community);
  };

  const onAddCommsSaveCommsUpdated = (communities: string[]) => {
    console.log('onAddCommsSaveCommsUpdated', communities);
  };

  const onAddCommsExitClicked = () => {
    console.log('onAddCommsExitClicked');
  };

  return {
    onAnonButtonOn,
    onAnonButtonOff,
    onBackButtonClicked,
    onProfileButtonClicked,
    onTextBoxTyped,
    onAddMediaPollButtonClicked,
    onAddMediaPollPageAddPollClicked,
    onPollSectionDurationButtonClicked,
    onSetPollDurationSetButtonClicked,
    onSetPollDurationCancelClicked,
    onSetPollDurationChangeDaysSet,
    onSetPollDurationChangeHoursSet,
    onSetPollDurationChangeMinutesSet,
    onPollSectionMultipleChoiceButtonOn,
    onPollSectionMultipleChoiceButtonOff,
    onPollSectionRemovePollButtonClicked,
    onAddMediaPollUploadFromLibClicked,
    onAddMediaPollTakePhotoClicked,
    onPhotoUploadedRemoveAllPhotosClicked,
    onPhotoUploadedXButtonClicked,
    onPhotoUploadedAddMorePhotosPhotoRemoved,
    onAdSetAddCommunitiesOpenCommunityTags,
    onCommunityTags,
    onCommunityTagsSaveButtonClicked,
    onCommunityTagsCancelClicked,
    onAdSetExpirationButtonOpenExpirationSetting,
    onExpirationSettingCancelClicked,
    onExpirationSettingChoice24HrClicked,
    onExpirationSettingChoice7DaysClicked,
    onExpirationSettingChoice30DaysClicked,
    onExpirationSettingChoiceNeverClicked,
    onPostButtonEmptyAlerted,
    onPostButtonOpenMainFeed,
    onAddCommunityButtonOpenAddComms,
    onAddCommsAddedCommNewCommAdded,
    onAddCommsDeleteCommCommDeleted,
    onAddCommsSaveCommsUpdated,
    onAddCommsExitClicked
  };
};

export default useCreatePostScreenAnalyticsHook;
