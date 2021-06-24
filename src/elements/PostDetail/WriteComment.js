import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import MemoSendComment from '../../assets/icon/IconSendComment';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import StringConstant from '../../utils/string/StringConstant';

const WriteComment = ({value = null, onPress, onChangeText}) => {
  let isCommentEnabled = value.length > 0;
  let isSendButtonPressed = () => {
    if (isCommentEnabled) return onPress();
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../assets/images/ProfileDefault.png')}
      />
      <View style={styles.content}>
        <TextInput
          placeholder={StringConstant.commentBoxDefaultPlaceholder}
          multiline={true}
          placeholderTextColor={colors.gray1}
          style={styles.text}
          onChangeText={onChangeText}
          value={value}
        />
      </View>
      <TouchableOpacity
        onPress={isSendButtonPressed}
        style={styles.btn(isCommentEnabled)}>
        <MemoSendComment style={styles.icSendButton} />
      </TouchableOpacity>
    </View>
  );
};

export default WriteComment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: colors.gray1,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingRight: 10,
    paddingLeft: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightgrey,
    marginLeft: 10,
    borderRadius: 8,
    paddingLeft: 6,
    paddingRight: 8,
    marginEnd: 8,
    flex: 1,
  },
  btn: (isCommentEnabled) => {
    return {
      backgroundColor: isCommentEnabled ? colors.bondi_blue : colors.gray1,
      borderRadius: 18,
      width: 35,
      height: 35,
      display: 'flex',
      justifyContent: 'center',
    };
  },
  btnText: {color: 'white', fontFamily: fonts.inter[400]},
  image: {
    width: 24,
    height: 24,
    marginLeft: -10,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.inter[400],
    color: colors.black,
    lineHeight: 24,
    paddingTop: 5,
    paddingBottom: 5,
  },
  icSendButton: {
    alignSelf: 'center',
  },
});
