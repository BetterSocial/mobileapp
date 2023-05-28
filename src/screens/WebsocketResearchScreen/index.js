/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import * as React from 'react';
import useWebSocket from 'react-native-use-websocket';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import ChannelList from '../../database/schema/ChannelListSchema';
import clientStream from '../../utils/getstream/streamer';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {Button} from '../../components/Button';

const WEBSOCKET_URL_SIGNED =
  'wss://chat-us-east-1.stream-io-api.com/connect?json=%7B%22user_id%22%3A%22456dc8eb-7948-4078-bbde-5472ffde20b1%22%2C%22user_details%22%3A%7B%22id%22%3A%22456dc8eb-7948-4078-bbde-5472ffde20b1%22%2C%22name%22%3A%22Halofajarismv2%22%2C%22image%22%3A%22https%3A%2F%2Fres.cloudinary.com%2Fhpjivutj2%2Fimage%2Fupload%2Fv1680929851%2Fdefault-profile-picture_vrmmdn.png%22%2C%22invisible%22%3Atrue%7D%2C%22user_token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDU2ZGM4ZWItNzk0OC00MDc4LWJiZGUtNTQ3MmZmZGUyMGIxIiwiZXhwIjoxNjg3MzE1OTk5fQ.xUTPFMneVMxX4Y-44EDrdlkee914GNi7uygs9zdWGNE%22%2C%22server_determines_connection_id%22%3Atrue%7D&api_key=hqfuwk78kb3n&authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNDU2ZGM4ZWItNzk0OC00MDc4LWJiZGUtNTQ3MmZmZGUyMGIxIiwiZXhwIjoxNjg3MzE1OTk5fQ.xUTPFMneVMxX4Y-44EDrdlkee914GNi7uygs9zdWGNE&stream-auth-type=jwt&X-Stream-Client=stream-chat-javascript-client-browser-4.2.0';
const WEBSOCKET_URL_ANONYMOUS =
  'wss://chat-us-east-1.stream-io-api.com/connect?json=%7B%22user_id%22%3A%22f871c9fd-ab79-41af-97df-d8f7fff44d0d%22%2C%22user_details%22%3A%7B%22id%22%3A%22f871c9fd-ab79-41af-97df-d8f7fff44d0d%22%2C%22name%22%3A%22AnonymousUser%22%2C%22image%22%3A%22https%3A%2F%2Fres.cloudinary.com%2Fhpjivutj2%2Fimage%2Fupload%2Fv1680929851%2Fdefault-profile-picture_vrmmdn.png%22%2C%22invisible%22%3Atrue%7D%2C%22user_token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NDk5NTc2fQ.Dlh0evVcCJcXOD0Foaxy3oHlSV2ZE4LEt7jpWuE65hg%22%2C%22server_determines_connection_id%22%3Atrue%7D&api_key=hqfuwk78kb3n&authorization=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjg3MWM5ZmQtYWI3OS00MWFmLTk3ZGYtZDhmN2ZmZjQ0ZDBkIiwiZXhwIjoxNjg3NDk5NTc2fQ.Dlh0evVcCJcXOD0Foaxy3oHlSV2ZE4LEt7jpWuE65hg&stream-auth-type=jwt&X-Stream-Client=stream-chat-javascript-client-browser-4.2.0';

const WebsocketResearchScreen = () => {
  const navigation = useNavigation();
  /**
   * @type {[ChannelList[], (messages: ChannelList[]) => void]}
   */
  const [messages, setMessages] = React.useState([]);

  const {localDb} = useLocalDatabaseHook();

  const {lastJsonMessage} = useWebSocket(WEBSOCKET_URL_ANONYMOUS, {
    onOpen: () => console.log('opened'),
    shouldReconnect: () => true
  });

  const initChannelListData = async () => {
    if (!localDb) return;
    const data = await ChannelList.getAll(localDb);
    console.log('data');
    console.log(data);
    setMessages(data);
  };

  const saveChannelListData = async () => {
    if (!localDb) return;
    const channelList = ChannelList.fromWebsocketObject(lastJsonMessage);
    channelList.save(localDb);
    initChannelListData();
  };

  React.useEffect(() => {
    if (!lastJsonMessage && !localDb) return;

    const {type} = lastJsonMessage;

    console.log(lastJsonMessage?.channel?.members);
    if (type === 'health.check') return;

    if (type === 'notification.message_new') {
      saveChannelListData();
    }
  }, [lastJsonMessage, localDb]);

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

    initChannelListData();

    return () => {
      notifFeed.unsubscribe();
    };
  }, [localDb]);

  return (
    <View>
      <Button onPress={navigation.goBack}>Back</Button>
      <Text>WebsocketResearchScreen</Text>
      {messages.map((item, index) => {
        return (
          <View key={index}>
            <Text>{`${item?.name}: ${item?.description}`}</Text>
            <Text>{item?.last_updated_at}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default WebsocketResearchScreen;
