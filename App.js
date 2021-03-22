import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import RootStack from './src/navigations/root-stack';
import {HumanIDProvider} from '@human-id/react-native-humanid';
import Store from './src/context/Store';
import FlashMessage from 'react-native-flash-message';
import fetchRemoteConfig from './src/utils/FirebaseUtil';

const App = () => {
  useEffect(() => {
    const init = async () => {
      try {
        let data = await fetchRemoteConfig();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);
  return (
    <>
      <HumanIDProvider />
      <Store>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </Store>
      <FlashMessage position="top" />
    </>
  );
};

export default App;
