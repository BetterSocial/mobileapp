import * as React from 'react';
import {PermissionsAndroid} from 'react-native';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import FlashMessage from 'react-native-flash-message';
import {OverlayProvider, Streami18n} from 'stream-chat-react-native';
import {NavigationContainer} from '@react-navigation/native';
import {HumanIDProvider} from '@human-id/react-native-humanid';

import Store from './src/context/Store';
import RootStack from './src/navigations/root-stack';
import fetchRemoteConfig from './src/utils/FirebaseUtil';

const App = () => {
  const {bottom} = useSafeAreaInsets();
  const streami18n = new Streami18n({
    language: 'en',
  });
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    requestCameraPermission();
    const init = async () => {
      try {
        fetchRemoteConfig();
      } catch (error) {
        console.log('app ', error);
      }
    };
    init();
  }, []);

  return (
    <>
      <HumanIDProvider />
      <Store>
        <NavigationContainer>
          <OverlayProvider bottomInset={bottom} i18nInstance={streami18n}>
            <RootStack />
          </OverlayProvider>
        </NavigationContainer>
      </Store>
      <FlashMessage position="top" />
    </>
  );
};

export default () => {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
};
