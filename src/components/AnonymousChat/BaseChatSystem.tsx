import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BaseChatItemComponentProps} from '../../../types/component/AnonymousChat/BaseChatItem.types';
import dimen from '../../utils/dimen';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';

const styles = StyleSheet.create({
  containerMessage: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: dimen.normalizeDimen(20),
    padding: dimen.normalizeDimen(8),
    borderRadius: dimen.normalizeDimen(8),
    marginVertical: dimen.normalizeDimen(5),
    maxWidth: dimen.normalizeDimen(335),
    flex: 1
  },
  textSystem: {
    fontSize: 14,
    color: '#828282',
    textAlign: 'center'
  }
});

const BaseSystemChat: React.FC<BaseChatItemComponentProps> = ({item, index}) => {
  const {handleTextSystem, splitSystemMessage} = useChatUtilsHook();

  const messageText = () => {
    return splitSystemMessage(handleTextSystem(item))?.map((message, key) => {
      return (
        <Text key={key} style={styles.textSystem}>
          {message}.
        </Text>
      );
    });
  };

  return (
    <View style={styles.containerMessage} key={index}>
      {messageText()}
    </View>
  );
};

export default BaseSystemChat;
