/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';

import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import BaseSystemChat from '../../components/AnonymousChat/BaseChatSystem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import InputMessageV2 from '../../components/Chat/InputMessageV2';
import useMoveChatTypeHook from '../../hooks/core/chat/useMoveChatTypeHook';
import {ANONYMOUS} from '../../hooks/core/constant';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {colors} from '../../utils/colors';
import Loading from '../Loading';

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
    height: '100%',
    marginBottom: 72
  },
  inputContainer: {
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    // height: 50,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 8,
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1
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
    updateChatContinuity
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

  const betterSocialMember = selectedChannel?.rawJson?.better_channel_member;

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={-500}>
      {selectedChannel ? (
        <ChatDetailHeader
          onAvatarPress={goToChatInfoScreen}
          onBackPress={goBackFromChatScreen}
          onThreeDotPress={goToChatInfoScreen}
          avatar={selectedChannel?.channelPicture}
          user={selectedChannel?.name}
          anon_user_info_emoji_code={
            betterSocialMember && betterSocialMember[memberChat?.user_id]?.anon_user_info_emoji_code
          }
          anon_user_info_color_code={
            betterSocialMember && betterSocialMember[memberChat?.user_id]?.anon_user_info_color_code
          }
        />
      ) : null}
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
              messageSingle={`You’re anonymously messaging ${selectedChannel?.name}.\nThey are still able to block you`}
            />
          ) : null
        }
        renderItem={renderChatItem}
      />
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
    </KeyboardAvoidingView>
  );
};

export default SampleChatScreen;
