/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {FlatList, KeyboardAvoidingView, Platform, View} from 'react-native';

import AnonymousInputMessage from '../../components/Chat/AnonymousInputMessage';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {styles} from './SampleChatScreen';
import {SIGNED} from '../../hooks/core/constant';
import {Context} from '../../context';

const SignedChatScreen = () => {
  const {selectedChannel, chats, goBackFromChatScreen, goToChatInfoScreen, sendChat} =
    useChatScreenHook(SIGNED);
  const renderChatItem = React.useCallback(({item, index}) => {
    return <BaseChatItem type="SIGNED" item={item} index={index} />;
  }, []);
  console.log({chats}, 'saya');
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={-500}>
      <ChatDetailHeader
        onAvatarPress={goToChatInfoScreen}
        onBackPress={goBackFromChatScreen}
        onThreeDotPress={goToChatInfoScreen}
        avatar={selectedChannel?.channelPicture}
        user={
          selectedChannel?.rawJson?.channel?.anon_user_info_emoji_code
            ? `Anonymous ${selectedChannel?.rawJson?.channel?.anon_user_info_emoji_name} `
            : selectedChannel?.user?.username
        }
        anon_user_info_emoji_code={selectedChannel?.rawJson?.channel?.anon_user_info_emoji_code}
        anon_user_info_color_code={selectedChannel?.rawJson?.channel?.anon_user_info_color_code}
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
        <AnonymousInputMessage onSendButtonClicked={sendChat} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignedChatScreen;
