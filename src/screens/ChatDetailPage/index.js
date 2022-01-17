import * as React from 'react';
import moment from 'moment';
import {
  Channel,
  Chat,
  MessageContent,
  MessageFooter,
  MessageInput,
  MessageList,
  MessageSimple,
  MessageStatus,
  Streami18n
} from 'stream-chat-react-native';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useMessageContext} from 'stream-chat-react-native-core'

import ChatStatusIcon from '../../components/ChatStatusIcon';
import Header from '../../components/Chat/Header';
import ImageSendPreview from './elements/ImageSendPreview';
import InputMessage from '../../components/Chat/InputMessage';
import { COLORS } from '../../utils/theme';
import { Context } from '../../context';
import { fonts } from '../../utils/fonts';
import { setAsset, setParticipants } from '../../context/actions/groupChat';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';

const streami18n = new Streami18n({
  language: 'en',
});

const ChatDetailPage = () => {
  const [clients] = React.useContext(Context).client;
  const [channelClient] = React.useContext(Context).channel;
  const [, dispatch] = React.useContext(Context).groupChat;

  const defaultActionsAllowed = (messageActionsProp) => {
    let {
      blockUser,
      canModifyMessage,
      copyMessage,
      deleteMessage,
      editMessage,
      error,
      isMyMessage,
      quotedReply,
      retry,
    } = messageActionsProp;

    let options = [];

    options.push(quotedReply);
    options.push(copyMessage);
    if (canModifyMessage && isMyMessage) {
      options.push(editMessage);
    }
    if (!isMyMessage) {
      options.push(blockUser);
    }
    options.push(deleteMessage);
    if (error) {
      options.push(retry);
    }

    return options;
  };
  let connect = useClientGetstream();
  React.useEffect(() => {
    connect();
  }, []);
  React.useEffect(() => {
    searchUserMessages(channelClient.channel?.cid);
    setParticipants(channelClient.channel?.state?.members, dispatch);
  }, [clients.client]);
  const searchUserMessages = async (channelID) => {
    const messages = await clients.client.search(
      {
        cid: channelID,
      },
      { 'attachments.type': { $in: ['image'] } },
    );
    setAsset(messages.results, dispatch);
  };
  const testDate = (v) => {
    return v;
  };

  if (clients.client && channelClient.channel) {
    return (<SafeAreaView>
        <StatusBar backgroundColor="white" translucent={false} />
        <Chat client={clients.client} i18nInstance={streami18n}>
          <Channel
            channel={channelClient.channel}
            DateHeader={CustomDateHeader}
            hasFilePicker={false}
            ImageUploadPreview={<ImageSendPreview />}
            keyboardVerticalOffset={50}
            mutesEnabled={false}
            reactionsEnabled={false}
            readEventsEnabled={true}
            threadRepliesEnabled={false}
            MessageStatus={ChatStatusIcon}
            // MessageContent={(props) => <CustomMessageContent {...props} />}
            messageActions={(props) => {
              return defaultActionsAllowed(props);
            }}
            ReactionList={() => null}>
            <View style={{ flex: 1, zIndex: 0 }}>
              <Header />
              <View style={{ flex: 1, zIndex: 1 }}>
                <MessageList
                  tDateTimeParser={testDate}
                  InlineDateSeparator={CustomInlineDateSeparator}
                />
              </View>
              <MessageInput Input={InputMessage} />
            </View>
          </Channel>
        </Chat>
      </SafeAreaView>
    );
  }
  return <View />;
};

const CustomMessageContent = (props) => {
  const message = useMessageContext()
  return <MessageContent {...props} message={message}
    MessageFooter={(props) => <ChatStatusIcon {...props} />}
    />
}

const CustomInlineDateSeparator = ({ date }) => {
  let newDate = moment(date).locale('en').format('MMMM D, YYYY');
  return <Text style={[styles.date, styles.inlineDate]}>{newDate}</Text>;
};

const CustomDateHeader = () => {
  return null;
};

export default ChatDetailPage;
const styles = StyleSheet.create({
  date: {
    backgroundColor: COLORS.blackgrey,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 19,
    fontFamily: fonts.inter[500],
    fontSize: 14,
    lineHeight: 16.94,
  },
  dateHeader: {
    marginTop: 14,
  },
  inlineDate: {
    alignSelf: 'center',
    marginBottom: 12,
  },
});
