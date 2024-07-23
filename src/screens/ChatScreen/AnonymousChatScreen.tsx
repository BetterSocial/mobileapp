/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {FlatList, View} from 'react-native';

import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import BaseSystemChat from '../../components/AnonymousChat/BaseChatSystem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import InputMessageV2 from '../../components/Chat/InputMessageV2';
import Loading from '../Loading';
import useChatScreenDimensions from './useChatScreenDimensions';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import useMoveChatTypeHook from '../../hooks/core/chat/useMoveChatTypeHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import {ANONYMOUS} from '../../hooks/core/constant';
import {COLORS} from '../../utils/theme';
import {paramInputContainer, styles} from './ChatScreen.styles';

const AnonymousChatScreen = () => {
  const flatlistRef = React.useRef<FlatList>();
  const {
    chats,
    selectedChannel,
    selfAnonUserInfo,
    goBackToChatTab,
    goToChatInfoScreenBy,
    sendChatMutation,
    updateChatContinuity
  } = useChatScreenHook(ANONYMOUS);

  const {moveToSignedChannel} = useMoveChatTypeHook();
  const {isKeyboardOpen, safeAreaInsets} = useChatScreenDimensions();

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
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_TOGGLE_MOVE_CHAT_OPEN_CHAT
      );
    } catch (e) {
      console.log('error moving chat to signed channel', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.anon_secondary,
        paddingTop: safeAreaInsets.top
      }}>
      <View style={[styles.keyboardAvoidingView, {paddingBottom: safeAreaInsets.bottom}]}>
        {selectedChannel ? (
          <ChatDetailHeader
            onAvatarPress={() => goToChatInfoScreenBy('ProfilePicture', {from: ANONYMOUS})}
            onBackPress={goBackToChatTab}
            onThreeDotPress={() => goToChatInfoScreenBy('OptionsButton', {from: ANONYMOUS})}
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
        <View style={[paramInputContainer(safeAreaInsets.bottom, isKeyboardOpen)]}>
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
    </View>
  );
};

export default AnonymousChatScreen;
