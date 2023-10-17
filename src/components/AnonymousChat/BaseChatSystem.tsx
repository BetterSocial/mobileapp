import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BaseChatItemComponentProps} from '../../../types/component/AnonymousChat/BaseChatItem.types';

const styles = StyleSheet.create({
  containerMessage: {}
});

const BaseSystemChat: React.FC<BaseChatItemComponentProps> = ({item, index}) => {
  return (
    <View key={index}>
      <Text>{item.message} </Text>
    </View>
  );
};

export default BaseSystemChat;
