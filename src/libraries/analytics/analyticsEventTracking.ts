import SimpleToast from 'react-native-simple-toast';
/* eslint-disable no-shadow */
import {JsonMap, createClient} from '@segment/analytics-react-native';

import {ENV, SEGMENT_WRITE_KEY} from '../Configs/ENVConfig';

/**
 * Please refer to this for all tracking enums.
 * https://docs.google.com/spreadsheets/d/1zkQzRPG9nKEXaoHI79nFXgL7WmSgp3qGRPVkHMxBzR0/edit#gid=1943812029
 */
export enum BetterSocialEventTracking {
  //  DEFAULT EVENT
  UNDEFINED_EVENT = 'undefined_event',

  // ONBOARDING HUMAN ID
  HUMAN_ID_BUTTON_CLICKED = 'PreLogin-Slider5Login_hIDbutton_Clicked',
  HUMAN_ID_SUCCESS_EXISTING_ACCOUNT = 'external_alert_humanID-Relogin',
  HUMAN_ID_SUCCESS_NEW_REGISTRATION = 'OB-Username_na_verified',
  HUMAN_ID_FAILED_VERIFICATION = 'external_API_failed_verification',

  // ONBOARDING INPUT USERNAME SCREEN
  ONBOARDING_USERNAME_PROFILE_PIC_CLICKED = 'OB-Username_ProfilePic_clicked',
  ONBOARDING_USERNAME_PROFILE_PIC_CAMERA_SELECT = 'OB-Username_ProfilePicDrawer_clickCamera',
  ONBOARDING_USERNAME_PROFILE_PIC_LIBRARY_SELECT = 'OB-Username_ProfilePicDrawer_clickLibrary',
  ONBOARDING_USERNAME_PROFILE_PIC_IMAGE_CHANGED = 'OB-Username_ProfilePic_updated',
  ONBOARDING_USERNAME_PROFILE_PIC_IMAGE_FAIL_TO_CHANGE = 'OB-Username_ProfilePic_failed',
  ONBOARDING_USERNAME_PROFILE_PIC_ALERT_SKIP = 'OB-Username_PicReminderAlert_skip',
  ONBOARDING_USERNAME_PROFILE_PIC_ALERT_ADD_PHOTO = 'OB-Username_PicReminderAlert_addProfilePic',

  // ONBOARDING SELECT LOCATION SCREEN
  ONBOARDING_LOCATION_FIRST_OPEN_SEARCH = 'OB-Location_Location1_openSearch',
  ONBOARDING_LOCATION_FIRST_DELETED = 'OB-Location_Location1_deleted',
  ONBOARDING_LOCATION_SECOND_OPEN_SEARCH = 'OB-Location_Location2_openSearch',
  ONBOARDING_LOCATION_SECOND_DELETED = 'OB-Location_Location2_deleted',
  ONBOARDING_LOCATION_FIRST_SELECTED = 'OB-Location_Location1_hasLocationvalue',
  ONBOARDING_LOCATION_SECOND_SELECTED = 'OB-Location_Location2_hasLocationvalue',
  ONBOARDING_LOCATION_DRAWER_CLOSED = 'OB-Location_SearchBottomDrawer_closewithoutselection',

  // ONBOARDING TOPICS SCREEN
  ONBOARDING_TOPICS_TOTAL_FOLLOWING = 'OB-Topics_TopicsNextButton_clicked',
  ONBOARDING_TOPICS_SELECTED = 'OB-Topics_CommunitesList_selected',
  ONBOARDING_TOPICS_UNSELECTED = 'OB-Topics_CommunitiesList_unselected',

  // ONBOARDING WHO TO FOLLOW SCREEN
  ONBOARDING_WHO_TO_FOLLOW_TOTAL_FOLLOWING = 'OB-FollowUsers_UsersNextButton_clicked',
  ONBOARDING_WHO_TO_FOLLOW_SEE_MORE_CLICKED = 'OB-FollowUsers_UserListSeeMore_clicked',
  ONBOARDING_WHO_TO_FOLLOW_USER_SELECTED = 'OB-FollowUsers_UserList_selected',
  ONBOARDING_WHO_TO_FOLLOW_USER_UNSELECTED = 'OB-FollowUsers_UserList_unselected',

  // ONBOARDING REGISTRATION
  ONBOARDING_REGISTRATION_UPLOAD_IMAGE_SUCCESS = 'OB-FollowUsers_API_UploadImageSuccess',
  ONBOARDING_REGISTRATION_UPLOAD_IMAGE_FAIL = 'OB-FollowUsers_API_UploadImageFail',
  ONBOARDING_REGISTRATION_SUCCESS = 'OB-FollowUsers_API_CreateAccountSuccess',
  ONBOARDING_REGISTRATION_FAILED = 'OB-FollowUsers_API_CreateAccountFail',

  // SIGNED CHAT TAB
  SIGNED_CHAT_TAB_OPEN_NEW_CHAT = 'SignedChat-Chattab_newSignedChatButton_openNewSignedChatFlow',
  SIGNED_CHAT_TAB_OPEN_CHAT_SCREEN = 'SignedChat-Chattab_Channel-DM_openChatScreen',
  SIGNED_CHAT_TAB_OPEN_GROUP_CHAT_SCREEN = 'SignedChat-Chattab_Channel-Groupchat_openChatScreen',
  SIGNED_CHAT_TAB_MY_POST_NOTIF_OPEN_PDP = 'SignedChat-Chattab_Channel-MyPostNotif_openPDP',
  SIGNED_CHAT_TAB_OTHER_POST_NOTIF_OPEN_PDP = 'SignedChat-Chattab_Channel-OtherPostNotif_openPDP',
  SIGNED_CHAT_TAB_COMMUNITY_PAGE_OPEN_PAGE = 'SignedChat-Chattab_Channel-CommunityPage_openCP',
  SIGNED_CHAT_TAB_PRESS_FOLLOW_BUTTON = 'SignedChat-Chattab_followButton_Following',
  SIGNED_CHAT_TAB_PRESS_UNFOLLOW_BUTTON = 'SignedChat-Chattab_followButton_Unfollowing',

  // ANONYMOUS CHAT TAB
  ANONYMOUS_CHAT_TAB_OPEN_NEW_CHAT = 'AnonChat-Chattab_newAnonChatButton_openNewAnonChatFlow',
  ANONYMOUS_CHAT_TAB_EMPTY_CHAT_OPEN_NEW_CHAT = 'AnonChat-Chattab_emptyAnonTab-startAnonChatButton_openNewAnonChatFlow',
  ANONYMOUS_CHAT_TAB_EMPTY_CHAT_OPEN_CREATE_POST = 'AnonChat-Chattab_emptyAnonTab-newAnonPostButton_openCreateAnonPost',
  ANONYMOUS_CHAT_TAB_EMPTY_CHAT_OPEN_DISCOVERY = 'AnonChat-Chattab_emptyAnonTab-joinCommButton_openDiscovery-Comm',
  ANONYMOUS_CHAT_TAB_OPEN_CHAT_SCREEN = 'AnonChat-Chattab_Channel-DM_openChatScreen',
  ANONYMOUS_CHAT_TAB_MY_POST_NOTIF_OPEN_PDP = 'AnonChat-Chattab_Channel-MyPostNotif_openPDP',
  ANONYMOUS_CHAT_TAB_OTHER_POST_NOTIF_OPEN_PDP = 'AnonChat-Chattab_Channel-OtherPostNotif_openPDP',
  ANONYMOUS_CHAT_TAB_COMMUNITY_PAGE_OPEN_PAGE = 'AnonChat-Chattab_Channel-CommunityPage_openCP',

  // SIGNED CHAT SCREEN
  SIGNED_CHAT_SCREEN_PLUS_SIGN_CLICKED = 'SignedChat-ChatScreen_plusSign_clicked',
  SIGNED_CHAT_SCREEN_SEND_BUTTON_CLICKED = 'SignedChat-ChatScreen_sendMessageButton_clicked',
  SIGNED_CHAT_SCREEN_ATTACHMENT_CLOSE_DRAWER = 'SignedChat-ChatScreen_ChatActions-Drawer_discard',
  SIGNED_CHAT_SCREEN_ATTACHMENT_CLICK_MEDIA = 'SignedChat-ChatScreen_ChatActions-Drawer_clickMedia',
  SIGNED_CHAT_SCREEN_ATTACHMENT_CLICK_CAMERA = 'SignedChat-ChatScreen_ChatActions-Drawer_clickCamera',
  SIGNED_CHAT_SCREEN_ATTACHMENT_CLICK_GIF = 'SignedChat-ChatScreen_ChatActions-Drawer_clickGIF',
  SIGNED_CHAT_SCREEN_ATTACHMENT_CLICK_FILE = 'SignedChat-ChatScreen_ChatActions-Drawer_clickFile',
  SIGNED_CHAT_SCREEN_ATTACHMENT_MEDIA_UPLOAD_FILE = 'SignedChat-ChatScreen_ChatActions-Drawer_mediauploadfailed',
  SIGNED_CHAT_SCREEN_HEADER_BACK_BUTTON_CLICKED = 'SignedChat-ChatScreen_backButton_openSignedChatTab',
  SIGNED_CHAT_SCREEN_HEADER_PROFILE_PICTURE_CLICKED = 'SignedChat-ChatScreen_ChatHeaderDPName_openChatDetailScreen',
  SIGNED_CHAT_SCREEN_HEADER_OPTIONS_BUTTON_CLICKED = 'SignedChat-ChatScreen_3Dots_openChatDetailScreen',
  SIGNED_CHAT_SCREEN = '',

  // ANON CHAT SCREEN
  ANONYMOUS_CHAT_SCREEN_PLUS_SIGN_CLICKED = 'AnonChat-ChatScreen_plusSign_clicked',
  ANONYMOUS_CHAT_SCREEN_SEND_BUTTON_CLICKED = 'AnonChat-ChatScreen_sendMessageButton_clicked',
  ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLOSE_DRAWER = 'AnonChat-ChatScreen_ChatActions-Drawer_discard',
  ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLICK_MEDIA = 'AnonChat-ChatScreen_ChatActions-Drawer_clickMedia',
  ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLICK_CAMERA = 'AnonChat-ChatScreen_ChatActions-Drawer_clickCamera',
  ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLICK_GIF = 'AnonChat-ChatScreen_ChatActions-Drawer_clickGIF',
  ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLICK_FILE = 'AnonChat-ChatScreen_ChatActions-Drawer_clickFile',
  ANONYMOUS_CHAT_SCREEN_ATTACHMENT_MEDIA_UPLOAD_FILE = 'AnonChat-ChatScreen_ChatActions-Drawer_mediauploadfailed',
  ANONYMOUS_CHAT_SCREEN_HEADER_BACK_BUTTON_CLICKED = 'AnonChat-ChatScreen_backButton_openAnonChatTab',
  ANONYMOUS_CHAT_SCREEN_HEADER_PROFILE_PICTURE_CLICKED = 'AnonChat-ChatScreen_ChatHeaderDPName_openChatDetailScreen',
  ANONYMOUS_CHAT_SCREEN_HEADER_OPTIONS_BUTTON_CLICKED = 'AnonChat-ChatScreen_3Dots_openChatDetailScreen',
  ANONYMOUS_CHAT_SCREEN = '1'
}

const ENABLE_TOAST = ENV === 'Dev';

const AnalyticsEventTracking = (() => {
  if (!SEGMENT_WRITE_KEY) {
    console.error('Segment write key must be provided');
    return {
      eventTrack: () => {
        console.error('Empty track');
      }
    };
  }

  const client = createClient({
    writeKey: SEGMENT_WRITE_KEY || '',
    debug: __DEV__,
    trackAppLifecycleEvents: true,
    trackDeepLinks: true
  });

  return {
    eventTrack: (event: BetterSocialEventTracking, additionalData?: object) => {
      if (!event) throw new Error('Event must be defined');
      if (additionalData && typeof additionalData !== 'object')
        throw new Error('additionalData must be an object');

      if (!additionalData) {
        if (ENABLE_TOAST && !!SEGMENT_WRITE_KEY) SimpleToast.show(event);
        return client.track(event);
      }

      if (ENABLE_TOAST && !!SEGMENT_WRITE_KEY)
        SimpleToast.show(`${event} ${JSON.stringify(additionalData || {})}`);
      return client.track(event, (additionalData || {}) as JsonMap);
    }
  };
})();

Object.freeze(AnalyticsEventTracking);

export default AnalyticsEventTracking;
