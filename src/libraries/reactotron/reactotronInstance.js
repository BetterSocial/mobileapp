import AsyncStorage from '@react-native-async-storage/async-storage';
// eslint-disable-next-line import/no-extraneous-dependencies
import reactotron, {networking, openInEditor} from 'reactotron-react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
// import ReactotronFlipper from 'reactotron-react-native/dist/flipper';
// eslint-disable-next-line import/no-extraneous-dependencies
import {reactotronRecoilPlugin} from 'reactotron-recoil-plugin';

export const reactotronInstance = reactotron
  .setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure({
    name: 'HelioDev'
  }) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(openInEditor())
  .use(
    networking({
      ignoreUrls: /localhost/
    })
  )
  .use(reactotronRecoilPlugin());

if (__DEV__) {
  reactotronInstance.clear();
  reactotronInstance.connect();

  global.console.tron = reactotronInstance;
}
