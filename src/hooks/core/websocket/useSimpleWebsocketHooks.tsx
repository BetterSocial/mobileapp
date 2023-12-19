/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import axios from 'axios';

import getFeatureLoggerInstance, {EFeatureLogFlag} from '../../../utils/log/FeatureLog';
import {GetstreamWebsocket} from './types.d';

export type UseSimpleWebsocketProps = {
  url: string;
  protocol?: string | string[];
};

const {featLog} = getFeatureLoggerInstance(EFeatureLogFlag.useSimpleWebsocketHook);

const useSimpleWebsocket = (url, protocol = undefined) => {
  const setupReconnectTimeoutId = React.useRef(null);
  const websocketRef = React.useRef<WebSocket | null>(null);
  const isInternetConnectedRef = React.useRef(true);

  const [lastJsonMessage, setLastJsonMessage] = React.useState<GetstreamWebsocket>();

  const closeSocket = () => {
    featLog('============= socket closes ===========');
    if (websocketRef?.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.removeEventListener('close', () => {});
      websocketRef.current.removeEventListener('error', () => {});
      websocketRef.current.removeEventListener('message', () => {});
      websocketRef.current.close();
    }
    if (setupReconnectTimeoutId.current) {
      clearTimeout(setupReconnectTimeoutId.current);
    }
  };

  const setupWebsocket = async () => {
    if (
      websocketRef?.current &&
      (websocketRef?.current?.readyState === WebSocket.OPEN ||
        websocketRef?.current?.readyState === WebSocket.CONNECTING)
    )
      return;
    featLog('============ SETUP WEBSOCKET ===========');

    const socket = new WebSocket(await url, protocol);

    socket.onclose = (event: CloseEvent) => {
      featLog('onclose', event);
      const {readyState} = websocketRef.current;
      websocketRef.current = null;
      if (
        isInternetConnectedRef?.current &&
        (readyState === WebSocket.CLOSED || readyState === WebSocket.CLOSING)
      )
        setTimeout(setupWebsocket, 1000);
    };

    socket.onerror = (event: Event) => {
      console.log('onerror', event);
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const json = JSON.parse(event.data);
        setLastJsonMessage(json);
      } catch (e) {
        console.log('onmessage error', e);
      }
    };

    websocketRef.current = socket;
  };

  const setupInternetConnectionChecking = async () => {
    try {
      await axios.get('https://google.com', {timeout: 5000});
      isInternetConnectedRef.current = true;
      featLog('=========== CONNECTION CHECKED: true ===============');
      setupWebsocket();
    } catch (e) {
      featLog('error checking connection');
      featLog(e);
      featLog('=========== CONNECTION CHECKED: false ===============');
      isInternetConnectedRef.current = false;
      closeSocket();
    }
  };

  React.useEffect(() => {
    setupWebsocket();
    const unsubscribeId = setInterval(setupInternetConnectionChecking, 5000);
    return () => {
      clearInterval(unsubscribeId);
      closeSocket();
    };
  }, []);

  return {
    lastJsonMessage
  };
};

export default useSimpleWebsocket;
