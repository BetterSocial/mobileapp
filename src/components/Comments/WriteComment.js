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

import AsyncStorage from '@react-native-async-storage/async-storage';
import AnonUserInfoRepo from '../../service/repo/anonUserInfoRepo';
import MemoSendComment from '../../assets/icon/IconSendComment';
import StringConstant from '../../utils/string/StringConstant';
import {Context} from '../../context';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';

const WriteComment = ({
  value = null,
  onPress,
  onChangeText,
  username,
  inReplyCommentView = false,
  showProfileConnector = true,
  loadingPost = false,
  postId = ''
}) => {
  const [profile] = React.useContext(Context).profile;
  const commentInputRef = React.useRef(null);
  const [isAnonimity, setIsAnonimity] = React.useState(false);
  const isCommentEnabled = value.length > 0;
  const [loadingUser, setLoadingUser] = React.useState(false);
  const [anonimityData, setAnoimityData] = React.useState({});
  const storageKey = 'isAnonymByDefault';
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
      console.log(e, 'error');
      return setAnoimityData({});
    }
  }, [isAnonimity, postId]);

  const toggleSwitch = () => {
    setIsAnonimity((prevState) => !prevState);
    getAnonUser();
    if (isAnonimity) saveToStorage('null');
    if (!isAnonimity) saveToStorage('true');
  };

  React.useEffect(() => {
    AsyncStorage.getItem(storageKey).then((data) => {
      if (data === 'true') {
        setIsAnonimity(true);
        getAnonUser();
      }
    });
  }, []);
  const saveToStorage = (valueData) => {
    AsyncStorage.setItem(storageKey, valueData);
  };
  return (
    <View style={styles.columnContainer}>
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
            labelLeft="Anonymity"
            backgroundActive={colors.lightgrey}
            backgroundInactive={colors.lightgrey}
            styleLabelLeft={styles.switch}
          />
        </View>
      </View>
      <View style={styles.container(inReplyCommentView)}>
        <View style={styles.connectorBottom(inReplyCommentView, showProfileConnector)} />
        {isAnonimity ? (
          <>
            {loadingUser ? (
              <ActivityIndicator size={'small'} color={colors.bondi_blue} />
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
                  ? profile.myProfile.profile_pic_path
                  : DEFAULT_PROFILE_PIC_PATH
              }}
            />
          </>
        )}

        <TextInput
          testID="changeinput"
          ref={commentInputRef}
          placeholder={StringConstant.commentBoxDefaultPlaceholder}
          placeholderTextColor={colors.gray}
          style={[styles.text, styles.content]}
          onChangeText={onChangeText}
          value={value}
          multiline
          textAlignVertical="center"
        />
        <TouchableOpacity
          testID="iscommentenable"
          onPress={() => onPress(isAnonimity, anonimityData)}
          style={styles.btn(!isCommentEnabled || loadingUser || loadingPost)}
          disabled={!isCommentEnabled || loadingUser || loadingPost}>
          <MemoSendComment
            fillBackground={
              !isCommentEnabled || loadingUser || loadingPost ? '#C4C4C4' : colors.bondi_blue
            }
          />
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
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.inter[400],
    color: colors.black,
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
    color: colors.gray
  }
});
