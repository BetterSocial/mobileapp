import * as React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Streami18n,
  useMessageInputContext,
} from 'stream-chat-react-native';
import {StreamChat} from 'stream-chat';

import {STREAM_API_KEY} from '@env';
import Header from '../../components/Chat/Header';
import InputMessage from '../../components/Chat/InputMessage';
import CostomListMessage from '../../components/Chat/CostomListMessage';

// const chatClient = new StreamChat(STREAM_API_KEY);
const chatClient = StreamChat.getInstance('dz5f4d5kzrue');
const streami18n = new Streami18n({
  language: 'en',
});
const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidGlnaHQtcXVlZW4tMiIsImV4cCI6MTYyNTc1MDQwOH0.A57gFzULfv8slbtY-F1WIQ-hjsCTRk9452vvOZOZzs8';

chatClient.connectUser(
  {
    id: 'tight-queen-2',
    name: 'tight',
    image: 'https://getstream.io/random_png/?id=tight-queen-2&name=tight',
  },
  userToken,
);
const channel = chatClient.channel('messaging', 'tight-queen-2', {
  // add as many custom fields as you'd like
  image: 'https://www.drupal.org/files/project-images/react.png',
  name: 'Talk about React',
  members: ['tight-queen-2'],
});
const ChatDetailPage = () => {
  console.log(JSON.stringify(channel.data));
  return (
    <SafeAreaView>
      <Chat client={chatClient} i18nInstance={streami18n}>
        <Channel channel={channel} keyboardVerticalOffset={50}>
          <View style={{flex: 1}}>
            <Header
              username={channel?.data?.name}
              profile={channel?.data?.image}
            />
            <MessageList Message={CostomListMessage} />

            <MessageInput Input={InputMessage} />
          </View>
        </Channel>
      </Chat>
    </SafeAreaView>
  );
};

export default ChatDetailPage;

const styles = StyleSheet.create({});
