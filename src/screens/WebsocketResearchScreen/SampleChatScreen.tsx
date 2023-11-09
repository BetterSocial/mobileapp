/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';

import InputMessageV2 from '../../components/Chat/InputMessageV2';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
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
    paddingBottom: 16,
    borderTopColor: colors.lightgrey,
    borderTopWidth: 1
  }
});

const SampleChatScreen = () => {
  const {selectedChannel, chats, goBackFromChatScreen, goToChatInfoScreen, sendChat} =
    useChatScreenHook(ANONYMOUS);

  const renderChatItem = React.useCallback(({item, index}) => {
    return <BaseChatItem item={item} index={index} />;
  }, []);

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
          type={ANONYMOUS}
        />
      ) : null}
      <FlatList
        contentContainerStyle={{paddingBottom: 20}}
        style={styles.chatContainer}
        data={chats}
        inverted={true}
        initialNumToRender={20}
        alwaysBounceVertical={false}
        bounces={false}
        keyExtractor={(item, index) => item?.id || index.toString()}
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
    </KeyboardAvoidingView>
  );
};

export default SampleChatScreen;
