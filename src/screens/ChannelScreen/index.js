import * as React from 'react';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  MessageSimple,
  Streami18n,
  useAttachmentPickerContext
} from 'stream-chat-react-native';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {useHeaderHeight} from '@react-navigation/stack';

import {Context} from '../../context';

const ChannelScreen = () => {
  const streami18n = new Streami18n({
    language: 'en'
  });
  const [channel] = React.useContext(Context).channel;
  const [client] = React.useContext(Context).client;
  const headerHeight = useHeaderHeight();
  const {setTopInset} = useAttachmentPickerContext();

  React.useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight]);

  // const theme = {
  //   messageSimple: {
  //     gallery: {
  //       galleryContainer: {
  //         backgroundColor: 'red',
  //       },
  //     },
  //     content: {
  //       container: {
  //         backgroundColor: 'orange',
  //         flex: 1,
  //       },
  //       containerInner: {
  //         borderWidth: 2,
  //         borderColor: 'red',
  //         backgroundColor: 'blue',
  //         width: 200,
  //       },
  //     },
  //   },
  // };

  return (
    <SafeAreaView>
      <StatusBar translucent={false} barStyle={'light-content'} />
      {client.client && channel.channel && (
        <Chat client={client.client} i18nInstance={streami18n}>
          <Channel
            channel={channel.channel}
            MessageSimple={CustomComponent}
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

const CustomComponent = (props) => <MessageSimple {...props} />;
