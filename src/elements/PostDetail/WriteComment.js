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

const WriteComment = ({value = null, onPress, onChangeText, username}) => {
  let isCommentEnabled = value.length > 0;
  let isSendButtonPressed = () => {
    if (isCommentEnabled) return onPress();
  };

  return (
    <View style={styles.columnContainer}>
      <View style={styles.connector} />
      <Text style={styles.replyToContainer}>
        <Text style={styles.replyToTitle}>Reply to </Text>
        {username}
      </Text>
      <View style={styles.container}>
        <View style={styles.connector} />
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
    </View>
  );
};

export default WriteComment;

const styles = StyleSheet.create({
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white,
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.gray1,
    // zIndex: 1,
    paddingBottom: 15,
  },
  replyToContainer: {
    marginLeft: 48,
    fontFamily: fonts.inter[500],
    marginBottom: 11,
    marginTop: 7,
    lineHeight: 14.52,
    color: colors.gray1,
  },
  replyToTitle: {
    fontFamily: fonts.inter[700],
    lineHeight: 14.52,
    color: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    paddingRight: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
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
    zIndex: -10,
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
  connector: {
    height: '50%',
    width: 1,
    backgroundColor: colors.gray1,
    position: 'absolute',
    top: 0,
    left: 22,
    zIndex: -100,
  },
});
