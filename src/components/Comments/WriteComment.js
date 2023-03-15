import * as React from 'react';
import {Image, StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import StringConstant from '../../utils/string/StringConstant';
import MemoSendComment from '../../assets/icon/IconSendComment';
import {Context} from '../../context';

const WriteComment = ({
  value = null,
  onPress,
  onChangeText,
  username,
  inReplyCommentView = false,
  showProfileConnector = true,
  loadingPost = false
}) => {
  const [profile] = React.useContext(Context).profile;
  const commentInputRef = React.useRef(null);
  const isCommentEnabled = value.length > 0;
  const isDisableSubmit = !isCommentEnabled || loadingPost;
  const isSendButtonPressed = () => onPress();
  return (
    <View style={styles.columnContainer}>
      <View style={styles.connectorTop(inReplyCommentView, showProfileConnector)} />
      <Text style={styles.replyToContainer(inReplyCommentView)}>
        <Text style={styles.replyToTitle}>Reply to </Text>
        {username}
      </Text>
      <View style={styles.container(inReplyCommentView)}>
        <View style={styles.connectorBottom(inReplyCommentView, showProfileConnector)} />
        <Image
          style={styles.image}
          source={{
            uri: profile.myProfile.profile_pic_path
          }}
        />
        <View style={styles.content}>
          <TextInput
            testID="changeinput"
            ref={commentInputRef}
            placeholder={StringConstant.commentBoxDefaultPlaceholder}
            // multiline={isAndroid}
            placeholderTextColor={colors.gray}
            style={styles.text}
            onChangeText={onChangeText}
            value={value}
          />
        </View>
        <TouchableOpacity
          testID="iscommentenable"
          onPress={isSendButtonPressed}
          style={styles.btn(isDisableSubmit)}
          disabled={isDisableSubmit}>
          <MemoSendComment style={styles.icSendButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(WriteComment);

export const styles = StyleSheet.create({
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
    paddingBottom: 14
  },
  replyToContainer: (inReplyCommentView) => ({
    marginLeft: inReplyCommentView ? 90 : 60,
    fontFamily: fonts.inter[600],
    marginBottom: 11,
    marginTop: 7,
    lineHeight: 15,
    fontSize: 12,
    color: colors.gray
  }),
  replyToTitle: {
    fontFamily: fonts.inter[600],
    lineHeight: 15,
    fontSize: 12,
    color: colors.black
  },
  container: (inReplyCommentView) => ({
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    paddingRight: 10,
    paddingLeft: inReplyCommentView ? 50 : 20,
    flexDirection: 'row',
    zIndex: 100
  }),
  content: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    backgroundColor: colors.lightgrey,
    marginLeft: 8,
    borderRadius: 8,
    paddingLeft: 6,
    paddingRight: 8,
    marginEnd: 8,
    flex: 1
  },
  btn: (isDisableSubmit) => ({
    backgroundColor: !isDisableSubmit ? colors.bondi_blue : '#f2f2f2',
    borderRadius: 18,
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 1.5,
    alignSelf: 'flex-end'
  }),
  btnText: {color: 'white', fontFamily: fonts.inter[400]},
  image: {
    width: 36,
    height: 36,
    marginLeft: -7,
    zIndex: -10,
    borderRadius: 18
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.inter[400],
    color: colors.black,
    lineHeight: 14.52,
    paddingTop: 5,
    paddingBottom: 5,
    maxHeight: 100
  },
  icSendButton: {
    alignSelf: 'center'
  },
  connectorTop: (inReplyCommentView, showProfileConnector) => ({
    height: showProfileConnector ? 36 : 0,
    width: 1,
    backgroundColor: colors.gray1,
    position: 'absolute',
    top: 0,
    left: inReplyCommentView ? 60 : 30,
    zIndex: -100
  }),
  connectorBottom: (inReplyCommentView, showProfileConnector) => ({
    height: showProfileConnector ? 20 : 0,
    width: 1,
    backgroundColor: colors.gray1,
    position: 'absolute',
    top: 0,
    left: inReplyCommentView ? 60 : 30,
    zIndex: -100
  })
});
