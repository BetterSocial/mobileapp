import * as React from 'react';
import FlashMessage from 'react-native-flash-message';
import Toast from 'react-native-toast-message';
import {BackHandler, KeyboardAvoidingView, Platform, View} from 'react-native';
import {HumanIDProvider} from '@human-internet/react-native-humanid';
import {NavigationContainer} from '@react-navigation/native';

import DeviceInfo from 'react-native-device-info';
import {appUpgradeVersionCheck} from 'app-upgrade-react-native-sdk';
import {OverlayProvider, Streami18n} from 'stream-chat-react-native';
import {RecoilDebugObserver} from 'reactotron-recoil-plugin';
import {RecoilRoot} from 'recoil';
import {
  SafeAreaProvider,
  useSafeAreaFrame,
  useSafeAreaInsets
} from 'react-native-safe-area-context';

import Store from './src/context/Store';
import {Analytics} from './src/libraries/analytics/firebaseAnalytics';
import {RootNavigator} from './src/navigations/root-stack';
import {fetchRemoteConfig} from './src/utils/FirebaseUtil';
import {linking} from './src/navigations/linking';
import {reactotronInstance} from './src/libraries/reactotron/reactotronInstance';
import {toastConfig} from './src/configs/ToastConfig';
import {APP_UPGRADE_API_KEY, ENV} from './src/libraries/Configs/ENVConfig';

const App = () => {
  const {bottom, top} = useSafeAreaInsets();
  const {height} = useSafeAreaFrame();
  const streami18n = new Streami18n({
    language: 'en'
  });
  const navigationRef = React.useRef();
  const routeNameRef = React.useRef();

  React.useEffect(() => {
    const init = async () => {
      try {
        fetchRemoteConfig();
      } catch (error) {
        if (__DEV__) {
          console.log('app ', error);
        }
      }
    };

    init();
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
            <View style={{paddingTop: top, paddingBottom: bottom}}>
              <OverlayProvider bottomInset={bottom} i18nInstance={streami18n}>
                <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior="padding">
                  <RootNavigator areaHeight={height} />
                </KeyboardAvoidingView>
              </OverlayProvider>
            </View>
          </NavigationContainer>
        </Store>
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