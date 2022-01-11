import * as React from 'react';
import FlashMessage from 'react-native-flash-message';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import messaging from '@react-native-firebase/messaging';
import { HumanIDProvider } from '@human-id/react-native-humanid';
import { NavigationContainer } from '@react-navigation/native';
import { OverlayProvider, Streami18n } from 'stream-chat-react-native';
import {RecoilRoot} from 'recoil';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import RootStack from './src/navigations/root-stack';
import Store from './src/context/Store';
import { fetchRemoteConfig } from './src/utils/FirebaseUtil';
import { Platform } from 'react-native';

const App = () => {
  const { bottom } = useSafeAreaInsets();
  const isIos = Platform.OS === 'ios'
  const streami18n = new Streami18n({
    language: 'en',
  });

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
      || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const requestPermissionIos = () => {
    PushNotificationIOS.requestPermissions().then((res) => console.log(res)).catch((e) => console.log(e, 'eman'))
  }

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

  const pushNotifIos = (message) => {
    PushNotificationIOS.addNotificationRequest({
      alertBody: message.notification.body,
      alertTitle: message.notification.title
    })
  }

  const pushNotifAndroid = (remoteMessage) => {
    PushNotification.localNotification({
      id: '123',
      title: remoteMessage.notification.title,
      channelId: 'bettersosialid',
      message: remoteMessage.notification.body,
    });
  }

  React.useEffect(() => {
    // Register FCM token with stream chat server.
    !isIos ?     requestPermission() : requestPermissionIos()
    createChannel();
    const unsubscribe = messaging().onMessage((remoteMessage) => {
      console.log('NOtifICAtion');
      console.log('messag ', remoteMessage);
      !isIos ? pushNotifAndroid(remoteMessage) : pushNotifIos(remoteMessage)
   
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
    return unsubscribe;
  }, []);
  const newLocal = (
    <>
      <HumanIDProvider />
      <Store>
        <RecoilRoot>
        <NavigationContainer>
          <OverlayProvider bottomInset={bottom} i18nInstance={streami18n}>
            <RootStack />
          </OverlayProvider>
        </NavigationContainer>
        </RecoilRoot>
      </Store>
      <FlashMessage position="top" />
    </>
  );
  return (
    newLocal
  );
};

export default () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
);
