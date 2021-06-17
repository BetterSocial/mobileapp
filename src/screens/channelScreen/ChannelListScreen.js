import * as React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import {useHeaderHeight} from '@react-navigation/stack';
import {StreamChat} from 'stream-chat';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  useAttachmentPickerContext,
} from 'stream-chat-react-native';

const chatClient = StreamChat.getInstance('q95x9hkbyd6p');

const ChannelScreen = (props) => {
  console.log(props);
  const [channel, setChannel] = React.useState(props.route.params.channel);
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
