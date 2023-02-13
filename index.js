/**
 * @format
 */
import 'react-native-gesture-handler';

import './src/libraries/reactotron/reactotronInstance';

import config from 'react-native-config';
import {AppRegistry} from 'react-native';
import {configureHumanID} from '@human-internet/react-native-humanid';
import {enableScreens} from 'react-native-screens';

import App from './App';
import AppIcon from './src/components/AppIcon';
import {name as appName} from './app.json';

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
