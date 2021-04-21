import {NavigationContainer} from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import RootStack from './src/navigations/root-stack';
import {HumanIDProvider} from '@human-id/react-native-humanid';
import Store from './src/context/Store';
import FlashMessage from 'react-native-flash-message';
import fetchRemoteConfig from './src/utils/FirebaseUtil';
import JWTDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {StreamChat} from 'stream-chat';
import {STREAM_API_KEY, DUMY_TOKEN_GETSTREAM} from '@env';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {OverlayProvider} from 'stream-chat-react-native';
import {Linking} from 'react-native';

const AppContext = React.createContext();

// const chatClient = StreamChat.getInstance(GETSTREAM_CLIENT);
const chatClient = new StreamChat(STREAM_API_KEY);

const App = () => {
  const {bottom} = useSafeAreaInsets();
  const [channel, setChannel] = useState();

  useEffect(() => {
    const init = async () => {
      try {
        let data = await fetchRemoteConfig();
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const setupClient = async () => {
      try {
        const value = await AsyncStorage.getItem('tkn-getstream');
        const decoded = await JWTDecode(value);
        let userId = decoded.user_id;
        console.log(userId);
        let user = {
          id: userId,
        };

        await chatClient.connectUser(user, value);
      } catch (err) {
        console.log(err);
      }
    };

    setupClient();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        console.log('link ', link);
      });
  }, []);

  return (
    <>
      <HumanIDProvider />
      <Store>
        <NavigationContainer>
          <AppContext.Provider value={{channel, setChannel}}>
            <OverlayProvider bottomInset={bottom}>
              <RootStack />
            </OverlayProvider>
          </AppContext.Provider>
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
