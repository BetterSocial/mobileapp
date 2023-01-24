/**
 * @format
 */
import 'react-native-gesture-handler';
import './src/libraries/reactotron/reactotronInstance';
import { enableScreens } from 'react-native-screens';
import config from 'react-native-config'
import { AppRegistry } from 'react-native';
import { configureHumanID } from '@human-internet/react-native-humanid';

import App from './App';
import AppIcon from './src/components/AppIcon';
import { name as appName } from './app.json';

enableScreens();
const { HUMAN_ID_CLIENT_ID, HUMAN_ID_CLIENT_SECRET} = config
const clientSecret = HUMAN_ID_CLIENT_SECRET;
const clientId = HUMAN_ID_CLIENT_ID;

configureHumanID({
  appName: 'Better Social',
  clientSecret,
  clientId,
  Icon: AppIcon,
});
// PushNotification.configure({
//   // (required) Called when a remote is received or opened, or local notification is opened
//   onNotification(notification) {
//     console.log('NOTIFICATION:', notification);
//     // process the notification
//     // (required) Called when a remote is received or opened, or local notification is opened
//     notification.finish(PushNotificationIOS.FetchResult.NoData);
//   },

//   // (optional) Called when the user fails to register for remote notifications.
//   // Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//   onRegistrationError(err) {
//     console.error(err.message, err);
//   },
//   // IOS ONLY (optional): default: all - Permissions to register.
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },
//   // Should the initial notification be popped automatically
//   // default: true
//   popInitialNotification: true,
//   requestPermissions: true,
// });

// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log('bg ', remoteMessage);
//   console.log('data, ', {
//     id: remoteMessage.messageId,
//     title: remoteMessage.notification.title,
//     channelId: 'bettersosialid',
//     message: remoteMessage.notification.body,
//   });
//   PushNotification.localNotification({
//     id: '123',
//     title: remoteMessage.notification.title,
//     channelId: 'bettersosialid',
//     message: remoteMessage.notification.body,
//   });
// });
AppRegistry.registerComponent(appName, () => App);
