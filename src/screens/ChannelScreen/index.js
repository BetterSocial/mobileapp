import * as React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import {useHeaderHeight} from '@react-navigation/stack';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  MessageSimple,
  Streami18n,
  useAttachmentPickerContext,
} from 'stream-chat-react-native';
import {Context} from '../../context';

const ChannelScreen = () => {
  const streami18n = new Streami18n({
    language: 'en',
  });
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
  const theme = {
    messageSimple: {
      gallery: {
        galleryContainer: {
          backgroundColor: 'red',
        },
      },
      content: {
        container: {
          backgroundColor: 'orange',
          flex: 1,
        },
        containerInner: {
          borderWidth: 2,
          borderColor: 'red',
          backgroundColor: 'blue',
          width: 200,
        },
      },
    },
  };

  return (
    <SafeAreaView>
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

const CustomComponent = (props) => {
  console.log('content 1 ', props);
  return <MessageSimple {...props} />;
};

// const CardCustom = (props) => {
//   return <View />;
// };
