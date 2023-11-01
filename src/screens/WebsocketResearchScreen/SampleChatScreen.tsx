/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';

import AnonymousChatHeader from '../../components/AnonymousChat/AnonymousChatHeader';
import AnonymousInputMessage from '../../components/Chat/AnonymousInputMessage';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import useAnonymousChatScreenHook from '../../hooks/screen/useAnonymousChatScreenHook';
import {colors} from '../../utils/colors';

const {height} = Dimensions.get('window');

const SampleChatScreen = () => {
  const {selectedChannel, chats, goBackFromChatScreen, goToChatInfoScreen, sendChat} =
    useAnonymousChatScreenHook();
  const userTarget = selectedChannel?.rawJson?.channel?.members.find(
    (channel) => channel.channel_role === 'channel_member'
  );
  const styles = StyleSheet.create({
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

  const renderChatItem = React.useCallback(({item, index}) => {
    return <BaseChatItem item={item} index={index} />;
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={-500}>
      <AnonymousChatHeader
        onAvatarPress={goToChatInfoScreen}
        onBackPress={goBackFromChatScreen}
        onThreeDotPress={goToChatInfoScreen}
        avatar={selectedChannel?.channelPicture}
        user={selectedChannel?.name}
      />
      <FlatList
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
        <AnonymousInputMessage
          onSendButtonClicked={sendChat}
          emojiCode={selectedChannel?.rawJson.channel.anon_user_info_emoji_code}
          emojiColor={selectedChannel?.rawJson.channel.anon_user_info_color_code}
          username={selectedChannel?.name}
          userId={userTarget?.user_id}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SampleChatScreen;
