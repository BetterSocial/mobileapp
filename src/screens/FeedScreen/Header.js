/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies

import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import PropsTypes from 'prop-types';
import moment from 'moment';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import AnalyticsEventTracking from '../../libraries/analytics/analyticsEventTracking';
import AnonymousAvatar from '../../components/AnonymousAvatar';
import AnonymousUsername from '../../components/AnonymousUsername';
import BlurredLayer from './elements/BlurredLayer';
import BottomSheetMenu from '../../components/BottomSheet/BottomSheetMenu';
import ElipsisIcon from '../../assets/icon/ElipsisIcon';
import GlobalButton from '../../components/Button/GlobalButton';
import IconChevronLeft from '../../assets/icon/IconChevronLeft';
import MemoEightyEight_hundred from '../../assets/timer/EightyEight_hundred';
import MemoFivety_sixtyTwo from '../../assets/timer/Fivety_sixtyTwo';
import MemoIc_arrow_back from '../../assets/arrow/Ic_arrow_back';
import MemoOne from '../../assets/timer/One';
import MemoSeventyFive_eightySeven from '../../assets/timer/SeventyFive_eightySeven';
import MemoSixtyThree_seventyFour from '../../assets/timer/SixtyThree_seventyFour';
import MemoThirtySeven_fourtyNine from '../../assets/timer/ThirtySeven_fourtyNine';
import MemoTwentyFive_thirtySix from '../../assets/timer/TwentyFive_thirtySix';
import ProfilePicture from '../ProfileScreen/elements/ProfilePicture';
import ShareAndroidIcon from '../../assets/icons/images/share-for-android.svg';
import ShareUtils from '../../utils/share';
import StringConstant from '../../utils/string/StringConstant';
import TrashRed from '../../assets/icons/images/trash-red.svg';
import useFeedHeader from './hooks/useFeedHeader';
import {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_FEED_SCREEN,
  DEFAULT_PROFILE_PIC_PATH
} from '../../utils/constants';
import {COLORS} from '../../utils/theme';
import {calculateTime} from '../../utils/time';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';

const {width: screenWidth} = Dimensions.get('window');

export const validationTimer = (createdAt, duration_feed, color = COLORS.gray410) => {
  const postCreatedAt = moment(`${createdAt}Z`);
  const postExpiredAt = moment(`${createdAt}Z`).add(duration_feed, 'days');
  const now = moment();

  const timeFromExpiredToNow = postExpiredAt.diff(now, 'hours');
  const timeFromCreatedToExpired = postExpiredAt.diff(postCreatedAt, 'hours');

  const timePercentage = (timeFromExpiredToNow * 100) / timeFromCreatedToExpired;

  if (timePercentage < 25)
    return (
      <View testID="25">
        <MemoEightyEight_hundred height={17} width={17} fill={color} />
      </View>
    );

  if (timePercentage < 38)
    return (
      <View testID="36">
        <MemoSeventyFive_eightySeven height={17} width={17} fill={color} />
      </View>
    );

  if (timePercentage < 50)
    return (
      <View testID="50">
        <MemoSixtyThree_seventyFour height={17} width={17} fill={color} />
      </View>
    );

  if (timePercentage < 63)
    return (
      <View testID="63">
        <MemoFivety_sixtyTwo height={17} width={17} fill={color} />
      </View>
    );

  if (timePercentage < 75)
    return (
      <View testID="75">
        <MemoThirtySeven_fourtyNine height={17} width={17} fill={color} />
      </View>
    );

  if (timePercentage < 88)
    return (
      <View testID="80">
        <MemoTwentyFive_thirtySix height={17} width={17} fill={color} />
      </View>
    );

  return (
    <View testID="full">
      <MemoOne height={17} width={17} fill={color} />
    </View>
  );
};

const _renderAnonimity = ({
  time,
  duration_feed,
  isBackButton,
  height,
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
  disabledFollow,
  isFromFeeds,
  isShortText = false,
  threeDotsEventName,
  shareLinkEventName
}) => {
  const navigation = useNavigation();
  const refSheet = React.useRef();

  const dataSheet = [
    {
      id: 1,
      name: 'Share link',
      icon: <ShareAndroidIcon />,
      onPress: () => {
        ShareUtils.shareFeeds(item, ANALYTICS_SHARE_POST_FEED_SCREEN, ANALYTICS_SHARE_POST_FEED_ID);
        if (shareLinkEventName) AnalyticsEventTracking.eventTrack(shareLinkEventName);
      }
    }
  ];

  if (isShowDelete) {
    dataSheet.push({
      id: 2,
      name: 'Delete post',
      icon: <TrashRed />,
      onPress: () => {
        refSheet.current.close();
        onDeletePost(item);
      },
      style: {color: COLORS.redalert}
    });
  }

  return (
    <SafeAreaView>
      <BlurredLayer toastOnly={true} isVisible={isBlurredPost}>
        <View testID="anonymHeader" style={[styles.rowCenter, styles.header(height, isPostDetail)]}>
          {isShortText && (
            <LinearGradient
              colors={['#184A57', '#184A57']}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderTopLeftRadius: normalize(15),
                borderTopRightRadius: normalize(15)
              }}
            />
          )}
          {isBackButton ? (
            <View testID="haveBackButton" style={[styles.btn]}>
              <GlobalButton
                testID="onBack"
                onPress={() => {
                  if (isFromFeeds) {
                    return navigation.navigate('HomeTabs', {
                      screen: 'Feed',
                      params: {
                        isGoBack: true
                      }
                    });
                  }
                  return navigation.goBack();
                }}>
                <IconChevronLeft fill={COLORS.white} />
              </GlobalButton>
            </View>
          ) : null}
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <AnonymousAvatar
                karmaScore={karmaScore}
                anonUserInfo={anonUserInfo}
                version={version}
                withKarma
                radius={25}
              />
              <View style={{width: 6}} />
              <AnonymousUsername version={version} anonUserInfo={anonUserInfo} isFeed={true} />
              <View
                style={[
                  styles.point(isShortText),
                  {backgroundColor: isShortText ? COLORS.gray310 : COLORS.gray410}
                ]}
              />
              <Text style={styles.feedDate(isShortText)}>
                {calculateTime(time).replace(' ago', '')}
              </Text>
              {duration_feed !== 'never' ? <View style={styles.point(isShortText)} /> : null}
              {duration_feed !== 'never'
                ? validationTimer(time, duration_feed, COLORS.gray410)
                : null}
              {disabledFollow
                ? null
                : !isSelf && (
                    <React.Fragment>
                      <View
                        style={[
                          styles.point(isShortText),
                          {backgroundColor: isShortText ? COLORS.gray310 : COLORS.gray410}
                        ]}
                      />
                      <TouchableOpacity onPress={() => onPressFollUnFoll(isFollow)}>
                        <Text
                          style={isFollow ? styles.textFollowing : styles.textFollow(isShortText)}>
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
                  if (threeDotsEventName) AnalyticsEventTracking.eventTrack(threeDotsEventName);
                }}>
                <View style={{zIndex: 1000}}>
                  <ElipsisIcon width={16} height={16} color={COLORS.gray410} />
                </View>
              </GlobalButton>
            )}
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
  duration_feed,
  isBackButton,
  height,
  source,
  hideThreeDot,
  isPostDetail,
  karmaScore = 0,
  isFollow = false,
  onPressFollUnFoll = () => {},
  onDeletePost = () => {},
  isShowDelete = false,
  isSelf = false,
  item,
  disabledFollow,
  isFromFeeds,
  isShortText,
  navigateToProfileEventName,
  threeDotsEventName,
  shareLinkEventName
}) => {
  const refSheet = React.useRef();
  const dataSheet = [
    {
      id: 1,
      name: 'Share link',
      icon: <ShareAndroidIcon />,
      onPress: () => {
        ShareUtils.shareFeeds(item, ANALYTICS_SHARE_POST_FEED_SCREEN, ANALYTICS_SHARE_POST_FEED_ID);
        if (shareLinkEventName) AnalyticsEventTracking.eventTrack(shareLinkEventName);
      }
    }
  ];

  if (isShowDelete) {
    dataSheet.push({
      id: 2,
      name: 'Delete post',
      icon: <TrashRed />,
      onPress: () => {
        refSheet.current.close();
        onDeletePost(item);
      },
      style: {color: COLORS.redalert}
    });
  }
  const {navigateToProfile, username, profile_pic_url, onBackNormalUser} = useFeedHeader({
    actor,
    source,
    navigateToProfileEventName
  });
  return (
    <SafeAreaView>
      <View testID="defaultHeader" style={[styles.rowCenter, styles.header(height, isPostDetail)]}>
        {isShortText && (
          <LinearGradient
            colors={['#184A57', '#184A57']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderTopLeftRadius: normalize(15),
              borderTopRightRadius: normalize(15)
            }}
          />
        )}
        {isBackButton ? (
          <View testID="haveBackButton" style={styles.btn}>
            <GlobalButton testID="onBack" onPress={() => onBackNormalUser(isFromFeeds)}>
              <IconChevronLeft fill={COLORS.white} />
            </GlobalButton>
          </View>
        ) : null}
        <GlobalButton onPress={navigateToProfile} style={[styles.containerFeedProfile]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <ProfilePicture
                karmaScore={karmaScore}
                profilePicPath={profile_pic_url ?? DEFAULT_PROFILE_PIC_PATH}
                size={25}
                width={4}
                withKarma
                onImageContainerClick={navigateToProfile}
              />
              <View style={{width: 6}} />
              <Text
                style={{
                  fontFamily: fonts.inter[600],
                  fontWeight: 'bold',
                  fontSize: 14,
                  lineHeight: 16.94,
                  color: COLORS.white
                }}>
                {username || StringConstant.feedDeletedUserName}
              </Text>
              <View
                style={[
                  styles.point(isShortText),
                  {backgroundColor: isShortText ? COLORS.gray310 : COLORS.gray410}
                ]}
              />
              <Text style={styles.feedDate(isShortText)}>
                {calculateTime(time).replace(' ago', '')}
              </Text>
              {duration_feed !== 'never' ? <View style={styles.point(isShortText)} /> : null}
              {duration_feed !== 'never'
                ? validationTimer(time, duration_feed, COLORS.gray410)
                : null}
              {disabledFollow
                ? null
                : !isSelf && (
                    <React.Fragment>
                      <View
                        style={[
                          styles.point(isShortText),
                          {backgroundColor: isShortText ? COLORS.gray310 : COLORS.gray410}
                        ]}
                      />
                      <TouchableOpacity onPress={() => onPressFollUnFoll(isFollow)}>
                        <Text
                          style={isFollow ? styles.textFollowing : styles.textFollow(isShortText)}>
                          {isFollow ? 'Following' : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  )}
            </View>

            <GlobalButton
              onPress={() => {
                refSheet.current.open();
                if (threeDotsEventName) AnalyticsEventTracking.eventTrack(threeDotsEventName);
              }}>
              {hideThreeDot ? null : (
                <View style={{zIndex: 1000}}>
                  <ElipsisIcon width={16} height={16} color={COLORS.gray410} />
                </View>
              )}
            </GlobalButton>
          </View>
        </GlobalButton>
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
  isPostDetail,
  isFollow = false,
  onPressFollUnFoll = () => {},
  onDeletePost = () => {},
  isShowDelete = false,
  isSelf = false,
  item,
  hideThreeDot,
  disabledFollow,
  isFromFeeds,
  isShortText,
  navigateToProfileEventName,
  threeDotsEventName,
  shareLinkEventName
}) => {
  const {
    anonimity,
    time,
    duration_feed,
    expired_at,
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
      duration_feed,
      expired_at,
      isBackButton,
      height,
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
      actor,
      source,
      disabledFollow,
      isFromFeeds,
      isShortText,
      threeDotsEventName,
      shareLinkEventName
    });
  }
  return _renderProfileNormal({
    item,
    actor,
    time,
    duration_feed,
    expired_at,
    isBackButton,
    height,
    source,
    hideThreeDot,
    isPostDetail,
    karmaScore: props?.karma_score,
    isFollow,
    onPressFollUnFoll,
    onDeletePost,
    isShowDelete,
    isSelf,
    disabledFollow,
    isFromFeeds,
    isShortText,
    navigateToProfileEventName,
    threeDotsEventName,
    shareLinkEventName
  });
};

const styles = StyleSheet.create({
  header: (height, isPostDetail) => ({
    backgroundColor: COLORS.almostBlack,
    height,
    paddingLeft: isPostDetail ? 10 : 20,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: normalize(16),
    borderTopRightRadius: normalize(16),
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.darkGray
  }),
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
  feedDate: (isShortText) => ({
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: isShortText ? COLORS.gray510 : COLORS.gray410,
    lineHeight: 18
  }),
  feedDateLocation: {
    flex: 1,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.gray410,
    lineHeight: 18
  },
  point: (isShortText) => ({
    width: 2,
    height: 2,
    borderRadius: 4,
    backgroundColor: isShortText ? COLORS.gray510 : COLORS.gray410,
    marginLeft: 8,
    marginRight: 8,
    alignSelf: 'center',
    marginTop: 0
  }),
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
    color: COLORS.gray410
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
    color: COLORS.gray410
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
  avatarImage: {height: 48, width: 48, borderRadius: 24},
  contentFeedName: {
    flexDirection: 'row'
  },
  textFollow: (isShortText) => ({
    color: isShortText ? COLORS.white : COLORS.bluePrimary,
    fontSize: normalizeFontSize(14),
    fontStyle: 'normal',
    fontWeight: '500'
  }),
  textFollowing: {
    color: COLORS.gray410,
    fontSize: normalizeFontSize(14),
    fontStyle: 'normal',
    fontWeight: '500'
  }
});

Header.propTypes = {
  props: PropsTypes.object,
  isBackButton: PropsTypes.bool,
  isShortText: PropsTypes.bool
};

export default React.memo(Header);
