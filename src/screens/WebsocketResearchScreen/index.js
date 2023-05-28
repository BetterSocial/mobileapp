/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import * as React from 'react';
import useWebSocket from 'react-native-use-websocket';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import clientStream from '../../utils/getstream/streamer';
import {Button} from '../../components/Button';

const WEBSOCKET_URL_SIGNED =
  'wss://chat-us-east-1.stream-io-api.com/connect?json=%7B%22user_id%22%3A%22456dc8eb-7948-4078-bbde-5472ffde20b1%22%2C%22user_details%22%3A%7B%22id%22%3A%22456dc8eb-7948-4078-bbde-5472ffde20b1%22%2C%22name%22%3A%22Halofajarismv2%22%2C%22image%22%3A%22https%3A%2F%2Fres.cloudinary.com%2Fhpjivutj2%2Fimage%2Fupload%2Fv1680929851%2Fdefault-profile-picture_vrmmdn.png%22%2C%22invisible%22%3Atrue%7D%2C%22user_token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDU2ZGM4ZWItNzk0OC00MDc4LWJiZGUtNTQ3MmZmZGUyMGIxIiwiZXhwIjoxNjg3MzE1OTk5fQ.xUTPFMneVMxX4Y-44EDrdlkee914GNi7uygs9zdWGNE%22%2C%22server_determines_connection_id%22%3Atrue%7D&api_key=hqfuwk78kb3n&authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDU2ZGM4ZWItNzk0OC00MDc4LWJiZGUtNTQ3MmZmZGUyMGIxIiwiZXhwIjoxNjg3MzE1OTk5fQ.xUTPFMneVMxX4Y-44EDrdlkee914GNi7uygs9zdWGNE&stream-auth-type=jwt&X-Stream-Client=stream-chat-javascript-client-browser-4.2.0';
const WEBSOCKET_URL_ANONYMOUS =
  'wss://chat-us-east-1.stream-io-api.com/connect?json=%7B%22user_id%22%3A%22f871c9fd-ab79-41af-97df-d8f7fff44d0d%22%2C%22user_details%22%3A%7B%22id%22%3A%22f871c9fd-ab79-41af-97df-d8f7fff44d0d%22%2C%22name%22%3A%22AnonymousUser%22%2C%22image%22%3A%22https%3A%2F%2Fres.cloudinary.com%2Fhpjivutj2%2Fimage%2Fupload%2Fv1680929851%2Fdefault-profile-picture_vrmmdn.png%22%2C%22invisible%22%3Atrue%7D%2C%22user_token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NDk5NTc2fQ.Dlh0evVcCJcXOD0Foaxy3oHlSV2ZE4LEt7jpWuE65hg%22%2C%22server_determines_connection_id%22%3Atrue%7D&api_key=hqfuwk78kb3n&authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NDk5NTc2fQ.Dlh0evVcCJcXOD0Foaxy3oHlSV2ZE4LEt7jpWuE65hg&stream-auth-type=jwt&X-Stream-Client=stream-chat-javascript-client-browser-4.2.0';

const WebsocketResearchScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = React.useState([]);

  const {lastJsonMessage} = useWebSocket(WEBSOCKET_URL_ANONYMOUS, {
    onOpen: () => console.log('opened'),
    shouldReconnect: () => true
  });

  React.useEffect(() => {
    if (!lastJsonMessage) return;

    const {type} = lastJsonMessage;

    console.log(lastJsonMessage);
    if (type === 'health.check') return;

    if (type === 'notification.message_new') {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages.push(lastJsonMessage);
        return newMessages;
      });
    }
  }, [lastJsonMessage]);

  React.useEffect(() => {
    const client = clientStream(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NzkxMDk1fQ.EOuemYn_JJclLN31QLYwjSSAMm3s_tBjaOr21YQ4Go0'
    );
    // console.log('client');
    // console.log(client);
    const notifFeed = client.feed(
      'notification',
      'f871c9fd-ab79-41af-97df-d8f7fff44d0d',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NzkxMDk1fQ.EOuemYn_JJclLN31QLYwjSSAMm3s_tBjaOr21YQ4Go0'
    );

    notifFeed.subscribe((data) => {
      console.log('data');
      console.log(data);
    });

    return () => {
      notifFeed.unsubscribe();
    };
  }, []);

  /**
   * @type {WebSocket} ws
   */
  let ws;

  /**
   * @type {WebSocket} ws
   */
  let ws2;

  // const tryConnectWebsocket = () => {
  //   ws = new WebSocket(WEBSOCKET_URL_SIGNED);
  //   ws.onopen = () => {
  //     // connection opened
  //     //   ws.send('something'); // send a message
  //     console.log('connected');
  //   };

  //   ws.onmessage = (e) => {
  //     console.log('e?.data');
  //     console.log(e?.data);
  //     const data = JSON.parse(e?.data || {});
  //     const {type} = data;
  //     if (type === 'health.check') return;

  //     setMessages((prev) => {
  //       const newMessages = [...prev];
  //       newMessages.push({
  //         ...data,
  //         userType: 'signed'
  //       });
  //       return newMessages;
  //     });
  //   };

  //   ws.onerror = (e) => {
  //     // an error occurred
  //     console.error(e.message);
  //   };

  //   ws.onclose = (e) => {
  //     // connection closed
  //     console.log('onclose');
  //     console.log(e.code, e.reason);
  //   };
  // };
  // const tryConnectWebsocketAnonymous = () => {
  //   ws2 = new WebSocket(WEBSOCKET_URL_ANONYMOUS);
  //   ws2.onopen = () => {
  //     // connection opened
  //     //   ws2.send('something'); // send a message
  //     console.log('connected anonymous');
  //   };

  //   ws2.onmessage = (e) => {
  //     console.log('e?.data anonymous');
  //     console.log(e?.data);
  //     const data = JSON.parse(e?.data || {});
  //     const {type} = data;
  //     if (type === 'health.check') return;

  //     setMessages((prev) => {
  //       const newMessages = [...prev];
  //       newMessages.push({
  //         ...data,
  //         userType: 'anonymous'
  //       });
  //       return newMessages;
  //     });
  //   };

  //   ws2.onerror = (e) => {
  //     // an error occurred
  //     console.error(e.message);
  //   };

  //   ws2.onclose = (e) => {
  //     // connection closed
  //     console.log('onclose');
  //     console.log(e.code, e.reason);
  //   };
  // };

  React.useEffect(() => {
    // tryConnectWebsocket();
    // tryConnectWebsocketAnonymous();
    // return () => {
    //   ws.close();
    //   ws2.close();
    // };
  }, []);
  return (
    <View>
      <Button onPress={navigation.goBack}>Back</Button>
      <Text>WebsocketResearchScreen</Text>
      {messages.map((item, index) => {
        return (
          <View key={index}>
            <Text>{`${item?.userType}: ${item?.message?.text}`}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default WebsocketResearchScreen;
