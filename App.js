import * as React from 'react';

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
  React.useEffect(() => {
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
