import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BaseChatItemComponentProps} from '../../../types/component/AnonymousChat/BaseChatItem.types';
import dimen from '../../utils/dimen';

const styles = StyleSheet.create({
  containerMessage: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: dimen.normalizeDimen(20),
    padding: dimen.normalizeDimen(5),
    borderRadius: dimen.normalizeDimen(19),
    marginVertical: dimen.normalizeDimen(5)
  },
  textSystem: {
    fontSize: 14,
    color: '#828282',
    textAlign: 'center'
  }
});

const BaseSystemChat: React.FC<BaseChatItemComponentProps> = ({item, index}) => {
  const handleText = () => {
    if (item?.rawJson?.userIdFollower === item?.rawJson?.user?.id) {
      return item?.rawJson?.textOwnMessage;
    }
    return item?.rawJson?.text;
  };
  return (
    <View style={styles.containerMessage} key={index}>
      <Text style={styles.textSystem}>{handleText()} </Text>
    </View>
  );
};

export default BaseSystemChat;
