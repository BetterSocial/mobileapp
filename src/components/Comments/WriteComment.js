import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ToggleSwitch from '../ToggleSwitch';

import AnonUserInfoRepo from '../../service/repo/anonUserInfoRepo';
import StringConstant from '../../utils/string/StringConstant';
import {Context} from '../../context';
import {fonts, normalize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import SendIcon from '../SendIcon';
import {CHAT_ANON, CHAT_SIGNED} from '../../utils/constants';

const WriteComment = ({
  value = null,
  onPress,
  onChangeText,
  username,
  inReplyCommentView = false,
  showProfileConnector = true,
  loadingPost = false,
  postId = '',
  isKeyboardOpen = false,
  isViewOnly = false,
  withAnonymityLabel = true
}) => {
  const [profile] = React.useContext(Context).profile;
  const commentInputRef = React.useRef(null);
  const [isAnonimity, setIsAnonimity] = React.useState(false);
  const isCommentEnabled = value.length > 0;
  const [loadingUser, setLoadingUser] = React.useState(false);
  const isDisableSubmit = !isCommentEnabled || loadingPost;
  const [anonimityData, setAnoimityData] = React.useState({});
  const getAnonUser = React.useCallback(async () => {
    setLoadingUser(true);
    try {
      if (!isAnonimity) {
        const response = await AnonUserInfoRepo.getCommentAnonUserInfo(postId);
        setLoadingUser(false);
        if (response?.isSuccess) {
          return setAnoimityData(response.data);
        }

        setIsAnonimity(false);
        return setAnoimityData({});
      }
      setLoadingUser(false);
      return setAnoimityData({});
    } catch (e) {
      return setAnoimityData({});
    }
  }, [isAnonimity, postId]);

  const toggleSwitch = () => {
    setIsAnonimity((prevState) => !prevState);
    getAnonUser();
  };

  React.useEffect(() => {
    if (isKeyboardOpen) {
      commentInputRef.current.focus();
    }
  }, [isKeyboardOpen, commentInputRef.current]);

  return (
    <View style={isViewOnly ? styles.isViewOnlyColumnContainer : styles.columnContainer}>
      <View style={styles.connectorTop(inReplyCommentView, showProfileConnector)} />
      <View style={{flexDirection: 'row', paddingRight: 10}}>
        <Text style={styles.replyToContainer(inReplyCommentView)}>
          <Text style={styles.replyToTitle}>Reply to </Text>
          {username}
        </Text>
        <View style={styles.anonimityContainer}>
          <ToggleSwitch
            value={isAnonimity}
            onValueChange={toggleSwitch}
            labelLeft={withAnonymityLabel ? 'Anonymity' : null}
            backgroundActive={COLORS.lightgrey}
            backgroundInactive={COLORS.lightgrey}
            styleLabelLeft={styles.switch}
            isViewOnly={isViewOnly}
          />
        </View>
      </View>
      <View style={styles.container(inReplyCommentView)}>
        <View style={styles.connectorBottom(inReplyCommentView, showProfileConnector)} />
        {isAnonimity ? (
          <>
            {loadingUser ? (
              <ActivityIndicator size={'small'} color={COLORS.bondi_blue} />
            ) : (
              <View style={[styles.image, {backgroundColor: anonimityData.colorCode}]}>
                <Text style={styles.emojyStyle}>{anonimityData.emojiCode}</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <FastImage
              style={styles.image}
              source={{
                uri: profile.myProfile.profile_pic_path
              }}
            />
          </>
        )}

        <TextInput
          testID="changeinput"
          ref={commentInputRef}
          placeholder={StringConstant.commentBoxDefaultPlaceholder}
          placeholderTextColor={COLORS.blackgrey}
          style={[styles.text, styles.content(isViewOnly)]}
          onChangeText={onChangeText}
          value={value}
          multiline
          textAlignVertical="center"
          pointerEvents={isViewOnly ? 'none' : 'auto'}
        />
        {!isViewOnly ? (
          <TouchableOpacity
            testID="iscommentenable"
            onPress={() => onPress(isAnonimity, anonimityData)}
            style={styles.btn(isDisableSubmit || loadingUser)}
            disabled={isDisableSubmit || loadingUser}>
            <SendIcon
              type={!isAnonimity ? CHAT_SIGNED : CHAT_ANON}
              isDisabled={isDisableSubmit || loadingUser}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.isViewOnlyIcon}>
            <SendIcon type={CHAT_SIGNED} />
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(WriteComment);

export const styles = StyleSheet.create({
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.balance_gray,
    // zIndex: 1,
    paddingBottom: 14
  },
  isViewOnlyColumnContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray1,
    position: 'absolute'
  },
  replyToContainer: (inReplyCommentView) => ({
    marginLeft: inReplyCommentView ? 90 : 60,
    fontFamily: fonts.inter[600],
    marginBottom: 11,
    marginTop: 7,
    lineHeight: 15,
    fontSize: 12,
    color: COLORS.blackgrey
  }),
  replyToTitle: {
    fontFamily: fonts.inter[600],
    lineHeight: 15,
    fontSize: 12,
    color: COLORS.black
  },
  container: (inReplyCommentView) => ({
    flex: 1,
    backgroundColor: COLORS.white,
    width: '100%',
    paddingRight: 10,
    paddingLeft: inReplyCommentView ? 50 : 20,
    flexDirection: 'row',
    zIndex: 100
  }),
  content: (isViewOnly) => ({
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    backgroundColor: COLORS.lightgrey,
    marginLeft: 8,
    borderRadius: 8,
    paddingLeft: 6,
    paddingRight: 8,
    marginEnd: 8,
    flex: 1,
    height: isViewOnly ? 36 : undefined
  }),
  btn: (isDisableSubmit) => ({
    backgroundColor: !isDisableSubmit ? COLORS.bondi_blue : COLORS.concrete,
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
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.inter[400],
    color: COLORS.black,
    maxHeight: 100,
    paddingTop: Platform.OS === 'ios' ? 10 : 5,
    paddingBottom: Platform.OS === 'ios' ? 10 : 5
  },
  icSendButton: {
    alignSelf: 'center'
  },
  connectorTop: (inReplyCommentView, showProfileConnector) => ({
    height: showProfileConnector ? 36 : 0,
    width: 1,
    backgroundColor: COLORS.balance_gray,
    position: 'absolute',
    top: 0,
    left: inReplyCommentView ? 60 : 30,
    zIndex: -100
  }),
  connectorBottom: (inReplyCommentView, showProfileConnector) => ({
    height: showProfileConnector ? 20 : 0,
    width: 1,
    backgroundColor: COLORS.balance_gray,
    position: 'absolute',
    top: 0,
    left: inReplyCommentView ? 60 : 30,
    zIndex: -100
  }),
  anonimityContainer: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emojyStyle: {
    fontSize: 18
  },
  switch: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.blackgrey
  },
  isViewOnlyIcon: {
    width: normalize(32),
    height: normalize(32)
  }
});
