import * as React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Streami18n,
} from 'stream-chat-react-native';

import Header from '../../components/Chat/Header';
import InputMessage from '../../components/Chat/InputMessage';
import CostomListMessage from '../../components/Chat/CostomListMessage';
import {Context} from '../../context';

const streami18n = new Streami18n({
  language: 'en',
});

const ChatDetailPage = () => {
  const [clients] = React.useContext(Context).client;
  const [channelClient] = React.useContext(Context).channel;
  if (clients.client && channelClient.channel) {
    return (
      <SafeAreaView>
        <Chat client={clients.client} i18nInstance={streami18n}>
          <Channel
            channel={channelClient.channel}
            keyboardVerticalOffset={50}
            hasFilePicker={false}>
            <View style={{flex: 1}}>
              <Header
                username={channelClient.channel?.data?.name}
                profile={channelClient.channel?.data?.image}
              />
              <MessageList Message={CostomListMessage} />

              <MessageInput Input={InputMessage} />
            </View>
          </Channel>
        </Chat>
        {/* <Text>he</Text> */}
      </SafeAreaView>
    );
  }
  return <View />;
};

export default ChatDetailPage;

const styles = StyleSheet.create({});
