/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies

import * as React from 'react';
import Image from 'react-native-fast-image';
import PropsTypes from 'prop-types';
import moment from 'moment';
import {Dimensions, Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import AnonymousAvatar from '../../components/AnonymousAvatar';
import AnonymousUsername from '../../components/AnonymousUsername';
import ElipsisIcon from '../../assets/icon/ElipsisIcon';
import GlobalButton from '../../components/Button/GlobalButton';
import MemoEightyEight_hundred from '../../assets/timer/EightyEight_hundred';
import MemoFivety_sixtyTwo from '../../assets/timer/Fivety_sixtyTwo';
import MemoIc_arrow_back from '../../assets/arrow/Ic_arrow_back';
import MemoOne from '../../assets/timer/One';
import MemoPeopleFollow from '../../assets/icons/Ic_people_follow';
import MemoSeventyFive_eightySeven from '../../assets/timer/SeventyFive_eightySeven';
import MemoSixtyThree_seventyFour from '../../assets/timer/SixtyThree_seventyFour';
import MemoThirtySeven_fourtyNine from '../../assets/timer/ThirtySeven_fourtyNine';
import MemoTwentyFive_thirtySix from '../../assets/timer/TwentyFive_thirtySix';
import Memoic_globe from '../../assets/icons/ic_globe';
import StringConstant from '../../utils/string/StringConstant';
import useFeedHeader from './hooks/useFeedHeader';
import {DEFAULT_PROFILE_PIC_PATH, PRIVACY_PUBLIC} from '../../utils/constants';
import {calculateTime} from '../../utils/time';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import ShareAndroidIcon from '../../assets/icons/images/share-for-android.svg';
import TrashRed from '../../assets/icons/images/trash-red.svg';
import BottomSheetMenu from '../../components/BottomSheet/BottomSheetMenu';
import ShareUtils from '../../utils/share';
import {COLORS} from '../../utils/theme';

const {width: screenWidth} = Dimensions.get('window');

export const validationTimer = (createdAt, duration_feed) => {
  const postCreatedAt = moment(`${createdAt}Z`);
  const postExpiredAt = moment(`${createdAt}Z`).add(duration_feed, 'days');
  const now = moment();

  const timeFromExpiredToNow = postExpiredAt.diff(now, 'hours');
  const timeFromCreatedToExpired = postExpiredAt.diff(postCreatedAt, 'hours');

  const timePercentage = (timeFromExpiredToNow * 100) / timeFromCreatedToExpired;

  if (timePercentage < 25)
    return (
      <View testID="25">
        <MemoEightyEight_hundred height={17} width={17} />
      </View>
    );

  if (timePercentage < 38)
    return (
      <View testID="36">
        <MemoSeventyFive_eightySeven height={17} width={17} />
      </View>
    );

  if (timePercentage < 50)
    return (
      <View testID="50">
        <MemoSixtyThree_seventyFour height={17} width={17} />
      </View>
    );

  if (timePercentage < 63)
    return (
      <View testID="63">
        <MemoFivety_sixtyTwo height={17} width={17} />
      </View>
    );

  if (timePercentage < 75)
    return (
      <View testID="75">
        <MemoThirtySeven_fourtyNine height={17} width={17} />
      </View>
    );

  if (timePercentage < 88)
    return (
      <View testID="80">
        <MemoTwentyFive_thirtySix height={17} width={17} />
      </View>
    );

  return (
    <View testID="full">
      <MemoOne height={17} width={17} />
    </View>
  );
};

const _renderAnonimity = ({
  time,
  privacy,
  duration_feed,
  location,
  isBackButton,
  height,
  headerStyle,
  showAnonymousOption = false,
  onHeaderOptionClicked = () => {},
  hideThreeDot,
  version = 1,
  anonUserInfo = {},
  isPostDetail
}) => {
  const navigation = useNavigation();
  const refSheet = React.useRef();
  const dataSheet = [
    {
      id: 1,
      name: 'Share link',
      icon: <ShareAndroidIcon />
    }
  ];

  if (isShowDelete) {
    dataSheet.push({
      id: 2,
      name: 'Delete post',
      icon: <TrashRed />,
      onPress: () => {
        refSheet.current.close();
        onDeletePost();
      },
      style: {color: COLORS.red}
    });
  }

  return (
    <SafeAreaView>
      <View
        testID="anonymHeader"
        style={[
          styles.rowSpaceBeetwen,
          styles.heightHeader(height),
          {paddingLeft: isPostDetail ? 10 : 0}
        ]}>
        <View style={[styles.rowCenter, headerStyle]}>
          {isBackButton ? (
            <View testID="haveBackButton" style={[styles.btn]}>
              <GlobalButton
                testID="onBack"
                onPress={() => {
                  navigation.goBack();
                }}>
                <MemoIc_arrow_back height={20} width={20} />
              </GlobalButton>
            </View>
          ) : null}
          <View style={[styles.imageAnonymContainer]}>
            <AnonymousAvatar anonUserInfo={anonUserInfo} version={version} />
          </View>

          <View style={[styles.containerFeedProfile]}>
            <View style={[styles.containerFeedName, {alignItems: 'center'}]}>
              <AnonymousUsername version={version} anonUserInfo={anonUserInfo} />
            </View>
            <GlobalButton
              buttonStyle={{position: 'absolute', right: 0, top: -8}}
              onPress={() => refSheet.current.open()}>
              <View style={{zIndex: 1000}}>
                <ElipsisIcon width={4} height={14} fill={COLORS.blackgrey} />
              </View>
            </GlobalButton>
            <View style={styles.containerFeedText}>
              <Text style={styles.feedDate}>{calculateTime(time)}</Text>
              <View style={styles.point} />
              {privacy.toLowerCase() === PRIVACY_PUBLIC ? (
                <Memoic_globe height={16} width={16} />
              ) : (
                <MemoPeopleFollow height={16} width={16} />
              )}

              {duration_feed !== 'never' ? <View style={styles.point} /> : null}
              {duration_feed !== 'never' ? validationTimer(time, duration_feed) : null}
              <View style={styles.point} />
              <Text style={styles.feedDate}>{location}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const _renderProfileNormal = ({
  actor,
  time,
  privacy,
  duration_feed,
  location,
  isBackButton,
  height,
  source,
  headerStyle,
  onHeaderOptionClicked = () => {},
  hideThreeDot,
  isPostDetail
}) => {
  const refSheet = React.useRef();
  const dataSheet = [
    {
      id: 1,
      name: 'Share link',
      icon: <ShareAndroidIcon />,
      onPress: () => ShareUtils.shareUserLink(username)
    }
  ];

  if (isShowDelete) {
    dataSheet.push({
      id: 2,
      name: 'Delete post',
      icon: <TrashRed />,
      onPress: () => {
        refSheet.current.close();
        onDeletePost();
      },
      style: {color: COLORS.red}
    });
  }
  const {navigateToProfile, username, profile_pic_url, onBackNormalUser} = useFeedHeader({
    actor,
    source
  });
  return (
    <SafeAreaView>
      <View
        testID="defaultHeader"
        style={[
          styles.rowSpaceBeetwen,
          styles.heightHeader(height),
          styles.postDetail(isPostDetail)
        ]}>
        <View style={[styles.rowCenter, headerStyle]}>
          {isBackButton ? (
            <View testID="haveBackButton" style={styles.btn}>
              <GlobalButton testID="onBack" onPress={onBackNormalUser}>
                <MemoIc_arrow_back height={20} width={20} />
              </GlobalButton>
            </View>
          ) : null}
          <GlobalButton onPress={navigateToProfile}>
            <View style={{}}>
              <Image
                source={{
                  uri: profile_pic_url || DEFAULT_PROFILE_PIC_PATH
                }}
                style={styles.avatarImage}
              />
            </View>
          </GlobalButton>
          <GlobalButton
            onPress={navigateToProfile}
            style={[styles.containerFeedProfile, {paddingBottom: 5}]}>
            <View style={[styles.containerFeedName, {alignItems: 'flex-end'}]}>
              <Text style={styles.feedUsername}>
                {username || StringConstant.feedDeletedUserName}
              </Text>

              <GlobalButton
                buttonStyle={{marginLeft: 'auto', paddingBottom: 0, alignSelf: 'center'}}
                onPress={() => refSheet.current.open()}>
                <View style={{zIndex: 1000}}>
                  <ElipsisIcon width={4} height={14} fill={COLORS.blackgrey} />
                </View>
              </GlobalButton>
            </View>
            <View style={[styles.containerFeedText, {paddingBottom: 0}]}>
              <Text style={styles.feedDate}>{calculateTime(time)}</Text>
              <View style={styles.point} />
              {privacy?.toLowerCase() === PRIVACY_PUBLIC ? (
                <Memoic_globe height={16} width={16} />
              ) : (
                <MemoPeopleFollow height={16} width={16} />
              )}

              {duration_feed !== 'never' ? <View style={styles.point} /> : null}
              {duration_feed !== 'never' ? validationTimer(time, duration_feed) : null}
              <View style={styles.point} />
              <Text style={styles.feedDateLocation} numberOfLines={1}>
                {location}
              </Text>
            </View>
          </GlobalButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Header = ({
  props,
  isBackButton = false,
  height,
  source = null,
  headerStyle,
  onHeaderOptionClicked = () => {},
  showAnonymousOption = false,
  hideThreeDot,
  isPostDetail
}) => {
  const {
    anonimity,
    time,
    privacy,
    duration_feed,
    expired_at,
    location,
    actor,
    anon_user_info_color_code,
    anon_user_info_color_name,
    anon_user_info_emoji_code,
    anon_user_info_emoji_name,
    version = 1
  } = props;
  if (anonimity) {
    return _renderAnonimity({
      time,
      privacy,
      duration_feed,
      expired_at,
      location,
      isBackButton,
      height,
      headerStyle,
      showAnonymousOption,
      onHeaderOptionClicked: () => onHeaderOptionClicked(props),
      hideThreeDot,
      version,
      anonUserInfo: {
        colorCode: anon_user_info_color_code,
        colorName: anon_user_info_color_name,
        emojiCode: anon_user_info_emoji_code,
        emojiName: anon_user_info_emoji_name
      },
      isPostDetail
    });
  }
  return _renderProfileNormal({
    actor,
    time,
    privacy,
    duration_feed,
    expired_at,
    location,
    isBackButton,
    height,
    source,
    headerStyle,
    onHeaderOptionClicked: () => onHeaderOptionClicked(props),
    hideThreeDot,
    isPostDetail
  });
};

const styles = StyleSheet.create({
  heightHeader: (height) => ({
    height
  }),
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerFeedProfile: {
    justifyContent: 'space-between',
    // marginLeft: 13,
    flex: 1
  },
  containerFeedName: {
    flexDirection: 'row'
  },
  btn: {marginEnd: 0},
  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 16.94,
    color: COLORS.black
  },
  containerFeedText: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 0,
    width: '100%',
    marginTop: 3
  },
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.blackgrey,
    lineHeight: 18
  },
  feedDateLocation: {
    flex: 1,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.blackgrey,
    lineHeight: 18
  },
  point: {
    width: 2,
    height: 2,
    borderRadius: 4,
    backgroundColor: COLORS.gray8,
    marginLeft: 8,
    marginRight: 8,
    alignSelf: 'center',
    marginTop: 0
  },
  contentFeed: {
    marginTop: 12,
    flexDirection: 'column'
  },
  textContentFeed: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.black
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.gray8
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 24,
    color: COLORS.black
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: 12,
    lineHeight: 24,
    color: COLORS.gray8
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    aspectRatio: 1.5,
    resizeMode: 'contain'
  },
  noPaddingLeft: {
    paddingLeft: 0
  },
  imageAnonymContainer: {
    padding: 10
  },
  avatarImage: {height: 48, width: 48, borderRadius: 24},
  postDetail: (isPostDetail) => ({
    paddingLeft: isPostDetail ? 10 : 0
  }),
  contentFeedName: {
    flexDirection: 'row'
  },
  textFollow: {
    color: COLORS.blue,
    fontSize: normalizeFontSize(14),
    fontStyle: 'normal',
    fontWeight: '500'
  },
  textFollowing: {
    color: COLORS.grey9,
    fontSize: normalizeFontSize(14),
    fontStyle: 'normal',
    fontWeight: '500'
  }
});

Header.propsTypes = {
  props: PropsTypes.object,
  isBackButton: PropsTypes.bool
};

export default React.memo(Header);
