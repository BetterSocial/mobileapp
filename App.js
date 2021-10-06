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
import messaging from '@react-native-firebase/messaging';

import Store from './src/context/Store';
import RootStack from './src/navigations/root-stack';
import fetchRemoteConfig from './src/utils/FirebaseUtil';
import PushNotification from 'react-native-push-notification';

const App = () => {
  const {bottom} = useSafeAreaInsets();

  const streami18n = new Streami18n({
    language: 'en',
  });

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };
  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'bettersosialid', // (required)
        channelName: 'bettersosial-chat', // (required)
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  React.useEffect(() => {
    // Register FCM token with stream chat server.
    requestPermission();
    createChannel();
    messaging().onMessage((remoteMessage) => {
      console.log('NOtifICAtion');
      console.log(remoteMessage);
      PushNotification.localNotification({
        id: '123',
        title: remoteMessage.notification.title,
        channelId: 'bettersosialid',
        message: remoteMessage.notification.body,
      });
    });
    // initFCM();
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
