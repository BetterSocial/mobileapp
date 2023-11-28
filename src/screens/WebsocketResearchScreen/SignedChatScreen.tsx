/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {FlatList, View} from 'react-native';

import AnonymousInputMessage from '../../components/Chat/AnonymousInputMessage';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {Context} from '../../context';
import {SIGNED} from '../../hooks/core/constant';
import {getChatName} from '../../utils/string/StringUtils';
import {setChannel} from '../../context/actions/setChannel';
import {styles} from './SampleChatScreen';

const SignedChatScreen = () => {
  const {
    selectedChannel,
    chats,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat,
    updateChatContinuity,
    loadingChat
  } = useChatScreenHook(SIGNED);

  const flatlistRef = React.useRef<FlatList>();
  const [, dispatchChannel] = (React.useContext(Context) as unknown as any).channel;
  const [profile] = (React.useContext(Context) as unknown as any).profile;
  const updatedChats = updateChatContinuity(chats);

  const renderChatItem = React.useCallback(({item, index}) => {
    return <BaseChatItem type={SIGNED} item={item} index={index} />;
  }, []);

  const goToChatInfoPage = () => {
    goToChatInfoScreen({from: SIGNED});
  };

  const scrollToEnd = () => {
    flatlistRef.current?.scrollToEnd();
  };

  React.useEffect(() => {
    if (selectedChannel) {
      setChannel(selectedChannel, dispatchChannel);
    }
  }, [selectedChannel]);

  return (
    <View style={styles.keyboardAvoidingView}>
      {selectedChannel ? (
        <ChatDetailHeader
          channel={selectedChannel}
          onAvatarPress={goToChatInfoPage}
          onBackPress={goBackFromChatScreen}
          onThreeDotPress={goToChatInfoPage}
          avatar={selectedChannel?.channelPicture}
          type={SIGNED}
          user={
            selectedChannel?.rawJson?.channel?.anon_user_info_emoji_code
              ? `Anonymous ${selectedChannel?.rawJson?.channel?.anon_user_info_emoji_name} `
              : getChatName(selectedChannel?.name, profile?.myProfile?.username)
          }
          anon_user_info_emoji_code={selectedChannel?.rawJson?.channel?.anon_user_info_emoji_code}
          anon_user_info_color_code={selectedChannel?.rawJson?.channel?.anon_user_info_color_code}
        />
      ) : null}

      {!loadingChat ? (
        <FlatList
          contentContainerStyle={styles.contentContainerStyle}
          style={styles.chatContainer}
          data={updatedChats}
          inverted={true}
          initialNumToRender={10}
          alwaysBounceVertical={false}
          bounces={false}
          onLayout={scrollToEnd}
          keyExtractor={(item, index) => item?.id || index.toString()}
          renderItem={renderChatItem}
        />
      ) : null}
      <View style={styles.inputContainer}>
        <AnonymousInputMessage onSendButtonClicked={sendChat} type={SIGNED} />
      </View>
    </View>
  );
};

export default SignedChatScreen;
