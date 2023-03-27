/**
 * @format
 */
import 'react-native-gesture-handler';

import './src/libraries/reactotron/reactotronInstance';

import config from 'react-native-config';
import {AppRegistry} from 'react-native';
import {configureHumanID} from '@human-internet/react-native-humanid';
import {enableScreens} from 'react-native-screens';
import * as Sentry from '@sentry/react-native';
import DeviceInfo from 'react-native-device-info';

import App from './App';
import AppIcon from './src/components/AppIcon';
import {name as appName} from './app.json';

const code = DeviceInfo.getReadableVersion().split('.');
const bundleId = DeviceInfo.getBundleId();

const getEnvironmentName = () => {
  switch (bundleId) {
    case 'org.bettersocial':
      return 'production';
    default:
      return 'development';
  }
};
Sentry.init({
  dsn: 'https://ca8ff934141d4046914decc6d4127dcd@o4504717043040256.ingest.sentry.io/4504893177462784',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  environment: getEnvironmentName(),
  tracesSampleRate: 1.0,
  release: '1.11.6',
  dist: code[3],
  enableNativeCrashHandling: true,
  enableNative: true
});

enableScreens();
const {HUMAN_ID_CLIENT_ID, HUMAN_ID_CLIENT_SECRET} = config;
const clientSecret = HUMAN_ID_CLIENT_SECRET;
const clientId = HUMAN_ID_CLIENT_ID;

configureHumanID({
  appName: 'Better Social',
  clientSecret,
  clientId,
  Icon: AppIcon
});

AppRegistry.registerComponent(appName, () => App);
