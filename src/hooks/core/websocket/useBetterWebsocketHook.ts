import * as React from 'react';
import Config from 'react-native-config';

import useSimpleWebsocketHooks from './useSimpleWebsocketHooks';
import TokenStorage, {ITokenEnum} from '../../../utils/storage/custom/tokenStorage';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {WebsocketUserDataType} from './types.d';
import {getAnonymousUserId, getUserId} from '../../../utils/users';

const useBetterWebsocketHook = () => {
  const generateUserDataUrlEncoded: (user: WebsocketUserDataType) => string = (user) => {
    const userData = {
      user_id: user?.userId,
      user_details: {
        id: user?.userId,
        name: user?.isAnonymous ? 'AnonymousUser' : user?.name,
        image: user?.isAnonymous ? DEFAULT_PROFILE_PIC_PATH : user?.image,
        invisible: true
      },
      user_token: user?.token,
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
  const initAuthorization = async (isAnonymous: boolean) => {
    const token = TokenStorage.get(isAnonymous ? ITokenEnum.anonymousToken : ITokenEnum.token);
    const userId = isAnonymous ? await getAnonymousUserId() : await getUserId();

    const urlEncodedData = generateUserDataUrlEncoded({
      userId,
      token,
      isAnonymous
    });

    const websocketUrl = generateWebsocketUrl(urlEncodedData, token);
    return websocketUrl;
  };

  const getSocketUrl: (isAnonymous: boolean) => Promise<string> = (isAnonymous: boolean) => {
    return new Promise((resolve) => {
      initAuthorization(isAnonymous).then((url) => {
        resolve(url);
      });
    });
  };

  const getAnonymousSocketUrl = React.useCallback(() => {
    return getSocketUrl(true);
  }, []);

  const getSignedSockerUrl = React.useCallback(() => {
    return getSocketUrl(false);
  }, []);

  // const {lastJsonMessage} = useSimpleWebsocketHooks(initAuthorization());
  const {lastJsonMessage} = useWebSocket(getAnonymousSocketUrl, {
    onOpen: () => console.log('opened 123'),
    shouldReconnect: (closeEvent) => true
  });

  const {lastJsonMessage: lastSignedMessage} = useWebSocket(getSignedSockerUrl, {
    onOpen: () => console.log('opened 456'),
    shouldReconnect: (closeEvent) => true
  });

  return {lastJsonMessage, lastSignedMessage};
};

export default useBetterWebsocketHook;
