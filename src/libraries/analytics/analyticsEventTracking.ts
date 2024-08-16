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

  // BACKDDOR
  BACKDDOR_MENU_OPEN = 'PreLogin-Slider1_backDoorLogin_opened',
  BACKDOOR_DUMMY_ONBOARDING_CLICKED = 'backdoorOB-demo_dummyOB_clicked',
  BACKDOOR_DEMO_LOGIN_CLICKED = 'backdoorOB-demo_login_clicked',
  BACKDOOR_CLOSE_MENU_CLICKED = 'backdoorOB-demo_closeDemoMenu_clicked',

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
  ONBOARDING_USERNAME_PROFILE_PIC_ALERT_SKIP = 'OB-Username_PicReminderAlert-skip_OB-LocationOpened',
  ONBOARDING_USERNAME_PROFILE_PIC_ALERT_ADD_PHOTO = 'OB-Username_PicReminderAlert_addProfilePic',
  ONBOARDING_USERNAME_NEXT_BUTTON_NO_PROFILE_PIC = 'OB-Username_nextButton-noProfilePic_PicReminderAlertOpened',
  ONBOARDING_USERNAME_NEXT_BUTTON_WITH_PROFILE_PIC = 'OB-Username_nextButton-profilePic_OB-LocationOpened',

  // ONBOARDING SELECT LOCATION SCREEN
  ONBOARDING_LOCATION_FIRST_OPEN_SEARCH = 'OB-Location_Location1_openSearch',
  ONBOARDING_LOCATION_FIRST_DELETED = 'OB-Location_Location1_deleted',
  ONBOARDING_LOCATION_SECOND_OPEN_SEARCH = 'OB-Location_Location2_openSearch',
  ONBOARDING_LOCATION_SECOND_DELETED = 'OB-Location_Location2_deleted',
  ONBOARDING_LOCATION_FIRST_SELECTED = 'OB-Location_Location1_hasLocationvalue',
  ONBOARDING_LOCATION_SECOND_SELECTED = 'OB-Location_Location2_hasLocationvalue',
  ONBOARDING_LOCATION_DRAWER_CLOSED = 'OB-Location_SearchBottomDrawer_closewithoutselection',
  ONBOARDING_LOCATION_NEXT_BUTTON = 'OB-Location_nextButton_OB-topicsOpened',

  // ONBOARDING TOPICS SCREEN
  ONBOARDING_TOPICS_TOTAL_FOLLOWING = 'OB-Topics_TopicsNextButton_clicked',
  ONBOARDING_TOPICS_SELECTED = 'OB-Topics_CommunitesList_selected',
  ONBOARDING_TOPICS_UNSELECTED = 'OB-Topics_CommunitiesList_unselected',
  ONBOARDING_TOPICS_NEXT_BUTTON = 'OB-Topics_nextButton_OB-FollowUsersOpened',

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
  MAIN_FEED_ON_POST_SCROLLED_ITEM = 'FeedPage-MainFeed_postProperties',
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
  MAIN_FEED_POST_FOOTER_UPVOTE_INSERTED = 'FeedPage-MainFeed_postInteractions-upvote_upvoted',
  MAIN_FEED_POST_FOOTER_DOWNVOTE_INSERTED = 'FeedPage-MainFeed_postInteractions-downvote_downvoted',
  MAIN_FEED_POST_FOOTER_DOWNVOTE_REMOVED = 'FeedPage-MainFeed_postInteractions-downvote-unselected_downvote-removed',
  MAIN_FEED_POST_FOOTER_UPVOTE_REMOVED = 'FeedPage-MainFeed_postInteractions-upvote-unselected_upvote-removed',
  MAIN_FEED_POST_TOPIC_CHIP_CLICKED = 'FeedPage-MainFeed_postInteractions-hashtag_openCP',

  // POST DETAIL PAGE
  PDP_POST_UPVOTE_INSERTED = 'FeedPage-PDP_postInteractions-upvote_upvoted',
  PDP_POST_UPVOTE_REMOVED = 'FeedPage-PDP_postInteractions-upvote-unselected_upvote-removed',
  PDP_POST_DOWNVOTE_INSERTED = 'FeedPage-PDP_postInteractions-downvote_downvoted',
  PDP_POST_DOWNVOTE_REMOVED = 'FeedPage-PDP_postInteractions-downvote-unselected_downvote-removed',
  PDP_COMMENT_UPVOTE_INSERTED = 'FeedPage-PDP_commentInteractions-upvote_upvoted',
  PDP_COMMENT_UPVOTE_REMOVED = 'FeedPage-PDP_commentInteractions-upvote-unselected_upvote-removed',
  PDP_COMMENT_DOWNVOTE_INSERTED = 'FeedPage-PDP_commentInteractions-downvote_downvoted',
  PDP_COMMENT_DOWNVOTE_REMOVED = 'FeedPage-PDP_commentInteractions-downvote-unselected_downvote-removed',
  PDP_COMMENT_REPLY_BUTTON_CLICKED = 'FeedPage-PDP_commentInteractions-replyButton_clicked',
  PDP_COMMENT_DELETE_ALERT_CONFIRM = 'FeedPage-PDP_commentInteractions-deleteButton_clicked',
  PDP_COMMENT_DELETE_ALERT_CANCEL = 'FeedPage-PDP_commentInteractions-cancelDelete_clicked',
  PDP_COMMENT_INPUT_ANON_ON = 'FeedPage-PDP_commentInteractions-anonOn_clicked',
  PDP_COMMENT_INPUT_ANON_OFF = 'FeedPage-PDP_commentInteractions-anonOff_clicked',

  // FEED COMMUNITY SCREEN
  FEED_COMMUNITY_PAGE_ON_POST_SCROLLED = 'FeedPage-CP_post_scrolled',
  FEED_COMMUNITY_PAGE_ON_POST_SCROLLED_ITEM = 'FeedPage-CP_postProperties',
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

  // DOMAIN PAGE
  DOMAIN_PAGE_BACK_BUTTON_CLICKED = 'FeedPage-DomainPage_backButton_clicked',
  DOMAIN_PAGE_CREDDER_GROUP_CLICKED = 'FeedPage-DomainPage_credScoreButton_clicked',
  DOMAIN_PAGE_EXTERNAL_LINK_CLICKED = 'FeedPage-DomainPage_openLink_clicked',
  DOMAIN_PAGE_FOLLOW_BUTTON_CLICKED = 'FeedPage-DomainPage_follow_follow',
  DOMAIN_PAGE_POST_DOWNVOTE_INSERTED = 'FeedPage-DomainPage_postInteractions-downvote_downvoted',
  DOMAIN_PAGE_POST_DOWNVOTE_REMOVED = 'FeedPage-DomainPage_postInteractions-downvote-unselected_downvote-removed',
  DOMAIN_PAGE_POST_FOLLOW_BUTTON_CLICKED = 'FeedPage-DomainPage_postInteractions-follow_follow',
  DOMAIN_PAGE_POST_REPLY_BUTTON_CLICKED = 'FeedPage-DomainPage_postInteractions-replyButton_openPDP',
  DOMAIN_PAGE_POST_SHARE_BUTTON_CLICKED = 'FeedPage-DomainPage_postInteractions-shareButton_clicked',
  DOMAIN_PAGE_POST_SCROLLED = 'FeedPage-DomainPage_post_scrolled',
  DOMAIN_PAGE_POST_PROPERTIES = 'FeedPage-DomainPage_postProperties',
  DOMAIN_PAGE_POST_UNFOLLOW_BUTTON_CLICKED = 'FeedPage-DomainPage_postInteractions-follow_unfollow',
  DOMAIN_PAGE_POST_UPVOTE_INSERTED = 'FeedPage-DomainPage_postInteractions-upvote_upvoted',
  DOMAIN_PAGE_POST_UPVOTE_REMOVED = 'FeedPage-DomainPage_postInteractions-upvote-unselected_upvote-removed',
  DOMAIN_PAGE_UNFOLLOW_BUTTON_CLICKED = 'FeedPage-DomainPage_follow_unfollow',
  DOMAIN_PAGE_BLOCK_BUTTON_CLICKED = 'FeedPage-DomainPage_postInteractions-blockSymbol_openBlockMenu',
  DOMAIN_PAGE_BLOCK_DOMAIN_BOTTOM_SHEET_CLOSED = 'FeedPage-DomainPage_blockdrawer-justblock_closesBlockMenu',
  DOMAIN_PAGE_BLOCK_DOMAIN_BLOCK_AND_REPORT_CLICKED = 'FeedPage-DomainPage_blockdrawer-blockAndReport_clicked',
  DOMAIN_PAGE_BLOCK_DOMAIN_BLOCK_INDEFINITELY_CLICKED = 'FeedPage-DomainPage_blockdrawer-blockAndReport-reportSkip_clicked',
  DOMAIN_PAGE_BLOCK_DOMAIN_BLOCK_AND_REPORT_REASON = 'FeedPage-DomainPage_blockdrawer-blockAndReport-reasons',
  DOMAIN_PAGE_BLOCK_DOMAIN_REPORT_INFO_SUBMITTED = 'FeedPage-DomainPage_blockAndReport-reportInfo_submitted',
  DOMAIN_PAGE_BLOCK_DOMAIN_REPORT_INFO_SKIPPED = 'FeedPage-DomainPage_blockAndReport-reportInfoSkipped_clicked',

  // DISCOVERY SCREEN
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_OPEN_CREATE_COMMUNITY = 'Discovery-SearchComms_startNewCommunity_openCreateCommunityPage',
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_YOUR_COMMUNITY_JOIN = 'Discovery-SearchComms_joinedComms-joinCommunity_joined',
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_YOUR_COMMUNITY_LEFT = 'Discovery-SearchComms_joinedComms-joinCommunity_left',
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_YOUR_COMMUNITY_OPENED = 'Discovery-SearchComms_joinedComms-CP_opened',
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_SUGGESTED_COMMUNITY_JOIN = 'Discovery-SearchComms_suggestedComms-joinCommunity_clicked',
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_SUGGESTED_COMMUNITY_LEFT = 'Discovery-SearchComms_suggestedComms-joinCommunity_unclicked',
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_SUGGESTED_COMMUNITY_OPENED = 'Discovery-SearchComms_suggestedComms-CP_opened',
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_SEARCHED_COMMUNITY_CLICKED = 'Discovery-SearchComms_searchComms_clicked',
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_RECENT_SEARCH_CLICKED = 'Discovery-SearchComms_recentSearches_clicked',
  DISCOVERY_SCREEN_SEARCH_COMMUNITY_CLEAR_RECENT_SEARCH_CLICKED = 'Discovery-SearchComms_clearRecentSearches_clicked',

  DISCOVERY_SCREEN_SEARCH_NEWS_OPEN_LINK_CLICKED = 'Discovery-SearchNews_openLink_clicked',
  DISCOVERY_SCREEN_SEARCH_NEWS_OPEN_LINK_CONTEXT_SCREEN = 'Discovery-SearchNews_linkContextScreen_opened',
  DISCOVERY_SCREEN_SEARCH_NEWS_OPEN_DOMAIN_SCREEN = 'Discovery-SearchNews_newsPage_openFeedPage-DomainPage',
  DISCOVERY_SCREEN_SEARCH_NEWS_SEARCH_NEWS_CLICKED = 'Discovery-SearchNews_searchNews_clicked',
  DISCOVERY_SCREEN_SEARCH_NEWS_RECENT_SEARCH_CLICKED = 'Discovery-SearchNews_recentSearches_clicked',
  DISCOVERY_SCREEN_SEARCH_NEWS_CLEAR_RECENT_SEARCH_CLICKED = 'Discovery-SearchNews_clearRecentSearches_clicked',
  DISCOVERY_SCREEN_SEARCH_NEWS_BACK_BUTTON_CLICKED = 'Discovery-SearchNews_backButton_openPrevPage',
  DISCOVERY_SCREEN_SEARCH_NEWS_COMMUNITY_TAB_CLICKED = 'Discovery-SearchNews_searchCommsTab_clicked',
  DISCOVERY_SCREEN_SEARCH_NEWS_USERS_TAB_CLICKED = 'Discovery-SearchNews_searchUsersTab_clicked',
  DISCOVERY_SCREEN_SEARCH_NEWS_DOMAINS_TAB_CLICKED = 'Discovery-SearchNews_searchDomainsTab_clicked',

  DISCOVERY_SCREEN_SEARCH_DOMAIN_SUGGESTED_DOMAIN_JOIN = 'Discovery-SearchDomains_suggestedDomains-followDomain_clicked',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_SUGGESTED_DOMAIN_LEFT = 'Discovery-SearchDomains_suggestedDomains-followDomain_unclicked',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_YOUR_DOMAIN_OPENED = 'Discovery-SearchDomains_followedDomains-domainPage_openFeedPage-DomainPage',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_SUGGESTED_DOMAIN_OPENED = 'Discovery-SearchDomains_suggestedDomains-domainPage_openFeedPage-DomainPage',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_SEARCH_DOMAIN_CLICKED = 'Discovery-SearchDomains_searchDomains_clicked',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_RECENT_SEARCH_CLICKED = 'Discovery-SearchDomains_recentSearches_clicked',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_CLEAR_RECENT_SEARCH_CLICKED = 'Discovery-SearchDomains_clearRecentSearches_clicked',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_BACK_BUTTON_CLICKED = 'Discovery-SearchDomains_backButton_openPrevPage',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_COMMUNITY_TAB_CLICKED = 'Discovery-SearchDomains_searchCommsTab_clicked',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_USERS_TAB_CLICKED = 'Discovery-SearchDomains_searchUsersTab_clicked',
  DISCOVERY_SCREEN_SEARCH_DOMAIN_NEWS_TAB_CLICKED = 'Discovery-SearchDomains_searchNewsTab_clicked',

  DISCOVERY_SCREEN_SEARCH_USERS_YOUR_USER_FOLLOWED = 'Discovery-SearchUsers_suggestedUsers-followUser_followed',
  DISCOVERY_SCREEN_SEARCH_USERS_YOUR_USER_UNFOLLOWED = 'Discovery-SearchUsers_suggestedUsers-followUser_unfollowed',
  DISCOVERY_SCREEN_SEARCH_USERS_SUGGESTED_USER_FOLLOWED = 'Discovery-SearchUsers_suggestedUsers-followUser_followed',
  DISCOVERY_SCREEN_SEARCH_USERS_SUGGESTED_USER_UNFOLLOWED = 'Discovery-SearchUsers_suggestedUsers-followUser_unfollowed',
  DISCOVERY_SCREEN_SEARCH_USERS_YOUR_USER_OPENED = 'Discovery-SearchUsers_followedUsers-otherProfile_opened',
  DISCOVERY_SCREEN_SEARCH_USERS_SUGGESTED_USER_OPENED = 'Discovery-SearchUsers_suggestedUsers-otherProfile_opened',
  DISCOVERY_SCREEN_SEARCH_USERS_SEARCH_USER_CLICKED = 'Discovery-SearchUsers_searchUsers_clicked',
  DISCOVERY_SCREEN_SEARCH_USERS_RECENT_SEARCH_CLICKED = 'Discovery-SearchUsers_recentSearches_clicked',
  DISCOVERY_SCREEN_SEARCH_USERS_CLEAR_RECENT_SEARCH_CLICKED = 'Discovery-SearchUsers_clearRecentSearches_clicked',
  DISCOVERY_SCREEN_SEARCH_USERS_BACK_BUTTON_CLICKED = 'Discovery-SearchUsers_backButton_openPrevPage',
  DISCOVERY_SCREEN_SEARCH_USERS_COMMUNITY_TAB_CLICKED = 'Discovery-SearchUsers_searchCommsTab_clicked',
  DISCOVERY_SCREEN_SEARCH_USERS_DOMAINS_TAB_CLICKED = 'Discovery-SearchUsers_searchDomainsTab_clicked',
  DISCOVERY_SCREEN_SEARCH_USERS_NEWS_TAB_CLICKED = 'Discovery-SearchUsers_searchNewsTab_clicked',

  // Other Profile Screen
  OTHER_PROFILE_SCREEN_POST_DOWNVOTE_INSERTED = 'Profile-OtherProfile_postInteractions-downvote_downvoted',
  OTHER_PROFILE_SCREEN_POST_DOWNVOTE_REMOVED = 'Profile-OtherProfile_postInteractions-downvote-unselected_downvote-removed',
  OTHER_PROFILE_SCREEN_POST_UPVOTE_INSERTED = 'Profile-OtherProfile_postInteractions-upvote_upvoted',
  OTHER_PROFILE_SCREEN_POST_UPVOTE_REMOVED = 'Profile-OtherProfile_postInteractions-upvote-unselected_upvote-removed',
  OTHER_PROFILE_SCREEN_POST_OPTION_CLICKED = 'Profile-OtherProfile_postInteractions-3dots_openPostOptionDrawer',
  OTHER_PROFILE_SCREEN_POST_OPTION_SHARE_LINK = 'Profile-OtherProfile_postInteractions-PostOptionDrawer-shareLink_clicked',
  OTHER_PROFILE_SCREEN_POST_DM_BUTTON_CLICKED = 'Profile-OtherProfile_postInteractions-DMbutton_clicked',
  OTHER_PROFILE_SCREEN_POST_ON_REPLY_BUTTON_CLICKED = 'Profile-OtherProfile_postInteractions-replyButton_openPDP',
  OTHER_PROFILE_SCREEN_HEADER_USER_FOLLOW = 'Profile-OtherProfile_followUser_followed',
  OTHER_PROFILE_SCREEN_HEADER_USER_UNFOLLOW = 'Profile-OtherProfile_followUser_unfollowed',
  OTHER_PROFILE_SCREEN_HEADER_SHARE_USER_CLICKED = 'Profile-OtherProfile_shareUser_clicked',
  OTHER_PROFILE_SCREEN_BIO_ANON_BUTTON_ON = 'Profile-OtherProfile_anonButton_on',
  OTHER_PROFILE_SCREEN_BIO_ANON_BUTTON_OFF = 'Profile-OtherProfile_anonButton_off',
  OTHER_PROFILE_SCREEN_BIO_SEND_DM = 'Profile-OtherProfile_sendDmButton_dmSent',
  OTHER_PROFILE_SCREEN_POST_POLL_CHOICE_CLICKED = 'Profile-OtherProfile_postInteractions-pollChoice_1,2,3,4',
  OTHER_PROFILE_SCREEN_POST_POLL_SEE_RESULTS_CLICKED = 'Profile-OtherProfile_postInteractions-pollseeresults_clicked',
  OTHER_PROFILE_SCREEN_POST_BLOCK_BUTTON_CLICKED = 'Profile-OtherProfile_postInteractions-blockSymbol_openBlockMenu',
  OTHER_PROFILE_SCREEN_BLOCK_USER_BOTTOM_SHEET_CLOSED = 'Profile-OtherProfile_blockdrawer-justblock_closesBlockMenu',
  OTHER_PROFILE_SCREEN_BLOCK_USER_BLOCK_AND_REPORT_CLICKED = 'Profile-OtherProfile_blockdrawer-blockAndReport_clicked',
  OTHER_PROFILE_SCREEN_BLOCK_USER_BLOCK_INDEFINITELY_CLICKED = 'Profile-OtherProfile_blockdrawer-blockAndReport-reportSkip_clicked',
  OTHER_PROFILE_SCREEN_BLOCK_USER_BLOCK_AND_REPORT_REASON = 'Profile-OtherProfile_blockdrawer-blockAndReport-reasons',
  OTHER_PROFILE_SCREEN_BLOCK_USER_REPORT_INFO_SUBMITTED = 'Profile-OtherProfile_blockAndReport-reportInfo_submitted',
  OTHER_PROFILE_SCREEN_BLOCK_USER_REPORT_INFO_SKIPPED = 'Profile-OtherProfile_blockAndReport-reportInfoSkipped_clicked',

  // My Profile Screen
  MY_PROFILE_HEADER_NO_POSTS_START_POSTING = 'Profile-MyProfile_noPosts-StartPosting_clicked',
  MY_PROFILE_HEADER_NO_POSTS_KARMA_SCORE_CLICKED = 'Profile-MyProfile_noPosts-KarmaScore_clicked',
  MY_PROFILE_HEADER_NO_POSTS_KARMA_SCORE_CLOSED = 'Profile-MyProfile_noPosts-karmaScore-closed_clicked',
  MY_PROFILE_HEADER_EDIT_BIO_CLICKED = 'Profile-MyProfile_editMyPrompt_openPrompt',
  MY_PROFILE_HEADER_EDIT_BIO_SAVE_PROMPT_CLICKED = 'Profile-MyProfile_prompt-save_clicked',
  MY_PROFILE_HEADER_SHARE_USER_CLICKED = 'Profile-MyProfile_share_clicked',
  MY_PROFILE_HEADER_SETTINGS_CLICKED = 'Profile-MyProfile_settings_openSettingsTab',
  MY_PROFILE_HEADER_SHARE_LINK_CLICKED = 'Profile-MyProfile_shareLink_clicked',
  MY_PROFILE_HEADER_ALLOW_ALL_ANON_MESSAGES_CLICKED = 'Profile-MyProfile_allowAllAnonMessages_clicked',
  MY_PROFILE_HEADER_ALLOW_ANON_MESSAGES_FOLLOWED_CLICKED = 'Profile-MyProfile_allowAnonMessagesFollowed_clicked',
  MY_PROFILE_HEADER_PROFILE_PIC_OPEN_BANNER = 'Profile-MyProfile_proflilePic_openProfilePicBanner',
  MY_PROFILE_HEADER_PROFILE_PIC_VIEW_PROFILE_PIC = 'Profile-MyProfile_profilePicBanner-viewProfilePic_clicked',
  MY_PROFILE_HEADER_PROFILE_LIBRARY_CLICKED = 'Profile-MyProfile_profilePicBanner-library_clicked',
  MY_PROFILE_HEADER_PROFILE_PHOTO_CLICKED = 'Profile-MyProfile_profilePicBanner-photo_clicked',
  MY_PROFILE_HEADER_PROFILE_REMOVE_CURRENT_CLICKED = 'Profile-MyProfile_profilePicBanner-removeCurrent_clicked',
  MY_PROFILE_HEADER_PROFILE_BANNER_CLOSED = 'Profile-MyProfile_profilePicBanner-close_clicked',
  MY_PROFILE_HEADER_SIGNED_POST_TAB_CLICKED = 'Profile-MyProfile_signedPostsTab_clicked',
  MY_PROFILE_HEADER_ANON_POST_TAB_CLICKED = 'Profile-MyProfile_AnonPostsTab_clicked',
  MY_PROFILE_HEADER_FOLLOWER_CLICKED = 'Profile-MyProfile_followers_openFollowerList',
  MY_PROFILE_HEADER_FOLLOWING_CLICKED = 'Profile-MyProfile_following_openFollowingListUsers',

  // FOLLOWER SCREEN
  FOLLOWER_SCREEN_SEARCH_BAR_CLICKED = 'Profile-MyProfile_followerList-search_clicked',
  FOLLOWER_SCREEN_DELETE_SEARCH_CLICKED = 'Profile-MyProfile_followerList-deleteSearch_clicked',
  FOLLOWER_SCREEN_USER_ITEM_CLICKED = 'Profile-MyProfile_followerList-profileClicked_openOtherProfile',
  FOLLOWER_SCREEN_BACK_BUTTON_CLICKED = 'Profile-MyProfile_followerList-backButton_clicked',
  FOLLOWER_SCREEN_USER_ITEM_FOLLOW = 'Profile-MyProfile_followerList-followUser_clicked',
  FOLLOWER_SCREEN_USER_ITEM_UNFOLLOW = 'Profile-MyProfile_followerList-unfollowUser_clicked',

  // FOLLOWING SCREEN
  FOLLOWING_SCREEN_SEARCH_BAR_CLICKED = 'Profile-MyProfile_followingListUsers-search_',
  FOLLOWING_SCREEN_SEARCH_BAR_DELETED = 'Profile-MyProfile_followingListUsers-deleteSearch_',
  FOLLOWING_SCREEN_BACK_BUTTON_CLICKED = 'Profile-MyProfile_followingListUsers-backButton_clicked',
  FOLLOWING_SCREEN_USERS_TAB_ITEM_CLICKED = 'Profile-MyProfile_followingListUsers-userClicked_openOtherProfile',
  FOLLOWING_SCREEN_USERS_TAB_ITEM_FOLLOWED = 'Profile-MyProfile_followingListUsers-follow_clicked',
  FOLLOWING_SCREEN_USERS_TAB_ITEM_UNFOLLOWED = 'Profile-MyProfile_followingListUsers-unfollow_clicked',
  FOLLOWING_SCREEN_USERS_TAB_SUGGESTED_ITEM_CLICKED = 'Profile-MyProfile_followingSuggestedUsers-profileClicked_openOtherProfile',
  FOLLOWING_SCREEN_USERS_TAB_SUGGESTED_ITEM_FOLLOWED = 'Profile-MyProfile_followingListUsers-follow_clicked',
  FOLLOWING_SCREEN_USERS_TAB_SUGGESTEDITEM_UNFOLLOWED = 'Profile-MyProfile_followingListUsers-unfollow_clicked',
  FOLLOWING_SCREEN_USERS_TAB_DOMAIN_TAB_CLICKED = 'Profile-MyProfile_followingListUsers-domainsTab_openFollowingDomains',
  FOLLOWING_SCREEN_USERS_TAB_COMMUNITY_TAB_CLICKED = 'Profile-MyProfile_followingListUsers-communitiesTab_openFollowingComm',
  FOLLOWING_SCREEN_COMMUNITY_TAB_BACK_BUTTON_CLICKED = 'Profile-MyProfile_folllowingComm-back_clicked',
  FOLLOWING_SCREEN_COMMUNITY_TAB_SEARCH_CLICKED = 'Profile-MyProfile_folllowingComm-search_clicked',
  FOLLOWING_SCREEN_COMMUNITY_TAB_DELETE_SEARCH_CLICKED = 'Profile-MyProfile_folllowingComm-deleteSearch_clicked',
  FOLLOWING_SCREEN_COMMUNITY_TAB_CREATE_COMMUNITY_CLICKED = 'Profile-MyProfile_folllowingComm-startNewCommButton_openCreateCommunityPage',
  FOLLOWING_SCREEN_COMMUNITY_TAB_YOUR_COMMUNITY_CLICKED = '',
  FOLLOWING_SCREEN_COMMUNITY_TAB_YOUR_COMMUNITY_FOLLOWED = 'Profile-MyProfile_folllowingComm-follow_clicked',
  FOLLOWING_SCREEN_COMMUNITY_TAB_YOUR_COMMUNITY_UNFOLLOWED = 'Profile-MyProfile_folllowingComm-unfollow_clicked',
  FOLLOWING_SCREEN_COMMUNITY_TAB_SUGGESTED_COMMUNITY_JOIN_CLICKED = 'Profile-MyProfile_folllowingSuggestedComm-join_clicked',
  FOLLOWING_SCREEN_COMMUNITY_TAB_SUGGESTED_COMMUNITY_UNJOIN_CLICKED = 'Profile-MyProfile_folllowingSuggestedComm-unjoin_clicked',
  FOLLOWING_SCREEN_COMMUNITY_TAB_SUGGESTED_COMMUNITY_CLICKED_OPEN_PAGE = 'Profile-MyProfile_folllowingSuggestedComm-commClicked_openCP',
  FOLLOWING_SCREEN_DOMAIN_TAB_SEARCH_CLICKED = 'Profile-MyProfile_followingDomains-search_clicked',
  FOLLOWING_SCREEN_DOMAIN_TAB_DELETE_SEARCH_CLICKED = 'Profile-MyProfile_followingDomains-deleteSearch_clicked',
  FOLLOWING_SCREEN_DOMAIN_TAB_BACK_BUTTON_CLICKED = 'Profile-MyProfile_followingDomains-back_clicked',
  FOLLOWING_SCREEN_DOMAIN_TAB_YOUR_ITEM_CLICKED = 'Profile-MyProfile_followingDomains-domain_opened',
  FOLLOWING_SCREEN_DOMAIN_TAB_YOUR_ITEM_FOLLOWED = 'Profile-MyProfile_followingDomains-follow_clicked',
  FOLLOWING_SCREEN_DOMAIN_TAB_YOUR_ITEM_UNFOLLOWED = 'Profile-MyProfile_followingDomains-unfollow_clicked',
  FOLLOWING_SCREEN_DOMAIN_TAB_SUGGESTED_ITEM_CLICKED = 'Profile-MyProfile_followingSuggestedDomains-domain_opened',
  FOLLOWING_SCREEN_DOMAIN_TAB_SUGGESTED_ITEM_FOLLOWED = 'Profile-MyProfile_followingSuggestedDomains-follow_clicked',
  FOLLOWING_SCREEN_DOMAIN_TAB_SUGGESTED_ITEM_UNFOLLOWED = 'Profile-MyProfile_followingSuggestedDomains-unfollow_clicked',

  // CREATE POST
  CREATE_POST_SCREEN_ANON_BUTTON_ON = 'CreatePostFlow-CreatePostFlow_IncogButton_on',
  CREATE_POST_SCREEN_ANON_BUTTON_OFF = 'CreatePostFlow-CreatePostFlow_IncogButton_off',
  CREATE_POST_SCREEN_PROFILE_BUTTON_CLICKED = 'CreatePostFlow-CreatePostFlow_profileButton_openProfile-MyProfile',
  CREATE_POST_SCREEN_TEXT_BOX_TYPED = 'CreatePostFlow-CreatePostFlow_textBox_typed',
  CREATE_POST_SCREEN_ADD_MEDIA_POLL_BUTTON_CLICKED = 'CreatePostFlow-CreatePostFlow_addMediaPollButton_openAddMediaPollPage',
  CREATE_POST_SCREEN_ADD_MEDIA_POLL_PAGE_ADD_POLL_CLICKED = 'CreatePostFlow-CreatePostFlow_addMediaPollPage-addPoll_openPollSection',
  CREATE_POST_SCREEN_POLL_SECTION_DURATION_BUTTON_CLICKED = 'CreatePostFlow-CreatePostFlow_pollSection-durationButton_openSetPollDuration',
  CREATE_POST_SCREEN_SET_POLL_DURATION_SET_BUTTON_CLICKED = 'CreatePostFlow-CreatePostFlow_setPollDuration-setButton_clicked',
  CREATE_POST_SCREEN_SET_POLL_DURATION_CANCEL_CLICKED = 'CreatePostFlow-CreatePostFlow_setPollDuration-cancel_clicked',
  CREATE_POST_SCREEN_SET_POLL_DURATION_CHANGE_DAYS_SET = 'CreatePostFlow-CreatePostFlow_setPollDuration-changeDays_set',
  CREATE_POST_SCREEN_SET_POLL_DURATION_CHANGE_HOURS_SET = 'CreatePostFlow-CreatePostFlow_setPollDuration-changeHours_set',
  CREATE_POST_SCREEN_SET_POLL_DURATION_CHANGE_MINUTES_SET = 'CreatePostFlow-CreatePostFlow_setPollDuration-changeMinutes_set',
  CREATE_POST_SCREEN_POLL_SECTION_MULTIPLE_CHOICE_BUTTON_ON = 'CreatePostFlow-CreatePostFlow_pollSection-multipleChoiceButton_on',
  CREATE_POST_SCREEN_POLL_SECTION_MULTIPLE_CHOICE_BUTTON_OFF = 'CreatePostFlow-CreatePostFlow_pollSection-multipleChoiceButton_off',
  CREATE_POST_SCREEN_POLL_SECTION_REMOVE_POLL_BUTTON_CLICKED = 'CreatePostFlow-CreatePostFlow_pollSection-removePollButton_clicked',
  CREATE_POST_SCREEN_ADD_MEDIA_POLL_UPLOAD_FROM_LIB_CLICKED = 'CreatePostFlow-CreatePostFlow_addMediaPoll-uploadFromLib_clicked',
  CREATE_POST_SCREEN_ADD_MEDIA_POLL_TAKE_PHOTO_CLICKED = 'CreatePostFlow-CreatePostFlow_addMediaPoll-takePhoto_clicked',
  CREATE_POST_SCREEN_PHOTO_UPLOADED_REMOVE_ALL_PHOTOS_CLICKED = 'CreatePostFlow-CreatePostFlow_photoUploaded-removeAllPhotos_clicked',
  CREATE_POST_SCREEN_PHOTO_UPLOADED_X_BUTTON_CLICKED = 'CreatePostFlow-CreatePostFlow_photoUploaded-XButton_clicked',
  CREATE_POST_SCREEN_PHOTO_UPLOADED_ADD_MORE_PHOTOS_PHOTO_REMOVED = 'CreatePostFlow-CreatePostFlow_photoUploaded-addMorePhotos_photoRemoved',
  CREATE_POST_SCREEN_AD_SET_ADD_COMMUNITIES_OPEN_COMMUNITY_TAGS = 'CreatePostFlow-CreatePostFlow_AdSetAddCommunities_openCommunityTags',
  CREATE_POST_SCREEN_COMMUNITY_TAGS = 'CreatePostFlow-CreatePostFlow_communityTags_{}',
  CREATE_POST_SCREEN_COMMUNITY_TAGS_SAVE_BUTTON_CLICKED = 'CreatePostFlow-CreatePostFlow_communityTags-saveButton_clicked',
  CREATE_POST_SCREEN_COMMUNITY_TAGS_CANCEL_CLICKED = 'CreatePostFlow-CreatePostFlow_communityTags-cancel_clicked',
  CREATE_POST_SCREEN_AD_SET_EXPIRATION_BUTTON_OPEN_EXPIRATION_SETTING = 'CreatePostFlow-CreatePostFlow_AdSetExpirationButton_openExpirationSetting',
  CREATE_POST_SCREEN_EXPIRATION_SETTING_CANCEL_CLICKED = 'CreatePostFlow-CreatePostFlow_expirationSetting-cancel_clicked',
  CREATE_POST_SCREEN_EXPIRATION_SETTING_CHOICE_24HR_CLICKED = 'CreatePostFlow-CreatePostFlow_expirationSetting-choice24hr_clicked',
  CREATE_POST_SCREEN_EXPIRATION_SETTING_CHOICE_7DAYS_CLICKED = 'CreatePostFlow-CreatePostFlow_expirationSetting-choice7days_clicked',
  CREATE_POST_SCREEN_EXPIRATION_SETTING_CHOICE_30DAYS_CLICKED = 'CreatePostFlow-CreatePostFlow_expirationSetting-choice30days_clicked',
  CREATE_POST_SCREEN_EXPIRATION_SETTING_CHOICE_NEVER_CLICKED = 'CreatePostFlow-CreatePostFlow_expirationSetting-choiceNever_clicked',
  CREATE_POST_SCREEN_POST_BUTTON_EMPTY_ALERTED = 'CreatePostFlow-CreatePostFlow_postButtonEmpy_alerted',
  CREATE_POST_SCREEN_POST_BUTTON_OPEN_MAIN_FEED = 'CreatePostFlow-CreatePostFlow_postButton_openMainFeed',
  CREATE_POST_SCREEN_ADD_COMMUNITY_BUTTON_OPEN_ADD_COMMS = 'CreatePostFlow-CreatePostFlow_addCommButton_openAddComms',
  CREATE_POST_SCREEN_ADD_COMMS_ADDED_COMM_NEW_COMM_ADDED = 'CreatePostFlow-CreatePostFlow_addComms-addedComm_newCommAdded',
  CREATE_POST_SCREEN_ADD_COMMS_DELETE_COMM_COMM_DELETED = 'CreatePostFlow-CreatePostFlow_addComms-deleteComm_commDeleted',
  CREATE_POST_SCREEN_ADD_COMMS_SAVE_COMMS_UPDATED = 'CreatePostFlow-CreatePostFlow_addComms-save_commsUpdated',
  CREATE_POST_SCREEN_ADD_COMMS_EXIT_CLICKED = 'CreatePostFlow-CreatePostFlow_addComms-exit_clicked',

  // CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_BACK_BUTTON_CLICKED = 'CreateCommunity-Post_backButton_openPrevPage',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_TEXT_BOX_TYPED = 'CreateCommunity-Post_textBox_typed',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_PROFILE_BUTTON_CLICKED = 'CreateCommunity-Post_profileButton_openProfile-MyProfile',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ANON_ON = 'CreateCommunity-Post_anonOn_on',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ANON_OFF = 'CreateCommunity-Post_anonOff_off',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_MEDIA_OR_POLL_BUTTON_POST_TYPE_BANNER_OPENED = 'CreateCommunity-Post_addMediaOrPollButton_postTypeBannerOpened',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_TYPE_BANNER_ADD_POLL = 'CreateCommunity-Post_postTypeBanner-addPoll_addPollFlow',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_TYPE_BANNER_UPLOAD_MEDIA = 'CreateCommunity-Post_postTypeBanner-uploadMedia_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_TYPE_BANNER_TAKE_PHOTO = 'CreateCommunity-Post_postTypeBanner-takePhoto_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_TYPE_BANNER_NON_SELECTED = 'CreateCommunity-Post_postTypeBanner-noneSelected_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_PHOTO_UPLOADED_REMOVE_ALL_PHOTOS_CLICKED = 'CreateCommunity-Post_photoUploaded-removeAllPhotos_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_PHOTO_UPLOADED_X_BUTTON_CLICKED = 'CreateCommunity-Post_photoUploaded-XButton_photoRemoved',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_PHOTO_UPLOADED_ADD_MORE_PHOTOS_UPLOAD_PHOTO_BANNER = 'CreateCommunity-Post_photoUploaded-addMorePhotos_uploadPhotoBanner',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_UPLOAD_PHOTO_BANNER_UPLOAD_MEDIA = 'CreateCommunity-Post_uploadPhotoBanner-uploadMedia_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_UPLOAD_PHOTO_BANNER_TAKE_PHOTO = 'CreateCommunity-Post_uploadPhotoBanner-takePhoto_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_UPLOAD_PHOTO_BANNER_CLOSE_BANNER_CLICKED = 'CreateCommunity-Post_uploadPhotoBanner-closeBanner_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_EDIT_CHOICE1 = 'CreateCommunity-Post_addPollFlow-editChoice1_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_EDIT_CHOICE2 = 'CreateCommunity-Post_addPollFlow-editChoice2_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_EDIT_CHOICE3 = 'CreateCommunity-Post_addPollFlow-editChoice3_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_EDIT_CHOICE4 = 'CreateCommunity-Post_addPollFlow-editChoice4_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_ADD_CHOICE3 = 'CreateCommunity-Post_addPollFlow-addChoice3_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_ADD_CHOICE4 = 'CreateCommunity-Post_addPollFlow-addChoice4_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_DELETE_CHOICE1 = 'CreateCommunity-Post_addPollFlow-deleteChoice1_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_DELETE_CHOICE2 = 'CreateCommunity-Post_addPollFlow-deleteChoice2_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_DELETE_CHOICE3 = 'CreateCommunity-Post_addPollFlow-deleteChoice3_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_DELETE_CHOICE4 = 'CreateCommunity-Post_addPollFlow-deleteChoice4_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_DURATION_BUTTON_OPEN_SET_POLL_DURATION = 'CreateCommunity-Post_addPollFlow-durationButton_openSetPollDuration',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_POLL_FLOW_REMOVE_POLL_CLICKED = 'CreateCommunity-Post_addPollFlow-removePoll_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_SET_POLL_DURATION_CHANGE_DAYS_SET = 'CreateCommunity-Post_setPollDuration-changeDays_set',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_SET_POLL_DURATION_CHANGE_HOURS_SET = 'CreateCommunity-Post_setPollDuration-changeHours_set',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_SET_POLL_DURATION_CHANGE_MINUTES_SET = 'CreateCommunity-Post_setPollDuration-changeMinutes_set',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_SET_POLL_DURATION_SET_BUTTON_NEW_DURATION_SET = 'CreateCommunity-Post_setPollDuration-setButton_newDurationSet',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_SET_POLL_DURATION_CANCEL_CLICKED = 'CreateCommunity-Post_setPollDuration-cancel_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_COMMUNITY_BUTTON_OPEN_ADD_COMMS = 'CreateCommunity-Post_addCommButton_openAddComms',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_COMMS_ADDED_COMM_NEW_COMM_ADDED = 'CreateCommunity-Post_addComms-addedComm_newCommAdded',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_COMMS_DELETE_COMM_COMM_DELETED = 'CreateCommunity-Post_addComms-deleteComm_commDeleted',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_COMMS_SAVE_COMMS_UPDATED = 'CreateCommunity-Post_addComms-save_commsUpdated',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_ADD_COMMS_EXIT_CLICKED = 'CreateCommunity-Post_addComms-exit_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_BUTTON_OPEN_POST_DURATION = 'CreateCommunity-Post_postDurationButton_openPostDuration',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_SET_24_HOURS_CLICKED = 'CreateCommunity-Post_PostDuration-set24Hours_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_SET_7_DAYS_CLICKED = 'CreateCommunity-Post_PostDuration-set7Days_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_SET_30_DAYS_CLICKED = 'CreateCommunity-Post_PostDuration-set30Days_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_SET_NEVER_CLICKED = 'CreateCommunity-Post_PostDuration-setNever_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_DURATION_CANCEL_CLICKED = 'CreateCommunity-Post_PostDuration-cancel_clicked',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_AND_CREATE_COMMUNITY_CREATED = 'CreateCommunity-Post_postAndCreate_CommunityCreated',
  CREATE_POST_FROM_CREATE_COMMUNITY_SCREEN_POST_BUTTON_EMPTY_ALERTED = 'CreateCommunity-Post_postButtonEmpty_alerted',

  // CREATE_COMMUNITY_SCREEN
  CREATE_COMMUNITY_SCREEN_NAME_NEXT_BUTTON_OPEN_CC_CUSTOMIZE_PAGE = 'CreateCommunity-Name_nextButton_openCC-CustomizePage',
  CREATE_COMMUNITY_SCREEN_BACK_BUTTON_CLICKED = 'CreateCommunity-Name_backButton_openPrevPage',
  CREATE_COMMUNITY_SCREEN_CHANGE_ICON_BUTTON_CLICKED = 'CreateCommunity-Customize_changeIconButton_clicked',
  CREATE_COMMUNITY_SCREEN_CHANGE_COMMUNITY_COVER_BUTTON_CLICKED = 'CreateCommunity-Customize_changeCommunityCoverButton_clicked',
  CREATE_COMMUNITY_SCREEN_SEARCH_USER_CLICKED = 'CreateCommunity-InternalShare_searchUser_clicked',
  CREATE_COMMUNITY_SCREEN_NEXT_BUTTON_OPEN_CREATE_POST_FLOW = 'CreateCommunity-InternalShare_nextButton_openCreatePostFlow',
  CREATE_COMMUNITY_SCREEN_SHARE_INVITATION_LINK_BUTTON_OPEN_EXTERNAL_SHARING_PAGE = 'CreateCommunity-InternalShare_shareInvitationLinkButton_openExternalSharingPage',
  CREATE_COMMUNITY_SCREEN_EXTERNAL_SHARING_CANCEL_BUTTON_CLICKED = 'CreateCommunity-InternalShare_externalsharingCancelButton_clicked',
  CREATE_COMMUNITY_SCREEN_NEXT_BUTTON_OPEN_CC_INTERNAL_SHARE_PAGE = 'CreateCommunity-Customize_customizePage-nextButton_openCC-InternalSharePage',
  CREATE_COMMUNITY_SCREEN_USER_NAME_SELECTED = 'CreateCommunity-InternalShare_userName_selected',
  CREATE_COMMUNITY_SCREEN_USER_NAME_UNSELECTED = 'CreateCommunity-InternalShare_userName_unselected',

  // BRANCH
  BRANCH_OPEN_APP = 'Branch-Helio-OpenApp_opened'
}

// const ENABLE_TOAST = ENV === 'Dev';
const ENABLE_TOAST = false;

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
