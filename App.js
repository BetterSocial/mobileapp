import * as React from 'react';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import JWTDecode from 'jwt-decode';
import 'react-native-gesture-handler';
import {StreamChat} from 'stream-chat';
import FlashMessage from 'react-native-flash-message';
import {OverlayProvider} from 'stream-chat-react-native';
import {NavigationContainer} from '@react-navigation/native';
import {HumanIDProvider} from '@human-id/react-native-humanid';

import {STREAM_API_KEY} from '@env';
import Store from './src/context/Store';
import {getAccessToken} from './src/utils/token';
import RootStack from './src/navigations/root-stack';
import fetchRemoteConfig from './src/utils/FirebaseUtil';

const AppContext = React.createContext();

// const chatClient = StreamChat.getInstance(GETSTREAM_CLIENT);
const chatClient = new StreamChat(STREAM_API_KEY);

const App = () => {
  const {bottom} = useSafeAreaInsets();
  const [channel, setChannel] = React.useState();

  React.useEffect(() => {
    const init = async () => {
      try {
        fetchRemoteConfig();
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  React.useEffect(() => {
    const setupClient = async () => {
      try {
        const token = await getAccessToken();
        const userId = await JWTDecode(token).user_id;
        let user = {
          id: userId,
        };

        await chatClient.connectUser(user, token);
      } catch (err) {
        console.log(err);
      }
    };

    setupClient();
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
