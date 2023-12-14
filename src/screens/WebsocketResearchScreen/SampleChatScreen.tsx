/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native';

import AnonymousInputMessage from '../../components/Chat/AnonymousInputMessage';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import ChatReplyPreview from '../../components/AnonymousChat/child/ChatReplyPreview';
import Loading from '../Loading';
import dimen from '../../utils/dimen';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import useMessageHook from '../../hooks/screen/useMessageHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {ANONYMOUS} from '../../hooks/core/constant';
import {COLORS} from '../../utils/theme';

const {height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: COLORS.white
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
    backgroundColor: COLORS.white,
    zIndex: 100,
    padding: 8,
    borderTopColor: COLORS.lightgrey,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainerStyle: {
    paddingTop: dimen.normalizeDimen(60),
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
    updateChatContinuity
  } = useChatScreenHook(ANONYMOUS);
  const {replyPreview, clearReplyPreview} = useMessageHook();
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

  React.useEffect(() => {
    return () => {
      clearReplyPreview();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.holyTosca} />

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
        <FlatList
          contentContainerStyle={styles.flatlistContainer}
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

        {replyPreview && <ChatReplyPreview type={ANONYMOUS} />}
        <View style={styles.inputContainer}>
          <AnonymousInputMessage onSendButtonClicked={sendChat} type={ANONYMOUS} />
        </View>
        <Loading visible={loading} />
      </View>
    </>
  );
};

export default SampleChatScreen;
