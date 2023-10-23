/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';

import AnonymousInputMessage from '../../components/Chat/AnonymousInputMessage';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {colors} from '../../utils/colors';

const {height} = Dimensions.get('window');

const SignedChatScreen = () => {
  const {selectedChannel, chats, goBackFromChatScreen, goToChatInfoScreen, sendChat} =
    useChatScreenHook('SIGNED');
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
    return <BaseChatItem type="SIGNED" item={item} index={index} />;
  }, []);

  console.log({chats, selectedChannel}, 'kakak1');

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
