/**
 * @format
 */
import 'react-native-gesture-handler';
import './src/libraries/reactotron/reactotronInstance';
import {enableScreens} from 'react-native-screens';
import config from 'react-native-config';
import {AppRegistry} from 'react-native';

import * as Sentry from '@sentry/react-native';
import {configureHumanID} from '@human-internet/react-native-humanid';
import DeviceInfo from 'react-native-device-info';

import App from './App';
import AppIcon from './src/components/AppIcon';
import {name as appName} from './app.json';

const code = DeviceInfo.getReadableVersion().split('.');
const bundleId = DeviceInfo.getBundleId();

const getEnvironmentName = () => {
  if (bundleId === 'org.bettersocial') {
    return 'production';
  }
  return 'development';
};

Sentry.init({
  dsn: 'https://a43104462e33443fb25cee8f98a8a6dc@o4505106987679744.ingest.sentry.io/4505106988597248',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  environment: getEnvironmentName(),
  tracesSampleRate: 1.0,
  release: '1.11.6',
  dist: code[3],
  enableNativeCrashHandling: true,
  enableNative: false
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
