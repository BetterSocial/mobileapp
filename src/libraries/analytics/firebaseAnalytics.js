import analytics from '@react-native-firebase/analytics';

const FirebaseAnalytics = () => ({
    logEvent(eventName, param) {
      analytics().logEvent(eventName, param);
      if (__DEV__) {
        console.log('Log event: ', eventName);
        console.log('log Event params: ', param);
      }
    },
    trackingScreen(routeName) {
      analytics().logScreenView({
        screen_name: routeName,
        screen_class: routeName
      });
    },
    logLogin(method) {
      analytics().logLogin({ method });
    },
    setUserProperties(property) {
      analytics().setUserProperties(property);
    },
    setIdentifier(userId) {
      analytics().setUserId(userId);
    }
  });

export const Analytics = FirebaseAnalytics();
