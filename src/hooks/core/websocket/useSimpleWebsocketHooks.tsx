/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import axios from 'axios';

export type UseSimpleWebsocketProps = {
  url: string;
  protocol?: string | string[];
};

const useSimpleWebsocket = (url, protocol = null) => {
  const setupReconnectTimeoutId = React.useRef(null);
  const websocketRef = React.useRef<WebSocket | null>(null);
  const isInternetConnectedRef = React.useRef(true);

  const [lastJsonMessage, setLastJsonMessage] = React.useState({});

  const closeSocket = () => {
    console.log('============= socket closes ===========');
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
    console.log('============ SETUP WEBSOCKET ===========');

    const socket = new WebSocket(await url, protocol);

    socket.onclose = (event: CloseEvent) => {
      console.log('onclose', event);
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
      console.log('=========== CONNECTION CHECKED: true ===============');
      setupWebsocket();
    } catch (e) {
      console.log('error checking connection');
      console.log(e);
      console.log('=========== CONNECTION CHECKED: false ===============');
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
