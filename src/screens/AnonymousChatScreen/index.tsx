/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native';

import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import BaseSystemChat from '../../components/AnonymousChat/BaseChatSystem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import ChatReplyPreview from '../../components/AnonymousChat/child/ChatReplyPreview';
import InputMessageV2 from '../../components/Chat/InputMessageV2';
import Loading from '../Loading';
import useMessageHook from '../../hooks/screen/useMessageHook';
import useMoveChatTypeHook from '../../hooks/core/chat/useMoveChatTypeHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import useChatScreenHook, {ScrollContext} from '../../hooks/screen/useChatScreenHook';
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
  flatlistContainer: {
    paddingTop: 5,
    paddingBottom: 20
  },
  chatContainer: {
    display: 'flex',
    height: '100%'
  },
  inputContainer: {
    backgroundColor: colors.white,
    zIndex: 100,
    padding: 8,
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainerStyle: {
    backgroundColor: 'transparent'
  }
});

const SampleChatScreen = () => {
  const {
    selectedChannel,
    chats,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat,
    updateChatContinuity,
    flatListRef: scrollRef,
    scrollContext
  } = useChatScreenHook(ANONYMOUS);
  const {replyPreview, clearReplyPreview} = useMessageHook();
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

  const betterSocialMember = selectedChannel?.rawJson?.better_channel_member;

  const moveChatSigned = async () => {
    try {
      setLoading(true);
      await moveToSignedChannel({
        oldChannelId: selectedChannel?.id,
        targetUserId: memberChat.user_id,
        source: 'userId'
      });
    } catch (e) {
      console.log('error moving chat to signed channel', e);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    return () => {
      clearReplyPreview();
    };
  }, []);

  return (
    <ScrollContext.Provider value={scrollContext}>
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
            anon_user_info_emoji_code={
              betterSocialMember &&
              betterSocialMember[memberChat?.user_id]?.anon_user_info_emoji_code
            }
            anon_user_info_color_code={
              betterSocialMember &&
              betterSocialMember[memberChat?.user_id]?.anon_user_info_color_code
            }
          />
        ) : null}
        <FlatList
          ref={scrollRef}
          contentContainerStyle={styles.flatlistContainer}
          style={styles.chatContainer}
          data={updatedChats}
          inverted={true}
          initialNumToRender={10}
          alwaysBounceVertical={false}
          keyExtractor={(item, index) => item?.id || index.toString()}
          ListFooterComponent={
            ownerChat ? (
              <BaseSystemChat
                componentType="SINGLE"
                messageSingle={`You’re anonymously messaging ${selectedChannel?.name}.\nThey are still able to block you`}
              />
            ) : null
          }
          renderItem={renderChatItem}
        />

        {replyPreview && <ChatReplyPreview type={ANONYMOUS} />}
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
    </ScrollContext.Provider>
  );
};

export default SampleChatScreen;
