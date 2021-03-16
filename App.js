import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import 'react-native-gesture-handler';
import RootStack from './src/navigations/root-stack';
import {HumanIDProvider} from '@human-id/react-native-humanid';
const App = () => {
  return (
    <>
      <HumanIDProvider />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </>
  );
};

export default App;
