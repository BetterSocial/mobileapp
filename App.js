import {HumanIDProvider} from '@human-internet/react-native-humanid';
import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import Toast from 'react-native-toast-message';

import {BackHandler, View, KeyboardAvoidingView, Platform} from 'react-native';
import FlashMessage from 'react-native-flash-message';

import DeviceInfo from 'react-native-device-info';
import {appUpgradeVersionCheck} from 'app-upgrade-react-native-sdk';

import {LogLevel, OneSignal} from 'react-native-onesignal';
import {OverlayProvider, Streami18n} from 'stream-chat-react-native';
import {RecoilDebugObserver} from 'reactotron-recoil-plugin';
import {RecoilRoot} from 'recoil';
import {
  SafeAreaProvider,
  useSafeAreaFrame,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import {reactotronInstance} from './src/libraries/reactotron/reactotronInstance';

import Store from './src/context/Store';

import {APP_UPGRADE_API_KEY, ENV, ONE_SIGNAL_APP_ID} from './src/libraries/Configs/ENVConfig';
import {Analytics} from './src/libraries/analytics/firebaseAnalytics';
import {RootNavigator} from './src/navigations/root-stack';
import {linking} from './src/navigations/linking';
import {toastConfig} from './src/configs/ToastConfig';
import NetworkDebuggerModal from './src/components/NetworkDebuggerModal';
import useFirebaseRemoteConfig from './src/libraries/Configs/RemoteConfig';

const App = () => {
  const {top, bottom} = useSafeAreaInsets();
  const {height} = useSafeAreaFrame();
  const {initializeFirebaseRemoteConfig} = useFirebaseRemoteConfig();
  const streami18n = new Streami18n({
    language: 'en'
  });
  const navigationRef = React.useRef();
  const routeNameRef = React.useRef();
  const [currentScreen, setCurrentScreen] = React.useState('')

  React.useEffect(() => {
    try {
      initializeFirebaseRemoteConfig();
    } catch (error) {
      if (__DEV__) {
        console.log('app init: ', error);
      }
    }
    // return unsubscribe;
  }, []);

  const preventCloseApp = () => true;

  const backFunc = () => {
    navigationRef.current.goBack();
    return true;
  };

  const handleStateChange = () => {
    const isCanBack = navigationRef.current.canGoBack();
    if (!isCanBack) {
      BackHandler.removeEventListener('hardwareBackPress', backFunc);
      BackHandler.addEventListener('hardwareBackPress', preventCloseApp);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', preventCloseApp);
      BackHandler.addEventListener('hardwareBackPress', backFunc);
    }

    // log event
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute?.()?.name;
    if (Platform.OS === 'ios') {
      setCurrentScreen(currentRouteName);
    }
    if (currentRouteName && previousRouteName !== currentRouteName) {
      Analytics.trackingScreen(currentRouteName);
    }

    if (__DEV__) {
      console.log('current screen name: ', currentRouteName);
      console.tron.log('current screen name: ', currentRouteName);
    }

    routeNameRef.current = currentRouteName;
  };

  const onReadyState = () => {
    if (navigationRef.current) {
      routeNameRef.current = navigationRef.current?.getCurrentRoute?.()?.name;
    }
  };

  const appInfo = {
    appId: Platform.OS === 'ios' ? '1615684520' : 'org.bettersocial', // Your app id in play store or app store
    appName: DeviceInfo.getApplicationName(), // Your app name
    appVersion: DeviceInfo.getVersion(), // Your app version
    platform: Platform.OS, // App Platform, android or ios
    environment: ENV // App Environment, production, development
  };

  // Alert config is optional
  const alertConfig = {
    title: 'Update Notice',
    updateButtonTitle: 'Update Now',
    laterButtonTitle: 'Later',
    onDismissCallback: () => {
      if (__DEV__) {
        console.log('Dismiss');
      }
    },
    onLaterCallback: () => {
      if (__DEV__) {
        console.log('Later');
      }
    }
  };

  appUpgradeVersionCheck(appInfo, APP_UPGRADE_API_KEY, alertConfig);

  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(ENV === 'Prod' ? LogLevel.None : LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize(ONE_SIGNAL_APP_ID);

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  return (
    <>
      <HumanIDProvider />
      {/* <RealmProvider> */}
      <RecoilRoot>
        {__DEV__ ? <RecoilDebugObserver instance={reactotronInstance} /> : null}
        <Store>
          <NavigationContainer
            onReady={onReadyState}
            onStateChange={handleStateChange}
            ref={navigationRef}
            linking={linking}>
            <View>
              <OverlayProvider topInset={top} bottomInset={bottom} i18nInstance={streami18n}>
                <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding">
                  <RootNavigator areaHeight={height} currentScreen={currentScreen} />
                </KeyboardAvoidingView>
              </OverlayProvider>
            </View>
          </NavigationContainer>
        </Store>
        <NetworkDebuggerModal />
      </RecoilRoot>
      {/* </RealmProvider> */}
      <Toast config={toastConfig} />
      <FlashMessage position="top" />
    </>
  );
};

const RootApp = () => (
  <SafeAreaProvider
    initialMetrics={{
      insets: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    }}>
    <App />
  </SafeAreaProvider>
);

export default RootApp;
