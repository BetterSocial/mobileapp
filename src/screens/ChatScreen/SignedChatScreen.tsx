/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';

import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
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
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {GoToChatInfoScreenByTrigger} from '../../../types/hooks/screens/useChatScreenHook.types';
import {SIGNED} from '../../hooks/core/constant';
import {getOtherProfile} from '../../service/profile';
import {paramInputContainer, styles} from './ChatScreen.styles';
import {setChannel} from '../../context/actions/setChannel';

const SignedChatScreen = () => {
  const {
    selectedChannel,
    chats,
    goBackToChatTab,
    goToChatInfoScreenBy,
    sendChatMutation,
    isLoadingFetchAllMessage,
    updateChatContinuity
  } = useChatScreenHook(SIGNED);

  const updatedChats = updateChatContinuity(chats);
  const flatlistRef = React.useRef<FlatList>();
  const [loading, setLoading] = React.useState(false);
  const [isAnonimityEnabled, setIsAnonimityEnabled] = React.useState(true);
  const [, dispatchChannel] = (React.useContext(Context) as unknown as any).channel;
  const [profile] = (React.useContext(Context) as unknown as any).profile;

  const {isKeyboardOpen, safeAreaInsets} = useChatScreenDimensions();

  const {signedProfileId} = useProfileHook();
  const {moveToAnonymousChannel} = useMoveChatTypeHook();

  const exitedGroup =
    selectedChannel?.rawJson?.channel?.better_channel_member?.findIndex(
      (item: any) => item.user_id === signedProfileId
    ) < 0;
  const memberChat = selectedChannel?.rawJson?.channel?.members?.find(
    (item: any) => item.user_id !== signedProfileId
  );

  const renderChatItem = React.useCallback(
    ({item, index}) => {
      return <BaseChatItem type={SIGNED} item={item} index={index} />;
    },
    [updatedChats]
  );

  const goToChatInfoPage = (trigger: GoToChatInfoScreenByTrigger) => {
    goToChatInfoScreenBy(trigger, {from: SIGNED});
  };

  const scrollToEnd = () => {
    flatlistRef.current?.scrollToEnd();
  };

  const moveChatToAnon = async () => {
    try {
      setLoading(true);
      await moveToAnonymousChannel({
        oldChannelId: selectedChannel?.id,
        targetUserId: memberChat.user_id,
        source: 'userId'
      });
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.SIGNED_CHAT_SCREEN_TOGGLE_MOVE_CHAT_OPEN_CHAT
      );
    } catch (e) {
      console.log('error moving chat to signed channel', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherProfile = async () => {
    try {
      const result = await getOtherProfile(memberChat?.user?.username);
      if (result.code === 200) {
        setIsAnonimityEnabled(result.data.isAnonMessageEnabled);
      }
    } catch (e) {
      // nothing
    }
  };

  React.useEffect(() => {
    if (selectedChannel) {
      setChannel(selectedChannel, dispatchChannel);
      fetchOtherProfile();
    }
  }, [selectedChannel]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.signed_secondary,
        paddingTop: safeAreaInsets.top
      }}>
      <View style={[styles.keyboardAvoidingView, {paddingBottom: safeAreaInsets.bottom}]}>
        {selectedChannel ? (
          <ChatDetailHeader
            channel={selectedChannel}
            onAvatarPress={exitedGroup ? null : () => goToChatInfoPage('ProfilePicture')}
            onBackPress={goBackToChatTab}
            onThreeDotPress={exitedGroup ? null : () => goToChatInfoPage('OptionsButton')}
            avatar={selectedChannel?.channelPicture}
            type={SIGNED}
            user={selectedChannel?.name}
            anon_user_info_emoji_code={selectedChannel?.anon_user_info_emoji_code}
            anon_user_info_color_code={selectedChannel?.anon_user_info_color_code}
            isGroup={selectedChannel?.channelType === 'GROUP'}
          />
        ) : null}
        {!isLoadingFetchAllMessage ? (
          <FlatList
            contentContainerStyle={[styles.contentContainerStyle]}
            style={styles.chatContainer}
            data={updatedChats}
            inverted={true}
            windowSize={10}
            maxToRenderPerBatch={5}
            initialNumToRender={20}
            alwaysBounceVertical={false}
            bounces={false}
            onLayout={scrollToEnd}
            keyExtractor={(item, index) => item?.id || index.toString()}
            renderItem={renderChatItem}
          />
        ) : (
          <ActivityIndicator
            size="large"
            style={{
              marginTop: 20
            }}
          />
        )}

        {!exitedGroup && (
          <View style={[paramInputContainer(safeAreaInsets.bottom, isKeyboardOpen)]}>
            <InputMessageV2
              onSendButtonClicked={(message: string, attachments: any) => {
                sendChatMutation.mutate({
                  message,
                  attachments
                } as any);
              }}
              type={SIGNED}
              username={selectedChannel?.name}
              profileImage={profile?.myProfile?.profile_pic_path}
              onToggleConfirm={moveChatToAnon}
              messageDisable={
                selectedChannel?.channelType === 'GROUP'
                  ? 'Coming soon: Anonymous messages are not enabled yet within group chats'
                  : null
              }
              isAnonimityEnabled={isAnonimityEnabled}
            />
          </View>
        )}
        <Loading visible={loading} />
      </View>
    </View>
  );
};

export default SignedChatScreen;
