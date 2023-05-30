import * as React from 'react';
import Config from 'react-native-config';
import useWebSocket from 'react-native-use-websocket';

import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {getAnonymousToken} from '../../../utils/token';
import {getAnonymousUserId} from '../../../utils/users';

const useBetterWebsocketHook = () => {
  const generateUserDataUrlEncoded: (userId: string, token: string) => string = (
    userId: string,
    token: string
  ) => {
    const userData = {
      user_id: userId,
      user_details: {
        id: userId,
        name: 'AnonymousUser',
        image: DEFAULT_PROFILE_PIC_PATH,
        invisible: true
      },
      user_token: token,
      server_determines_connection_id: true
    };

    return encodeURIComponent(JSON.stringify(userData));
  };

  const generateWebsocketUrl: (urlEncodedData: string, token: string) => string = (
    urlEncodedData,
    token
  ) => {
    return (
      `wss://chat-us-east-1.stream-io-api.com/connect?json=${urlEncodedData}&api_key=${Config.STREAM_API_KEY}&authorization=${token}&stream-auth-type=jwt` +
      '&X-Stream-Client=stream-chat-javascript-client-browser-4.2.0'
    );
  };

  const initAuthorization = async () => {
    const token: any = await getAnonymousToken();
    const userId: string = await getAnonymousUserId();

    const urlEncodedData = generateUserDataUrlEncoded(userId, token);
    const websocketUrl = generateWebsocketUrl(urlEncodedData, token);
    return websocketUrl;
  };

  const getSocketUrl: () => Promise<string> = React.useCallback(() => {
    return new Promise((resolve) => {
      initAuthorization().then((url) => {
        resolve(url);
      });
    });
  }, []);

  const {lastJsonMessage} = useWebSocket(getSocketUrl, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => true
  });

  return {lastJsonMessage};
};

export default useBetterWebsocketHook;
