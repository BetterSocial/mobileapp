/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';

import AnonymousChatHeader from '../../components/AnonymousChat/AnonymousChatHeader';
import AnonymousInputMessage from '../../components/Chat/AnonymousInputMessage';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {colors} from '../../utils/colors';

const {height} = Dimensions.get('window');

const SampleChatScreen = () => {
  const {selectedChannel, chats, goBackFromChatScreen, goToChatInfoScreen, sendChat} =
    useChatScreenHook('ANONYMOUS');
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
        <AnonymousInputMessage onSendButtonClicked={sendChat} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SampleChatScreen;
