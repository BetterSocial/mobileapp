import analytics from '@react-native-firebase/analytics';

import getFeatureLoggerInstance, {EFeatureLogFlag} from '../../utils/log/FeatureLog';

const {featLog} = getFeatureLoggerInstance(EFeatureLogFlag.firebaseUtils);

const FirebaseAnalytics = () => ({
  logEvent(eventName, param) {
    analytics().logEvent(eventName, param);
    if (__DEV__) {
      featLog('Log event: ', eventName);
      featLog('log Event params: ', param);
    }
  },
  trackingScreen(routeName) {
    analytics().logScreenView({
      screen_name: routeName,
      screen_class: routeName
    });
  },
  logLogin(method) {
    analytics().logLogin({method});
  },
  setUserProperties(property) {
    analytics().setUserProperties(property);
  },
  setIdentifier(userId) {
    analytics().setUserId(userId);
  }
});

export const Analytics = FirebaseAnalytics();
