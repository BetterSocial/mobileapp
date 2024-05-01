/* eslint-disable no-shadow */
import {JsonMap, createClient} from '@segment/analytics-react-native';

import {SEGMENT_WRITE_KEY} from '../Configs/ENVConfig';

export enum BetterSocialEventTracking {
  // ONBOARDING HUMAN ID
  HUMAN_ID_BUTTON_CLICKED = 'PreLogin-Slider5Login_hIDbutton_Clicked',
  HUMAN_ID_SUCCESS_EXISTING_ACCOUNT = 'external_alert_humanID-Relogin',
  HUMAN_ID_SUCCESS_NEW_REGISTRATION = 'OB-Username_na_verified',
  HUMAN_ID_FAILED_VERIFICATION = 'external_API_failed_verification'

  // ONBOARDING REGISTRATION
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
