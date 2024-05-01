/* eslint-disable no-shadow */
import {JsonMap, createClient} from '@segment/analytics-react-native';

import {SEGMENT_WRITE_KEY} from '../Configs/ENVConfig';

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
  ONBOARDING_USERNAME_PROFILE_PIC_IMAGE_UPLOADED = 'OB-Username_ProfilePic_updated',
  ONBOARDING_USERNAME_PROFILE_PIC_IMAGE_FAIL_UPLOAD = 'OB-Username_ProfilePic_failed',
  ONBOARDING_USERNAME_PROFILE_PIC_ALERT_SKIP = 'OB-Username_PicReminderAlert_skip',
  ONBOARDING_USERNAME_PROFILE_PIC_ALERT_ADD_PHOTO = 'OB-Username_PicReminderAlert_addProfilePic',

  // ONBOARDING SELECT LOCATION
  ONBOARDING_LOCATION_FIRST_OPEN_SEARCH = 'OB-Location_Location1_openSearch',
  ONBOARDING_LOCATION_FIRST_DELETED = 'OB-Location_Location1_deleted',
  ONBOARDING_LOCATION_SECOND_OPEN_SEARCH = 'OB-Location_Location2_openSearch',
  ONBOARDING_LOCATION_SECOND_DELETED = 'OB-Location_Location2_deleted',
  ONBOARDING_LOCATION_FIRST_SELECTED = 'OB-Location_Location1_hasLocationvalue',
  ONBOARDING_LOCATION_SECOND_SELECTED = 'OB-Location_Location2_hasLocationvalue',
  ONBOARDING_LOCATION_DRAWER_CLOSED = 'OB-Location_SearchBottomDrawer_closewithoutselection',

  // ONBOARDING REGISTRATION
  ONBOARDING_REGISTRATION_SUCCESS = 'OB-FollowUsers_API_CreateAccountSuccess',
  ONBOARDING_REGISTRATION_FAILED = 'OB-FollowUsers_API_CreateAccountFail'
}

const AnalyticsEventTracking = (() => {
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

      if (!additionalData) return client.track(event);

      return client.track(event, (additionalData || {}) as JsonMap);
    }
  };
})();

Object.freeze(AnalyticsEventTracking);

export default AnalyticsEventTracking;
