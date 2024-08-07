import * as React from 'react';
import EasyFollowSystem from 'stream-chat-react-native-core/src/components/ChannelList/EasyFollowSystem';
import moment from 'moment';
import {Channel, Chat, MessageInput, MessageList, Streami18n} from 'stream-chat-react-native';
import {MessageSystem} from 'stream-chat-react-native-core';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

import ChatStatusIcon from '../../components/ChatStatusIcon';
import CustomMessageAvatar from './elements/CustomMessageAvatar';
import Header from '../../components/Chat/Header';
import ImageSendPreview from './elements/ImageSendPreview';
import InputMessage from '../../components/Chat/InputMessage';
import useCustomEasyFollowSystemHook from '../../hooks/core/getstream/useCustomEasyFollowSystemHook';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {CustomMessageSystem} from '../../components';
import {fonts} from '../../utils/fonts';
import {setAsset, setParticipants} from '../../context/actions/groupChat';
import {setChannel} from '../../context/actions/setChannel';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const streami18n = new Streami18n({
  language: 'en'
});

const ChatDetailPage = ({route}) => {
  const [clients] = React.useContext(Context).client;
  const [channelClient, dispatchChannel] = React.useContext(Context).channel;
  const [, dispatch] = React.useContext(Context).groupChat;
  const {checkFollowStatus, followUserFunction, followData} = useCustomEasyFollowSystemHook();

  const channelData = channelClient?.channel;
  const channelType = channelClient?.channel?.data?.channel_type;

  const messageSystemCustom = (props) => {
    const {message, channel} = props;
    if (channel?.data.channel_type === 2 || channel?.data.channel_type === 3)
      return <CustomMessageSystem text={`${message.user.name} has joined the group`} />;

    if (message.is_add) {
      if (message.only_to_user_show) {
        if (message.only_to_user_show === clients.client.user.id) {
          return <CustomMessageSystem text={message.text} />;
        }
        return <View />;
      }
      if (message.disable_to_user === clients.client.user.id) {
        return <View />;
      }
      return <CustomMessageSystem text={message.text} />;
    }
    if (message.system_user === clients.client.user.id) {
      return null;
    }
    return <MessageSystem {...props} />;
  };
  const handleChannelClient = async () => {
    try {
      const channel = clients.client.getChannelById(
        route.params.data.channel_type,
        route.params.data.channel_id,
        {}
      );
      setChannel(channel, dispatchChannel);
    } catch (e) {
      if (__DEV__) {
        console.log(e, 'eman');
      }
    }
  };
  React.useEffect(() => {
    if (clients && route?.params?.data && !channelClient.client) {
      handleChannelClient();
    }
  }, [route.params, clients]);

  React.useEffect(() => {
    return () => {
      onBackHandle();
    };
  }, []);

  const onBackHandle = () => {
    if (route?.params?.channel) {
      setChannel(route.params.channel, dispatchChannel);
    }
  };

  const defaultActionsAllowed = (messageActionsProp) => {
    const {
      blockUser,
      canModifyMessage,
      copyMessage,
      deleteMessage,
      editMessage,
      error,
      isMyMessage,
      quotedReply,
      retry
    } = messageActionsProp;

    const options = [];

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
  const connect = useClientGetstream();
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
        cid: channelID
      },
      {'attachments.type': {$in: ['image']}}
    );
    setAsset(messages.results, dispatch);
  };
  const testDate = (v) => v;

  const renderMessageInput = () => {
    if (channelClient.channel?.data?.is_channel_blocked) {
      return <></>;
    }

    return <MessageInput Input={InputMessage} />;
  };

  if (clients.client && channelClient.channel) {
    return (
      <SafeAreaView>
        <StatusBar backgroundColor="white" translucent={false} />
        <EasyFollowSystem
          followData={followData}
          refreshFollowData={checkFollowStatus}
          followButtonAction={followUserFunction}>
          <Chat client={clients.client} i18nInstance={streami18n}>
            <Channel
              channel={channelClient.channel}
              DateHeader={CustomDateHeader}
              hasFilePicker={false}
              ImageUploadPreview={<ImageSendPreview />}
              keyboardVerticalOffset={0}
              mutesEnabled={false}
              reactionsEnabled={false}
              readEventsEnabled={true}
              threadRepliesEnabled={false}
              MessageStatus={ChatStatusIcon}
              MessageSystem={(props) => messageSystemCustom(props)}
              MessageAvatar={(props) => (
                <CustomMessageAvatar
                  channelType={channelType}
                  color={channelData?.data?.anon_user_info_color_code}
                  emoji={channelData?.data?.anon_user_info_emoji_code}
                  {...props}
                />
              )}
              // MessageContent={(props) => <CustomMessageContent {...props} />}
              messageActions={(props) => defaultActionsAllowed(props)}
              ReactionList={() => null}>
              <>
                <Header />
                <MessageList
                  tDateTimeParser={testDate}
                  InlineDateSeparator={CustomInlineDateSeparator}
                  loading={false}
                />
                {renderMessageInput()}
              </>
            </Channel>
          </Chat>
        </EasyFollowSystem>
      </SafeAreaView>
    );
  }
  return <View />;
};

const CustomInlineDateSeparator = ({date}) => {
  const newDate = moment(date).locale('en').format('MMMM D, YYYY');
  return (
    <View style={[styles.containerDate, styles.inlineDate]}>
      <Text style={[styles.date]}>{newDate}</Text>
    </View>
  );
};

const CustomDateHeader = () => null;

export default withInteractionsManaged(ChatDetailPage);
const styles = StyleSheet.create({
  date: {
    color: COLORS.almostBlack,
    fontFamily: fonts.inter[500],
    fontSize: 14,
    lineHeight: 16.94
  },
  dateHeader: {
    marginTop: 14
  },
  inlineDate: {
    alignSelf: 'center',
    marginBottom: 12
  },
  containerDate: {
    backgroundColor: COLORS.gray410,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 19,
    flex: 1
  }
});
