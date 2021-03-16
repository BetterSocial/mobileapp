/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {configureHumanID} from '@human-id/react-native-humanid';
import AppIcon from './src/components/AppIcon';
configureHumanID({
  appName: 'ping',
  clientSecret:
    '.jx3kR9ytCGZZ_zTKr4IjIJznFBnpBAWmIjJU-7QW7ElBoCITu95BhhYsOIY_P-x',
  clientId: 'MOBILE_4E0TQ0DFLPCDQBAZQESUU4',
  Icon: AppIcon,
});
AppRegistry.registerComponent(appName, () => App);
