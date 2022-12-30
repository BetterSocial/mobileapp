import { HumanIDProvider } from '@human-internet/react-native-humanid';
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import Toast from 'react-native-toast-message';

import { BackHandler, View } from 'react-native'
import FlashMessage from 'react-native-flash-message';
import {
  SafeAreaProvider,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {RecoilRoot} from 'recoil';
import { OverlayProvider, Streami18n } from 'stream-chat-react-native';
import { RecoilDebugObserver } from 'reactotron-recoil-plugin';
import { reactotronInstance } from './src/libraries/reactotron/reactotronInstance';

import Store from './src/context/Store';
import { linking } from './src/navigations/linking';
import {RootNavigator} from './src/navigations/root-stack';
import { fetchRemoteConfig } from './src/utils/FirebaseUtil';
import {toastConfig} from './src/configs/ToastConfig'

if(!__DEV__) {
  console.log = function () {}
}



const App = () => {
  const { bottom, top } = useSafeAreaInsets();
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
      return true
  }

  const handleStateChange = () =>{
        const isCanBack = navigationRef.current.canGoBack()
        if(!isCanBack) {
          BackHandler.removeEventListener('hardwareBackPress', backFunc)
          BackHandler.addEventListener('hardwareBackPress', preventCloseApp)
        } else {
          BackHandler.removeEventListener('hardwareBackPress', preventCloseApp)
          BackHandler.addEventListener('hardwareBackPress', backFunc)
        }
  }


  const newLocal = (
    <>
      <HumanIDProvider />
      <RecoilRoot>
        <RecoilDebugObserver instance={reactotronInstance} />
        <Store>
          <NavigationContainer onStateChange={handleStateChange}  ref={navigationRef} linking={linking}>
            <View style={{paddingTop: top, paddingBottom: bottom}} >
            <OverlayProvider bottomInset={bottom} i18nInstance={streami18n}>
              <RootNavigator areaHeight={height} />
            </OverlayProvider>
            </View>
          </NavigationContainer>
        </Store>
      </RecoilRoot>
      <Toast config={toastConfig} />
      <FlashMessage position="top" />
    </>
  );
  return (
    newLocal
  );
};

const RootApp = () => (

  <SafeAreaProvider initialMetrics={{
     insets: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
  }} >
             <App />
  </SafeAreaProvider>
)

export default RootApp

