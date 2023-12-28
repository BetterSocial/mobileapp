/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {FlatList, View} from 'react-native';

import AnonymousInputMessage from '../../components/Chat/AnonymousInputMessage';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import ChatReplyPreview from '../../components/AnonymousChat/child/ChatReplyPreview';
import Loading from '../Loading';
import useMessageHook from '../../hooks/screen/useMessageHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import useChatScreenHook, {ScrollContext} from '../../hooks/screen/useChatScreenHook';
import {Context} from '../../context';
import {SIGNED} from '../../hooks/core/constant';
import {getChatName} from '../../utils/string/StringUtils';
import {setChannel} from '../../context/actions/setChannel';
import {styles} from '../AnonymousChatScreen';

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
  const updatedChats = updateChatContinuity(chats);
  const [loading, setLoading] = React.useState(false);
  const {signedProfileId} = useProfileHook();

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
          initialNumToRender={20}
          alwaysBounceVertical={false}
          keyExtractor={(item, index) => item?.id || index.toString()}
          renderItem={renderChatItem}
        />

        {replyPreview && <ChatReplyPreview type={SIGNED} />}
        <View style={styles.inputContainer}>
          <AnonymousInputMessage onSendButtonClicked={sendChat} type={SIGNED} />
        </View>
        <Loading visible={loading} />
      </View>
    </ScrollContext.Provider>
  );
};

export default SignedChatScreen;
