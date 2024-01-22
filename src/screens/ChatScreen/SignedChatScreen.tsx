/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import ToastMessage from 'react-native-toast-message';
import {FlatList, View} from 'react-native';

import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import InputMessageV2 from '../../components/Chat/InputMessageV2';
import Loading from '../Loading';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import useMoveChatTypeHook from '../../hooks/core/chat/useMoveChatTypeHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {Context} from '../../context';
import {SIGNED} from '../../hooks/core/constant';
import {getChatName} from '../../utils/string/StringUtils';
import {setChannel} from '../../context/actions/setChannel';
import {styles} from './AnonymousChatScreen';

const SignedChatScreen = () => {
  const {
    selectedChannel,
    chats,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat,
    updateChatContinuity
  } = useChatScreenHook(SIGNED);

  const flatlistRef = React.useRef<FlatList>();
  const [loading, setLoading] = React.useState(false);
  const [, dispatchChannel] = (React.useContext(Context) as unknown as any).channel;
  const [profile] = (React.useContext(Context) as unknown as any).profile;
  const updatedChats = updateChatContinuity(chats);
  const {signedProfileId} = useProfileHook();

  const {moveToAnonymousChannel} = useMoveChatTypeHook();

  const memberChat = selectedChannel?.rawJson?.channel?.members?.find(
    (item: any) => item.user_id !== signedProfileId
  );

  const renderChatItem = React.useCallback(({item, index}) => {
    return <BaseChatItem type={SIGNED} item={item} index={index} />;
  }, []);

  const goToChatInfoPage = () => {
    goToChatInfoScreen({from: SIGNED});
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
        renderItem={renderChatItem}
      />
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
  );
};

export default SignedChatScreen;