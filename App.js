import * as React from 'react';
import FlashMessage from 'react-native-flash-message';
import { HumanIDProvider } from '@human-id/react-native-humanid';
import { NavigationContainer } from '@react-navigation/native';
import { OverlayProvider, Streami18n } from 'stream-chat-react-native';
import {
  SafeAreaProvider,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {RecoilRoot} from 'recoil';
import { Platform, BackHandler } from 'react-native';
import {RootNavigator} from './src/navigations/root-stack';
import Store from './src/context/Store';
import { fetchRemoteConfig } from './src/utils/FirebaseUtil';
import { linking } from './src/navigations/linking';

if(!__DEV__) {
  console.log = function () {}
}

const App = () => {
  const { bottom } = useSafeAreaInsets();
  const {height} = useSafeAreaFrame()
  const streami18n = new Streami18n({
    language: 'en',
  });
  const navigationRef = React.useRef()

  React.useEffect(() => {
    const init = async () => {
      try {
        fetchRemoteConfig();
      } catch (error) {
        if (__DEV__) {
          console.log('app ', error);
        }
      }
    };
    init();
    // return unsubscribe;
  }, []);

  const preventCloseApp = () => true

  const backFunc = () => {
      navigationRef.current.goBack()
  }

  const handleStateChange = () =>{
        const isCanBack = navigationRef.current.canGoBack()
        if(!isCanBack) {
          BackHandler.addEventListener('hardwareBackPress', preventCloseApp)
        } else {
          // BackHandler.removeEventListener('hardwareBackPress', preventCloseApp)
          BackHandler.addEventListener('hardwareBackPress', backFunc)
        }
  }


  const newLocal = (
    <>
      <HumanIDProvider />
      <RecoilRoot>
        <Store>
          <NavigationContainer onStateChange={handleStateChange}  ref={navigationRef} linking={linking}>
            <OverlayProvider bottomInset={bottom} i18nInstance={streami18n}>
              <RootNavigator areaHeight={height} />
            </OverlayProvider>
          </NavigationContainer>
        </Store>
      </RecoilRoot>
      <FlashMessage position="top" />
    </>
  );
  return (
    newLocal
  );
};

const RootApp = () => (
  <SafeAreaProvider>
    <App />
  </SafeAreaProvider>
)

export default RootApp

