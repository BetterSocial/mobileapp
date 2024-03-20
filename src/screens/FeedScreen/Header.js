/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies

import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import PropsTypes from 'prop-types';
import * as React from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import MemoIc_arrow_back from '../../assets/arrow/Ic_arrow_back';
import ElipsisIcon from '../../assets/icon/ElipsisIcon';
import MemoPeopleFollow from '../../assets/icons/Ic_people_follow';
import MemoicGlobe from '../../assets/icons/ic_globe';
import ShareAndroidIcon from '../../assets/icons/images/share-for-android.svg';
import TrashRed from '../../assets/icons/images/trash-red.svg';
import MemoEightyEight_hundred from '../../assets/timer/EightyEight_hundred';
import MemoFivety_sixtyTwo from '../../assets/timer/Fivety_sixtyTwo';
import MemoOne from '../../assets/timer/One';
import MemoSeventyFive_eightySeven from '../../assets/timer/SeventyFive_eightySeven';
import MemoSixtyThree_seventyFour from '../../assets/timer/SixtyThree_seventyFour';
import MemoThirtySeven_fourtyNine from '../../assets/timer/ThirtySeven_fourtyNine';
import MemoTwentyFive_thirtySix from '../../assets/timer/TwentyFive_thirtySix';
import AnonymousAvatar from '../../components/AnonymousAvatar';
import AnonymousUsername from '../../components/AnonymousUsername';
import BottomSheetMenu from '../../components/BottomSheet/BottomSheetMenu';
import GlobalButton from '../../components/Button/GlobalButton';
import {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_FEED_SCREEN,
  DEFAULT_PROFILE_PIC_PATH,
  PRIVACY_PUBLIC
} from '../../utils/constants';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import ShareUtils from '../../utils/share';
import StringConstant from '../../utils/string/StringConstant';
import {COLORS} from '../../utils/theme';
import {calculateTime} from '../../utils/time';
import ProfilePicture from '../ProfileScreen/elements/ProfilePicture';
import BlurredLayer from './elements/BlurredLayer';
import useFeedHeader from './hooks/useFeedHeader';

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
  version = 1,
  anonUserInfo = {},
  isPostDetail,
  karmaScore = 0,
  isBlurredPost = false,
  isFollow = false,
  onPressFollUnFoll = () => {},
  onDeletePost = () => {},
  isShowDelete = false,
  isSelf = false,
  hideThreeDot,
  item,
  disabledFollow
}) => {
  const navigation = useNavigation();
  const refSheet = React.useRef();

  const dataSheet = [
    {
      id: 1,
      name: 'Share link',
      icon: <ShareAndroidIcon />,
      onPress: () =>
        ShareUtils.shareFeeds(item, ANALYTICS_SHARE_POST_FEED_SCREEN, ANALYTICS_SHARE_POST_FEED_ID)
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
      <BlurredLayer toastOnly={true} isVisible={isBlurredPost}>
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
                    navigation.navigate('HomeTabs', {
                      screen: 'Feed',
                      params: {
                        isGoBack: true
                      }
                    });
                  }}>
                  <MemoIc_arrow_back height={20} width={20} />
                </GlobalButton>
              </View>
            ) : null}
            <View style={[styles.imageAnonymContainer]}>
              <AnonymousAvatar
                karmaScore={karmaScore}
                anonUserInfo={anonUserInfo}
                version={version}
                withKarma
              />
            </View>

            <View style={[styles.containerFeedProfile]}>
              <View
                style={[
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }
                ]}>
                <View
                  style={{
                    marginTop: -6,
                    flexDirection: 'row'
                  }}>
                  <AnonymousUsername version={version} anonUserInfo={anonUserInfo} isFeed={true} />

                  {disabledFollow
                    ? null
                    : !isSelf && (
                        <React.Fragment>
                          <View style={styles.point} />
                          <TouchableOpacity onPress={() => onPressFollUnFoll(isFollow)}>
                            <Text style={isFollow ? styles.textFollowing : styles.textFollow}>
                              {isFollow ? 'Following' : 'Follow'}
                            </Text>
                          </TouchableOpacity>
                        </React.Fragment>
                      )}
                </View>
                {hideThreeDot ? null : (
                  <GlobalButton
                    onPress={() => {
                      refSheet.current.open();
                    }}>
                    <View style={{zIndex: 1000}}>
                      <ElipsisIcon width={4} height={14} fill={COLORS.blackgrey} />
                    </View>
                  </GlobalButton>
                )}
              </View>

              <View
                style={[
                  styles.containerFeedText,
                  {
                    marginTop: -6,
                    paddingBottom: 4
                  }
                ]}>
                <Text style={styles.feedDate}>{calculateTime(time)}</Text>
                <View style={styles.point} />
                {privacy.toLowerCase() === PRIVACY_PUBLIC ? (
                  <MemoicGlobe height={16} width={16} />
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
        <BottomSheetMenu
          refSheet={refSheet}
          dataSheet={dataSheet}
          height={isShowDelete ? 182 : 130}
        />
      </BlurredLayer>
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
  isPostDetail,
  karmaScore = 0,
  isFollow = false,
  onPressFollUnFoll = () => {},
  onDeletePost = () => {},
  isShowDelete = false,
  isSelf = false,
  item,
  disabledFollow
}) => {
  const refSheet = React.useRef();
  const dataSheet = [
    {
      id: 1,
      name: 'Share link',
      icon: <ShareAndroidIcon />,
      onPress: () =>
        ShareUtils.shareFeeds(item, ANALYTICS_SHARE_POST_FEED_SCREEN, ANALYTICS_SHARE_POST_FEED_ID)
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
            <ProfilePicture
              karmaScore={karmaScore}
              profilePicPath={profile_pic_url ?? DEFAULT_PROFILE_PIC_PATH}
              size={50}
              width={3}
              withKarma
              onImageContainerClick={navigateToProfile}
            />
          </GlobalButton>
          <GlobalButton
            onPress={navigateToProfile}
            style={[styles.containerFeedProfile, {paddingBottom: 5}]}>
            <View>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center'
                  }
                ]}>
                <View
                  style={{
                    flexDirection: 'row'
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.inter[600],
                      fontWeight: 'bold',
                      fontSize: 14,
                      lineHeight: 16.94,
                      color: COLORS.black
                    }}>
                    {username || StringConstant.feedDeletedUserName}
                  </Text>
                  {disabledFollow
                    ? null
                    : !isSelf && (
                        <React.Fragment>
                          <View style={styles.point} />
                          <TouchableOpacity onPress={() => onPressFollUnFoll(isFollow)}>
                            <Text style={isFollow ? styles.textFollowing : styles.textFollow}>
                              {isFollow ? 'Following' : 'Follow'}
                            </Text>
                          </TouchableOpacity>
                        </React.Fragment>
                      )}
                </View>

                <GlobalButton
                  buttonStyle={{
                    marginLeft: 'auto',
                    paddingBottom: 0,
                    alignSelf: 'center'
                  }}
                  onPress={() => {
                    refSheet.current.open();
                  }}>
                  {hideThreeDot ? null : (
                    <View style={{zIndex: 1000}}>
                      <ElipsisIcon width={4} height={14} fill={COLORS.blackgrey} />
                    </View>
                  )}
                </GlobalButton>
              </View>
            </View>
            <View style={[styles.containerFeedText, {paddingBottom: 0}]}>
              <Text style={styles.feedDate}>{calculateTime(time)}</Text>
              <View style={styles.point} />
              {privacy?.toLowerCase() === PRIVACY_PUBLIC ? (
                <MemoicGlobe height={16} width={16} />
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
      <BottomSheetMenu
        refSheet={refSheet}
        dataSheet={dataSheet}
        height={isShowDelete ? 182 : 130}
      />
    </SafeAreaView>
  );
};

const Header = ({
  props,
  isBackButton = false,
  height,
  source = null,
  headerStyle,
  showAnonymousOption = false,
  isPostDetail,
  isFollow = false,
  onPressFollUnFoll = () => {},
  onDeletePost = () => {},
  isShowDelete = false,
  isSelf = false,
  item,
  onHeaderOptionClicked,
  hideThreeDot,
  disabledFollow
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
    version = 1,
    isBlurredPost
  } = props;
  if (anonimity) {
    return _renderAnonimity({
      item,
      time,
      privacy,
      duration_feed,
      expired_at,
      location,
      isBackButton,
      height,
      headerStyle,
      showAnonymousOption,
      version,
      anonUserInfo: {
        colorCode: anon_user_info_color_code,
        colorName: anon_user_info_color_name,
        emojiCode: anon_user_info_emoji_code,
        emojiName: anon_user_info_emoji_name
      },
      isPostDetail,
      karmaScore: props?.karma_score,
      isBlurredPost,
      isFollow,
      onPressFollUnFoll,
      onDeletePost,
      isShowDelete,
      isSelf,
      onHeaderOptionClicked,
      actor,
      source,
      disabledFollow
    });
  }
  return _renderProfileNormal({
    item,
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
    isPostDetail,
    karmaScore: props?.karma_score,
    isFollow,
    onPressFollUnFoll,
    onDeletePost,
    isShowDelete,
    isSelf,
    disabledFollow
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
    color: COLORS.black,
    flex: 1
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
    backgroundColor: COLORS.blackgrey,
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
    color: COLORS.blackgrey
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
    color: COLORS.blackgrey
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
    paddingHorizontal: 10
  },
  avatarImage: {height: 48, width: 48, borderRadius: 24},
  postDetail: (isPostDetail) => ({
    paddingLeft: isPostDetail ? 10 : 0
  }),
  contentFeedName: {
    flexDirection: 'row'
  },
  textFollow: {
    color: COLORS.bluePrimary,
    fontSize: normalizeFontSize(14),
    fontStyle: 'normal',
    fontWeight: '500'
  },
  textFollowing: {
    color: COLORS.greySubtile1,
    fontSize: normalizeFontSize(14),
    fontStyle: 'normal',
    fontWeight: '500'
  }
});

Header.propTypes = {
  props: PropsTypes.object,
  isBackButton: PropsTypes.bool
};

export default React.memo(Header);
