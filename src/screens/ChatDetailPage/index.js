import * as React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Streami18n,
  useMessageContext,
} from 'stream-chat-react-native';

import Header from '../../components/Chat/Header';
import InputMessage from '../../components/Chat/InputMessage';
import CostomListMessage from '../../components/Chat/CostomListMessage';
import {Context} from '../../context';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {setAsset, setParticipants} from '../../context/actions/groupChat';

const streami18n = new Streami18n({
  language: 'en',
});

const ChatDetailPage = () => {
  const [clients] = React.useContext(Context).client;
  const [channelClient] = React.useContext(Context).channel;
  const [, dispatch] = React.useContext(Context).groupChat;
  const messageContext = useMessageContext();

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
    } = messageActionsProp

    let options = []
    
    options.push(quotedReply)
    options.push(copyMessage)
    if(canModifyMessage && isMyMessage) options.push(editMessage)
    if(!isMyMessage) options.push(blockUser)
    options.push(deleteMessage)
    if(error) options.push(retry)
    
    return options
  }

  // console.log('messageContext')
  // console.log(messageContext)
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
      {'attachments.type': {$in: ['image']}},
    );
    setAsset(messages.results, dispatch);
  };
  if (clients.client && channelClient.channel) {
    // console.log('channel full ', channelClient.channel);
    // console.log('channel ', channelClient.channel?.data?.created_by);
    return (
      <SafeAreaView>
        <Chat client={clients.client} i18nInstance={streami18n}>
          <Channel
            channel={channelClient.channel}
            keyboardVerticalOffset={50}
            hasFilePicker={false}
            mutesEnabled={false}
            threadRepliesEnabled={false}
            reactionsEnabled={false}
            messageActions={(props) => {
              return defaultActionsAllowed(props)
            }}
            ReactionList={() => null}>
            <View style={{flex: 1}}>
              <Header
                username={channelClient.channel?.data?.name}
                profile={channelClient.channel?.data?.created_by?.image}
                createChat={channelClient.channel?.data?.created_at}
              />
              <MessageList MessageSimple={CostomListMessage}/>

              <MessageInput Input={InputMessage} />
            </View>
          </Channel>
        </Chat>
      </SafeAreaView>
    );
  }
  return <View />;
};

export default ChatDetailPage;

const styles = StyleSheet.create({});
