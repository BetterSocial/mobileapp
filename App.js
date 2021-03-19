import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import RootStack from './src/navigations/root-stack';
import {HumanIDProvider} from '@human-id/react-native-humanid';
import Store from './src/context/Store';
import FlashMessage from 'react-native-flash-message';
const App = () => {
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
