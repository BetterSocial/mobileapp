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

import AnalyticsEventTracking from '../../libraries/analytics/analyticsEventTracking';
import AnonUserInfoRepo from '../../service/repo/anonUserInfoRepo';
import IconCloseBold from '../../assets/icon/IconCloseBold';
import SendIcon from '../SendIcon';
import StringConstant from '../../utils/string/StringConstant';
import ToggleSwitch from '../ToggleSwitch';
import dimen from '../../utils/dimen';
import {CHAT_ANON, CHAT_SIGNED} from '../../utils/constants';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {fonts, normalize} from '../../utils/fonts';

const WriteComment = ({
  value = null,
  onPress,
  onChangeText,
  username,
  loadingPost = false,
  postId = '',
  isKeyboardOpen = false,
  isViewOnly = false,
  withAnonymityLabel = true,
  isReply = false,
  onClear = () => {},
  eventTrackName = {
    anonimityChangedToOn: null,
    anonimityChangedToOff: null
  }
}) => {
  const [profile] = React.useContext(Context).profile;
  const commentInputRef = React.useRef(null);
  const [isAnonimity, setIsAnonimity] = React.useState(false);
  const isCommentEnabled = value?.length > 0;
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
    setIsAnonimity((prevState) => {
      const isNextStateOn = !prevState;
      if (isNextStateOn && eventTrackName.anonimityChangedToOn)
        AnalyticsEventTracking.eventTrack(eventTrackName.anonimityChangedToOn);
      else if (!isNextStateOn && eventTrackName.anonimityChangedToOff)
        AnalyticsEventTracking.eventTrack(eventTrackName.anonimityChangedToOff);
      return isNextStateOn;
    });
    getAnonUser();
  };

  React.useEffect(() => {
    if (isKeyboardOpen) {
      commentInputRef.current.focus();
    }
  }, [isKeyboardOpen, commentInputRef?.current]);

  return (
    <View style={isViewOnly ? styles.isViewOnlyColumnContainer : styles.columnContainer}>
      {/* <View style={styles.connectorTop(inReplyCommentView, showProfileConnector)} /> */}
      <View style={styles.rowTop}>
        <View style={styles.replyToContainer}>
          <Text style={styles.replyToTitle}>Reply to </Text>
          <Text style={styles.replyToUsername} numberOfLines={1} ellipsizeMode="tail">
            {username}
          </Text>
          {(isReply || value?.trim() !== '') && (
            <TouchableOpacity
              onPress={() => {
                onChangeText('');
                onClear();
              }}>
              <IconCloseBold />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.anonimityContainer}>
          <ToggleSwitch
            value={isAnonimity}
            onValueChange={toggleSwitch}
            labelLeft={withAnonymityLabel ? 'Incognito' : null}
            backgroundActive={COLORS.gray110}
            backgroundInactive={COLORS.gray110}
            isDisabled={isViewOnly}
          />
        </View>
      </View>
      <View style={styles.container}>
        {/* <View style={styles.connectorBottom(inReplyCommentView, showProfileConnector)} /> */}
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
          placeholderTextColor={COLORS.gray410}
          style={[styles.text, styles.content]}
          onChangeText={onChangeText}
          value={value}
          multiline
          textAlignVertical="center"
          pointerEvents={isViewOnly ? 'none' : 'auto'}
          keyboardAppearance="dark"
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
    justifyContent: 'center',
    backgroundColor: COLORS.almostBlack,
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray210,
    // zIndex: 1,
    paddingTop: dimen.normalizeDimen(5),
    paddingBottom: dimen.normalizeDimen(10)
  },
  isViewOnlyColumnContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray1,
    position: 'absolute'
  },
  rowTop: {
    flexDirection: 'row',
    paddingRight: dimen.normalizeDimen(16),
    paddingLeft: dimen.normalizeDimen(7),
    paddingBottom: dimen.normalizeDimen(8)
  },
  replyToContainer: {
    marginLeft: 53,
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: normalize(150)
  },
  replyToTitle: {
    fontFamily: fonts.inter[600],
    lineHeight: 12,
    fontSize: 12,
    color: COLORS.gray410
  },
  replyToUsername: {
    fontFamily: fonts.inter[600],
    lineHeight: 12,
    fontSize: 12,
    color: COLORS.white,
    marginRight: dimen.normalizeDimen(6)
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
    width: '100%',
    paddingRight: dimen.normalizeDimen(16),
    paddingLeft: dimen.normalizeDimen(16),
    flexDirection: 'row',
    zIndex: 100,
    alignItems: 'center'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.gray110,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 8,
    paddingTop: 6,
    paddingHorizontal: 5,
    paddingBottom: 5,
    minHeight: normalize(30)
  },
  btn: (isDisableSubmit) => ({
    backgroundColor: !isDisableSubmit ? COLORS.bondi_blue : COLORS.gray110,
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
    zIndex: -10,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.inter[400],
    color: COLORS.black,
    maxHeight: 100
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
    left: inReplyCommentView ? 60 : 37,
    zIndex: -100
  }),
  connectorBottom: (inReplyCommentView, showProfileConnector) => ({
    height: showProfileConnector ? 20 : 0,
    width: 1,
    backgroundColor: COLORS.balance_gray,
    position: 'absolute',
    top: 0,
    left: inReplyCommentView ? 60 : 37,
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
  isViewOnlyIcon: {
    width: normalize(32),
    height: normalize(32)
  }
});
