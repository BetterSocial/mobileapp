/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';

import InputMessageV2 from '../../components/Chat/InputMessageV2';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {ANONYMOUS} from '../../hooks/core/constant';
import {colors} from '../../utils/colors';
import dimen from '../../utils/dimen';
import BaseSystemChat from '../../components/AnonymousChat/BaseChatSystem';
import useProfileHook from '../../hooks/core/profile/useProfileHook';

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
    position: 'absolute',
    bottom: 0,
    // height: 50,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 8,
    paddingBottom: 16,
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1
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

  const updatedChats = updateChatContinuity(chats);

  const renderChatItem = React.useCallback(({item, index}) => {
    return <BaseChatItem type={ANONYMOUS} item={item} index={index} />;
  }, []);

  const scrollToEnd = () => {
    flatlistRef.current?.scrollToEnd();
  };

  return (
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
          ownerChat === anonProfileId ? (
            <BaseSystemChat
              componentType="SINGLE"
              messageSingle={`You’re anonymously messaging ${selectedChannel?.name}. They are still able to block you`}
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
        />
      </View>
    </View>
  );
};

export default SampleChatScreen;
