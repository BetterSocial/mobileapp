import * as React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import {useHeaderHeight} from '@react-navigation/stack';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Streami18n,
  useAttachmentPickerContext,
} from 'stream-chat-react-native';
import {Context} from '../../context';
const streami18n = new Streami18n({
  language: 'en',
});

const ChannelScreen = () => {
  const [channel] = React.useContext(Context).channel;
  const [client] = React.useContext(Context).client;
  const headerHeight = useHeaderHeight();
  const {setTopInset} = useAttachmentPickerContext();

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'Channel Screen',
      screen_name: 'Channel',
    });
    setTopInset(headerHeight);
  }, [headerHeight]);

  return (
    <SafeAreaView>
      {client.client && channel.channel && (
        <Chat client={client.client} i18nInstance={streami18n}>
          <Channel
            channel={channel.channel}
            keyboardVerticalOffset={headerHeight}>
            <View style={StyleSheet.absoluteFill}>
              <MessageList />
              <MessageInput />
            </View>
          </Channel>
        </Chat>
      )}
    </SafeAreaView>
  );
};

export default ChannelScreen;
