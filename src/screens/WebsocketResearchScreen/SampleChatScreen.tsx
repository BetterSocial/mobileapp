/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native';

import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import BaseSystemChat from '../../components/AnonymousChat/BaseChatSystem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import InputMessageV2 from '../../components/Chat/InputMessageV2';
import Loading from '../Loading';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import useMoveChatTypeHook from '../../hooks/core/chat/useMoveChatTypeHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {ANONYMOUS} from '../../hooks/core/constant';
import {colors} from '../../utils/colors';

const {height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: colors.white
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: height - 85
  },
  chatContainer: {
    display: 'flex',
    height: '100%'
  },
  inputContainer: {
    backgroundColor: colors.white,
    width: '100%',
    height: 50,
    zIndex: 100,
    padding: 8,
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1
  },
  contentContainerStyle: {
    backgroundColor: 'transparent'
  }
});

const SampleChatScreen = () => {
  const flatlistRef = React.useRef<FlatList>();
  const {
    selectedChannel,
    chats,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat,
    updateChatContinuity,
    loadingChat
  } = useChatScreenHook(ANONYMOUS);

  const {moveToSignedChannel} = useMoveChatTypeHook();

  const updatedChats = updateChatContinuity(chats);
  const [loading, setLoading] = React.useState(false);
  const {anonProfileId} = useProfileHook();
  const ownerChat = selectedChannel?.rawJson?.channel?.members?.find(
    (item: any) => item.user_id === anonProfileId
  );
  const memberChat = selectedChannel?.rawJson?.channel?.members?.find(
    (item: any) => item.user_id !== anonProfileId
  );

  const renderChatItem = React.useCallback(({item, index}) => {
    return <BaseChatItem type={ANONYMOUS} item={item} index={index} />;
  }, []);

  const scrollToEnd = () => {
    flatlistRef.current?.scrollToEnd();
  };

  const moveChatSigned = async () => {
    try {
      setLoading(true);
      await moveToSignedChannel({
        oldChannelId: selectedChannel?.id,
        targetUserId: memberChat.user_id
      });
    } catch (e) {
      console.log('error moving chat to signed channel', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.anon_primary} />

      <View style={styles.keyboardAvoidingView}>
        {selectedChannel ? (
          <ChatDetailHeader
            onAvatarPress={goToChatInfoScreen}
            onBackPress={goBackFromChatScreen}
            onThreeDotPress={goToChatInfoScreen}
            avatar={selectedChannel?.channelPicture}
            user={selectedChannel?.name}
            type={ANONYMOUS}
          />
        ) : null}
        {!loadingChat ? (
          <FlatList
            contentContainerStyle={{paddingBottom: 20}}
            style={styles.chatContainer}
            data={updatedChats}
            inverted={true}
            initialNumToRender={20}
            alwaysBounceVertical={false}
            bounces={false}
            onLayout={scrollToEnd}
            keyExtractor={(item, index) => item?.id || index.toString()}
            ListFooterComponent={
              ownerChat ? (
                <BaseSystemChat
                  componentType="SINGLE"
                  messageSingle={`You’re anonymously messaging ${selectedChannel?.name}. They are still able to block you`}
                />
              ) : null
            }
            renderItem={renderChatItem}
          />
        ) : null}
        <View style={styles.inputContainer}>
          <InputMessageV2
            onSendButtonClicked={sendChat}
            type={ANONYMOUS}
            emojiCode={selectedChannel?.rawJson.channel.anon_user_info_emoji_code}
            emojiColor={selectedChannel?.rawJson.channel.anon_user_info_color_code}
            username={selectedChannel?.name}
            onToggleConfirm={moveChatSigned}
          />
        </View>
        <Loading visible={loading} />
      </View>
    </>
  );
};

export default SampleChatScreen;
