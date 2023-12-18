/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {FlatList, View} from 'react-native';

import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import ChatReplyPreview from '../../components/AnonymousChat/child/ChatReplyPreview';
import InputMessageV2 from '../../components/Chat/InputMessageV2';
import Loading from '../Loading';
import useMessageHook from '../../hooks/screen/useMessageHook';
import useMoveChatTypeHook from '../../hooks/core/chat/useMoveChatTypeHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import useChatScreenHook, {ScrollContext} from '../../hooks/screen/useChatScreenHook';
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
    flatListRef: scrollRef,
    scrollContext
  } = useChatScreenHook(SIGNED);
  const {replyPreview, clearReplyPreview} = useMessageHook();
  const {moveToAnonymousChannel} = useMoveChatTypeHook();
  const {signedProfileId} = useProfileHook();
  const updatedChats = updateChatContinuity(chats);

  const [loading, setLoading] = React.useState(false);
  const [, dispatchChannel] = (React.useContext(Context) as unknown as any).channel;
  const [profile] = (React.useContext(Context) as unknown as any).profile;

  const memberChat = selectedChannel?.rawJson?.channel?.members?.find(
    (item: any) => item.user_id !== signedProfileId
  );

  const renderChatItem = React.useCallback(({item, index}) => {
    return <BaseChatItem type={SIGNED} item={item} index={index} />;
  }, []);

  const goToChatInfoPage = () => {
    goToChatInfoScreen({from: SIGNED});
  };

  const moveChatToAnon = async () => {
    try {
      setLoading(true);
      await moveToAnonymousChannel({
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
    if (selectedChannel) {
      setChannel(selectedChannel, dispatchChannel);
    }
  }, [selectedChannel]);

  React.useEffect(() => {
    return () => {
      clearReplyPreview();
    };
  }, []);

  return (
    <ScrollContext.Provider value={scrollContext}>
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

        <FlatList
          ref={scrollRef}
          contentContainerStyle={styles.flatlistContainer}
          style={styles.chatContainer}
          data={updatedChats}
          inverted={true}
          initialNumToRender={10}
          alwaysBounceVertical={false}
          keyExtractor={(item, index) => item?.id || index.toString()}
          renderItem={renderChatItem}
        />

        {replyPreview && <ChatReplyPreview type={SIGNED} />}
        <View style={styles.inputContainer}>
          <InputMessageV2
            onSendButtonClicked={sendChat}
            type={SIGNED}
            username={selectedChannel?.name}
            profileImage={profile?.myProfile?.profile_pic_path}
            onToggleConfirm={moveChatToAnon}
            messageDisable={
              selectedChannel?.channelType === 'GROUP'
                ? 'Coming soon: Anonymous messages are not enabled yet within group chats'
                : null
            }
          />
        </View>
        <Loading visible={loading} />
      </View>
    </ScrollContext.Provider>
  );
};

export default SignedChatScreen;
