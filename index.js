/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {configureHumanID} from '@human-id/react-native-humanid';
import {
  HUMAN_ID_APP_NAME,
  HUMAN_ID_CLIENT_SECRET_DEVELOPMENT,
  HUMAN_ID_CLIENT_ID_DEVELOPMENT,
  HUMAN_ID_CLIENT_SECRET_PRODUCTION,
  HUMAN_ID_CLIENT_ID_PRODUCTION
} from '@env';
import AppIcon from './src/components/AppIcon';

let clientSecret = __DEV__ ? HUMAN_ID_CLIENT_SECRET_DEVELOPMENT : HUMAN_ID_CLIENT_SECRET_PRODUCTION
let clientId =  __DEV__ ? HUMAN_ID_CLIENT_ID_DEVELOPMENT : HUMAN_ID_CLIENT_ID_PRODUCTION

configureHumanID({
  appName: HUMAN_ID_APP_NAME,
  clientSecret: clientSecret,
  clientId: clientId,
  Icon: AppIcon,
});
AppRegistry.registerComponent(appName, () => App);
