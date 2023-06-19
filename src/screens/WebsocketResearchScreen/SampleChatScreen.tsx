/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput
} from 'react-native';

import AnonymousChatHeader from '../../components/AnonymousChat/AnonymousChatHeader';
import ChatItemMyText from '../../components/AnonymousChat/child/ChatItemMyText';
import ChatItemTargetText from '../../components/AnonymousChat/child/ChatItemTargetText';
import useAnonymousChatScreenHook from '../../hooks/screen/useAnonymousChatScreenHook';
import {calculateTime} from '../../utils/time';
import {colors} from '../../utils/colors';

const {height} = Dimensions.get('window');

const SampleChatScreen = () => {
  const {chats, goBackFromChatScreen, goToChatInfoScreen, sendChat} = useAnonymousChatScreenHook();
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
      marginBottom: 50
    },
    inputContainer: {
      backgroundColor: 'red',
      position: 'absolute',
      bottom: 0,
      height: 50,
      left: 0,
      right: 0,
      zIndex: 100
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={-500}>
      <AnonymousChatHeader
        onAvatarPress={goToChatInfoScreen}
        onBackPress={goBackFromChatScreen}
        onThreeDotPress={goToChatInfoScreen}
        avatar={'https://picsum.photos/200/300'}
        user={'Marlyn'}
      />
      <FlatList
        style={styles.chatContainer}
        data={chats}
        inverted={true}
        alwaysBounceVertical={false}
        bounces={false}
        renderItem={({item, index}) => {
          console.log(JSON.stringify(item, null, 2));
          if (index % 2 !== 0)
            return (
              <ChatItemTargetText
                message={item?.message}
                avatar={item?.user?.profilePicture}
                username={item?.user?.username}
                time={calculateTime(item?.rawJson?.message?.created_at)}
                isContinuous={false}
              />
            );

          return (
            <ChatItemMyText
              message={item?.message}
              avatar={item?.user?.profilePicture}
              username={item?.user?.username}
              time={calculateTime(item?.rawJson?.message?.created_at)}
              isContinuous={false}
            />
          );
        }}
      />
      <TextInput style={styles.inputContainer} />
    </KeyboardAvoidingView>
  );
};

export default SampleChatScreen;
