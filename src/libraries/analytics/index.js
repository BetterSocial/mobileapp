import analytics from '@react-native-firebase/analytics';

const FirebaseAnalytics = () => ({
  logEvent(eventName, param = {}) {
    analytics().logEvent(eventName, param);
  },
  trackingScreen(routeName) {
    analytics().logScreenView({
      screen_name: routeName,
      screen_class: routeName,
    });
  },
  setUserProperties(property) {
    analytics().setUserProperties(property);
  },
  setIdentifier(userId) {
    analytics().setUserId(userId);
  },
});

export const Analytics = FirebaseAnalytics();
