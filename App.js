import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import RootStack from './src/navigations/root-stack';
import {HumanIDProvider} from '@human-id/react-native-humanid';
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
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </>
  );
};

export default App;
