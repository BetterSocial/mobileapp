import SimpleToast from 'react-native-simple-toast';
/* eslint-disable no-shadow */
import {JsonMap, createClient} from '@segment/analytics-react-native';

import {ENV, SEGMENT_WRITE_KEY} from '../Configs/ENVConfig';

/**
 * Please refer to this for all tracking enums.
 * https://docs.google.com/spreadsheets/d/1zkQzRPG9nKEXaoHI79nFXgL7WmSgp3qGRPVkHMxBzR0/edit#gid=1943812029
 */
export enum BetterSocialEventTracking {
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
  ONBOARDING_REGISTRATION_FAILED = 'OB-FollowUsers_API_CreateAccountFail'
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
