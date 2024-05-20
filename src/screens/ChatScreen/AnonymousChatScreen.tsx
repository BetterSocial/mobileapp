/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';

import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import BaseSystemChat from '../../components/AnonymousChat/BaseChatSystem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import InputMessageV2 from '../../components/Chat/InputMessageV2';
import Loading from '../Loading';
import dimen from '../../utils/dimen';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import useMoveChatTypeHook from '../../hooks/core/chat/useMoveChatTypeHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {ANONYMOUS} from '../../hooks/core/constant';
import {COLORS} from '../../utils/theme';

const {height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
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
    backgroundColor: COLORS.almostBlack,
    position: 'absolute',
    bottom: 0,
    // height: 50,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 8,
    paddingBottom: 16,
    borderTopColor: COLORS.gray110,
    borderTopWidth: 1
  },
  contentContainerStyle: {
    paddingTop: dimen.normalizeDimen(60),
    paddingBottom: dimen.normalizeDimen(4),
    backgroundColor: COLORS.transparent
  }
});

const AnonymousChatScreen = () => {
  const flatlistRef = React.useRef<FlatList>();
  const {
    chats,
    selectedChannel,
    selfAnonUserInfo,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChatMutation,
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

  const scrollToEnd = () => {
    flatlistRef.current?.scrollToEnd();
  };

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

  return (
    <View style={styles.keyboardAvoidingView}>
      {selectedChannel ? (
        <ChatDetailHeader
          onAvatarPress={() => goToChatInfoScreen({from: ANONYMOUS})}
          onBackPress={goBackFromChatScreen}
          onThreeDotPress={() => goToChatInfoScreen({from: ANONYMOUS})}
          avatar={selectedChannel?.channelPicture}
          user={selectedChannel?.name}
          anon_user_info_emoji_code={selectedChannel?.anon_user_info_emoji_code}
          anon_user_info_color_code={selectedChannel?.anon_user_info_color_code}
        />
      ) : null}
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
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
              messageSingle={`You’re messaging ${selectedChannel?.name} in Incognito Mode. They can still block you`}
            />
          ) : null
        }
        renderItem={renderChatItem}
      />
      <View style={styles.inputContainer}>
        <InputMessageV2
          onSendButtonClicked={(message: string, attachments: any) => {
            sendChatMutation.mutate({
              message,
              attachments
            } as any);
          }}
          type={ANONYMOUS}
          emojiCode={selfAnonUserInfo?.anon_user_info_emoji_code}
          emojiColor={selfAnonUserInfo?.anon_user_info_color_code}
          username={selectedChannel?.name}
          onToggleConfirm={moveChatSigned}
        />
      </View>
      <Loading visible={loading} />
    </View>
  );
};

export default AnonymousChatScreen;
