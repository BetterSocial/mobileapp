import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BaseChatItemComponentProps} from '../../../types/component/AnonymousChat/BaseChatItem.types';
import dimen from '../../utils/dimen';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';
import {COLORS} from '../../utils/theme';
import {normalizeFontSize} from '../../utils/fonts';

const styles = StyleSheet.create({
  containerMessage: {
    backgroundColor: COLORS.white10percent,
    marginHorizontal: dimen.normalizeDimen(20),
    padding: dimen.normalizeDimen(8),
    borderRadius: dimen.normalizeDimen(8),
    marginBottom: dimen.normalizeDimen(8),
    maxWidth: dimen.normalizeDimen(335),
    flex: 1
  },
  textSystem: {
    fontSize: normalizeFontSize(14),
    color: COLORS.gray510,
    textAlign: 'center'
  }
});

const BaseSystemChat: React.FC<BaseChatItemComponentProps> = ({
  item,
  index,
  messageSingle,
  componentType = 'GROUP'
}) => {
  const {handleTextSystem, splitSystemMessage} = useChatUtilsHook();

  const messageText = () => {
    if (componentType === 'GROUP') {
      return splitSystemMessage(handleTextSystem(item))?.map((message, key) => {
        return (
          <Text key={key} style={styles.textSystem}>
            {message}.
          </Text>
        );
      });
    }
    return <Text style={styles.textSystem}>{messageSingle}.</Text>;
  };

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <View style={styles.containerMessage} key={index}>
        {messageText()}
      </View>
    </View>
  );
};

const isEqual = (prevProps, nextProps) => {
  return nextProps.item === prevProps.item;
};

export default React.memo(BaseSystemChat, isEqual);
