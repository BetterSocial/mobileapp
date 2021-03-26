import React, {useEffect, useState, useContext} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';

import {StreamChat} from 'stream-chat';
const chatClient = StreamChat.getInstance('q95x9hkbyd6p');
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
  useAttachmentPickerContext,
} from 'stream-chat-react-native';

const AppContext = React.createContext();

const ChannelScreen = (props) => {
  console.log(props);
  const [channel, setChannel] = useState(props.route.params.channel);
  const headerHeight = useHeaderHeight();
  const {setTopInset} = useAttachmentPickerContext();

  useEffect(() => {
    setTopInset(headerHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerHeight]);

  return (
    <SafeAreaView>
      <Chat client={chatClient}>
        <Channel channel={channel} keyboardVerticalOffset={headerHeight}>
          <View style={StyleSheet.absoluteFill}>
            <MessageList />
            <MessageInput />
          </View>
        </Channel>
      </Chat>
    </SafeAreaView>
  );
};

export default ChannelScreen;
