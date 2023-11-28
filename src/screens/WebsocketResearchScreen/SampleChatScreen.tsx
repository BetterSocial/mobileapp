/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';

import AnonymousInputMessage from '../../components/Chat/AnonymousInputMessage';
import BaseChatItem from '../../components/AnonymousChat/BaseChatItem';
import ChatDetailHeader from '../../components/AnonymousChat/ChatDetailHeader';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {ANONYMOUS} from '../../hooks/core/constant';
import {colors} from '../../utils/colors';
import dimen from '../../utils/dimen';

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
    updateChatContinuity,
    loadingChat
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
        renderItem={renderChatItem}
      />

      <View style={styles.inputContainer}>
        <AnonymousInputMessage onSendButtonClicked={sendChat} type={ANONYMOUS} />
      </View>
    </View>
  );
};

export default SampleChatScreen;
