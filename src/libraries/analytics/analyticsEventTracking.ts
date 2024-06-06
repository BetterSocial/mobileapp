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
  SIGNED_CHAT_SCREEN_TOGGLE_MOVE_CHAT_OPEN_ALERT = 'SignedChat-ChatScreen_Toggle_openMoveChat-Alert',
  SIGNED_CHAT_SCREEN_TOGGLE_MOVE_CHAT_CLOSE_ALERT = 'SignedChat-ChatScreen_MoveChat-Alert_Discard',
  SIGNED_CHAT_SCREEN_TOGGLE_MOVE_CHAT_OPEN_CHAT = 'SignedChat-ChatScreen_MoveChat-Alert_openNewChatScreen',
  SIGNED_CHAT_SCREEN_ATTACHMENT_UPLOAD_FAILED = 'SignedChat-ChatScreen_ChatActions-Drawer_mediauploadfailed',

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
  ANONYMOUS_CHAT_SCREEN_TOGGLE_MOVE_CHAT_OPEN_ALERT = 'AnonChat-ChatScreen_Toggle_openMoveChat-Alert',
  ANONYMOUS_CHAT_SCREEN_TOGGLE_MOVE_CHAT_CLOSE_ALERT = 'AnonChat-ChatScreen_MoveChat-Alert_Discard',
  ANONYMOUS_CHAT_SCREEN_TOGGLE_MOVE_CHAT_OPEN_CHAT = 'AnonChat-ChatScreen_MoveChat-Alert_openNewChatScreen',
  ANONYMOUS_CHAT_SCREEN_ATTACHMENT_UPLOAD_FAILED = 'AnonChat-ChatScreen_ChatActions-Drawer_mediauploadfailed',

  // SIGNED CHAT DETAIL
  SIGNED_CHAT_DETAIL_BACK_BUTTON_PRESSED = 'SignedChat-ChatDetail_backButton_openChatScreen',
  SIGNED_CHAT_DETAIL_OPEN_PARTICIPANT_MENU = 'SignedChat-ChatDetail_ParticipantName_openParticipantMenu',
  SIGNED_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_OTHER_PROFILE = 'SignedChat-ChatDetail_ParticipantMenu-viewProfile_openOtherProfile',
  SIGNED_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_GO_INCOGNITO = 'SignedChat-ChatDetail_ParticipantMenu-goIncognito_openAnonChatScreen',

  // ANON CHAT DETAIL
  ANONYMOUS_CHAT_DETAIL_BACK_BUTTON_PRESSED = 'AnonChat-ChatDetail_backButton_openChatScreen',
  ANONYMOUS_CHAT_DETAIL_OPEN_PARTICIPANT_MENU = 'AnonChat-ChatDetail_ParticipantName_openParticipantMenu',
  ANONYMOUS_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_OTHER_PROFILE = 'AnonChat-ChatDetail_ParticipantMenu-viewProfile_openOtherProfile',
  ANONYMOUS_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_LEAVE_INCOGNITO_MODE = 'AnonChat-ChatDetail_ParticipantMenu-leaveIncognito_openSignedChatScreen',

  // GROUP CHAT DETAIL
  GROUP_CHAT_DETAIL_BACK_BUTTON_PRESSED = 'GroupChat-ChatDetail_backButton_openChatScreen',
  GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU = 'GroupChat-ChatDetail_ParticipantName_openParticipantMenu',
  GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_MESSAGE = 'GroupChat-ChatDetail_ParticipantMenu-message_openSignedChatScreen',
  GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_MESSAGE_INCOGNITO = 'GroupChat-ChatDetail_ParticipantMenu-anonMessage_openAnonChatScreen',
  GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_REMOVE_USER_BUTTON_CLICKED = 'GroupChat-ChatDetail_ParticipantMenu-removeUser_openRemoveUserNotif',
  GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_REMOVE_USER_CONFIRM = 'GroupChat-ChatDetail_ParticipantMenu-removeUserNotif_remove-openSignChatScreen',
  GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_REMOVE_USER_ALERT_CLOSE = 'GroupChat-ChatDetail_ParticipantMenu-removeUserNotif_cancel-openParticipantMenu',
  GROUP_CHAT_DETAIL_OPEN_PARTICIPANT_MENU_VIEW_OTHER_PROFILE = 'GroupChat-ChatDetail_Participant-viewProfile_openOtherProfile',
  GROUP_CHAT_DETAIL_EDIT_NAME_BUTTON_CLICKED = 'GroupChat-ChatDetail_editName_openEditNameScreen',
  GROUP_CHAT_DETAIL_EDIT_NAME_MENU_SAVE_BUTTON_CLICKED = 'GroupChat-ChatDetail_editNameScreen_save-openSignedChatScreen',
  GROUP_CHAT_DETAIL_EDIT_NAME_MENU_CANCEL_BUTTON_CLICKED = 'GroupChat-ChatDetail_editNameScreen_cancel-openGroupChat-ChatDetail',
  GROUP_CHAT_DETAIL_PIC_CLICKED = 'GroupChat-ChatDetail_editPic_openSignedChatScreen',
  GROUP_CHAT_DETAIL_ADD_PARTICIPANT_BUTTON_CLICKED = 'GroupChat-ChatDetail_addParticipants_openSignedChatScreen',
  GROUP_CHAT_DETAIL_OPEN_EXIT_GROUP_MENU_EXIT_GROUP_BUTTON_CLICKED = 'GroupChat-ChatDetail_exitGroup_openLeaveGroupScreen',
  GROUP_CHAT_DETAIL_ADD_PARTICIPANT_CONFIRM = 'GroupChat-ChatDetail_addParticipants_exit-openSignChatTabl',
  GROUP_CHAT_DETAIL_OPEN_EXIT_GROUP_MENU_EXIT_GROUP_ALERT_CONFIRM = 'GroupChat-ChatDetail_leaveGroupScreen_exit-openSignChatTabl',
  GROUP_CHAT_DETAIL_OPEN_EXIT_GROUP_MENU_EXIT_GROUP_ALERT_CLOSE = 'GroupChat-ChatDetail_leaveGroupScreen_cancel-openGroupChat-ChatDetail',
  GROUP_CHAT_DETAIL_REPORT_GROUP_BUTTON_CANCEL = 'GroupChat-ChatDetail_report_cancel-openGroupChat-ChatDetail',
  GROUP_CHAT_DETAIL_REPORT_GROUP_BUTTON_CLICKED = 'GroupChat-ChatDetail_leaveGroupScreen_redirectToEmail',
  GROUP_CHAT_DETAIL_EDIT_PICK_CANCELLED = 'GroupChat-ChatDetail_editPic_openLeaveGroupScreen',

  // MAIN FEED
  MAIN_FEED_ON_POST_SCROLLED = 'FeedPage-MainFeed_post_scrolled',
  MAIN_FEED_POST_PROPERTY = 'FeedPage-CP_postProperties_scrolled',
  MAIN_FEED_CREATE_POST_BUTTON_CLICKED = 'FeedPage-MainFeed_createPostButton_openCreatePostFlow',
  MAIN_FEED_POST_HEADER_FOLLOW_BUTTON_CLICKED = 'FeedPage-MainFeed_postInteractions-followPostAuthor_follow',
  MAIN_FEED_POST_HEADER_UNFOLLOW_BUTTON_CLICKED = 'FeedPage-MainFeed_postInteractions-followPostAuthor_unfollow',
  MAIN_FEED_POST_DM_FOOTER_BUTTON_CLICKED = 'FeedPage-MainFeed_postInteractions-DMbutton_openDMmenu',
  MAIN_FEED_POST_DRAWER_DM_SIGNED_BUTTON_CLICKED = 'FeedPage-MainFeed_DMmenu-MessageUser_openSignedChat',
  MAIN_FEED_POST_DRAWER_DM_ANON_BUTTON_CLICKED = 'FeedPage-MainFeed_DMmenu-MessageAnon_openAnonChat',
  MAIN_FEED_POST_SINGLE_POLL_CLICKED = 'FeedPage-MainFeed_postInteractions-pollChoice',
  MAIN_FEED_POST_MULTIPLE_CHOICE_SEE_RESULTS_CLICKED = 'FeedPage-MainFeed_postInteractions-pollseeresults_clicked',
  MAIN_FEED_POST_THREE_DOTS_CLICKED = 'FeedPage-MainFeed_postInteractions-3dots_openPostOptionDrawer',
  MAIN_FEED_POST_FOOTER_REPLY_BUTTON_CLICKED = 'FeedPage-MainFeed_postInteractions-replyButton_openPDP',
  MAIN_FEED_DRAWER_MENU_SHARE_LINK_CLICKED = 'FeedPage-MainFeed_postInteractions-PostOptionDrawer-shareLink_clicked',
  MAIN_FEED_POST_USERNAME_CLICKED = 'FeedPage-MainFeed_postInteractions-authorname_openOtherProfile',
  MAIN_FEED_SEARCH_BAR_CLICKED = 'FeedPage-MainFeed_searchHelio_discoveryOpened',
  MAIN_FEED_BLOCK_BUTTON_CLICKED = 'FeedPage-MainFeed_postInteractions-blockSymbol_openBlockMenu',
  MAIN_FEED_BLOCK_USER_BOTTOM_SHEET_CLOSED = 'FeedPage-MainFeed_blockdrawer-justblock_closesBlockMenu',
  MAIN_FEED_BLOCK_USER_BLOCK_AND_REPORT_CLICKED = 'FeedPage-MainFeed_blockdrawer-blockAndReport_clicked',
  MAIN_FEED_BLOCK_USER_BLOCK_INDEFINITELY_CLICKED = 'FeedPage-MainFeed_blockdrawer-blockAndReport-reportSkip_clicked',
  MAIN_FEED_BLOCK_USER_BLOCK_AND_REPORT_REASON = 'FeedPage-MainFeed_blockdrawer-blockAndReport-reasons',
  MAIN_FEED_BLOCK_USER_REPORT_INFO_SUBMITTED = 'FeedPage-MainFeed_blockAndReport-reportInfo_submitted',
  MAIN_FEED_BLOCK_USER_REPORT_INFO_SKIPPED = 'FeedPage-MainFeed_blockAndReport-reportInfoSkipped_clicked',

  // FEED COMMUNITY SCREEN
  FEED_COMMUNITY_PAGE_ON_POST_SCROLLED = 'FeedPage-CP_post_scrolled',
  FEED_COMMUNITY_PAGE_JOIN_BUTTON_CLICKED = 'FeedPage-CP_joinButton_joinBanner',
  FEED_COMMUNITY_PAGE_JOIN_AS_SIGNED_CLICKED = 'FeedPage-CP_joinBanner-signed_joined',
  FEED_COMMUNITY_PAGE_JOIN_AS_ANON_CLICKED = 'FeedPage-CP_joinBanner-anon_joined',
  FEED_COMMUNITY_PAGE_JOIN_LEAVE_COMMUNITY = 'FeedPage-CP_joinBann-leaveComm_clicked',
  FEED_COMMUNITY_PAGE_BACK_BUTTON_CLICKED = 'FeedPage-CP_backButton_clicked',
  FEED_COMMUNITY_PAGE_REPLY_POST_BUTTON_CLICKED = 'FeedPage-CP_postInteractions-replyButton_openPDP',
  FEED_COMMUNITY_PAGE_SHARE_BUTTON_CLICKED = 'FeedPage-CP_postInteractions-share_clicked',
  FEED_COMMUNITY_PAGE_DM_BUTTON_CLICKED = 'FeedPage-CP_postInteractions-DMbutton_clicked',
  FEED_COMMUNITY_PAGE_FOLLOW_USER_BUTTON_CLICKED = 'FeedPage-CP_postInteractions-follow_clicked',
  FEED_COMMUNITY_PAGE_UNFOLLOW_USER_BUTTON_CLICKED = 'FeedPage-CP_postInteractions-follow_unfollow',
  FEED_COMMUNITY_PAGE_BLOCK_BUTTON_CLICKED = 'FeedPage-CP_postInteractions-blockSymbol_openBlockMenu',
  FEED_COMMUNITY_PAGE_BLOCK_USER_BOTTOM_SHEET_CLOSED = 'FeedPage-CP_blockdrawer-justblock_closesBlockMenu',
  FEED_COMMUNITY_PAGE_BLOCK_USER_BLOCK_AND_REPORT_CLICKED = 'FeedPage-CP_blockdrawer-blockAndReport_clicked',
  FEED_COMMUNITY_PAGE_BLOCK_USER_BLOCK_INDEFINITELY_CLICKED = 'FeedPage-CP_blockdrawer-blockAndReport-reportSkip_clicked',
  FEED_COMMUNITY_PAGE_BLOCK_USER_BLOCK_AND_REPORT_REASON = 'FeedPage-CP_blockdrawer-blockAndReport-reasons',
  FEED_COMMUNITY_PAGE_BLOCK_USER_REPORT_INFO_SUBMITTED = 'FeedPage-CP_blockAndReport-reportInfo_submitted',
  FEED_COMMUNITY_PAGE_BLOCK_USER_REPORT_INFO_SKIPPED = 'FeedPage-CP_blockAndReport-reportInfoSkipped_clicked',
  FEED_COMMUNITY_PAGE_POST_INTERACTION_DOWNVOTE_INSERTED = 'FeedPage-CP_postInteractions-downvote_downvoted',
  FEED_COMMUNITY_PAGE_POST_INTERACTION_DOWNVOTE_REMOVED = 'FeedPage-CP_postInteractions-downvote-unselected_downvote-removed',
  FEED_COMMUNITY_PAGE_POST_INTERACTION_UPVOTE_INSERTED = 'FeedPage-CP_postInteractions-upvote_upvoted',
  FEED_COMMUNITY_PAGE_POST_INTERACTION_UPVOTE_REMOVED = 'FeedPage-CP_postInteractions-upvote-unselected_upvote-removed',
  FEED_COMMUNITY_PAGE_POST_INTERACTION_OPEN_AUTHOR_PROFILE = 'FeedPage-CP_postInteractions-authorname_openOtherProfile',
  FEED_COMMUNITY_PAGE_MULTIPLE_POLL_SEE_RESULTS = 'FeedPage-CP_postInteractions-pollseeresults_clicked',
  FEED_COMMUNITY_PAGE_SINGLE_POLL_CLICKED = 'FeedPage-CP_postInteractions-pollChoice',
  FEED_COMMUNITY_PAGE = ''
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
    eventTrack: (event: BetterSocialEventTracking, additionalData?: object): Promise<void> => {
      if (!event) {
        console.error('Event must be defined');
        return Promise.resolve();
      }
      if (additionalData && typeof additionalData !== 'object') {
        console.error('Additional data must be an object');
        return Promise.resolve();
      }

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
