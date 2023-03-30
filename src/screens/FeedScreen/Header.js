import * as React from 'react';
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import PropsTypes from 'prop-types';
import {Dimensions, Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import AnonymousProfile from '../../assets/images/AnonymousProfile.png';
import ElipsisIcon from '../../assets/icon/ElipsisIcon';
import GlobalButton from '../../components/Button/GlobalButton';
import MemoEightyEight_hundred from '../../assets/timer/EightyEight_hundred';
import MemoFivety_sixtyTwo from '../../assets/timer/Fivety_sixtyTwo';
// import ElipsisIcon from '../../assets/icons/images/ellipsis-vertical.svg';
import MemoIc_arrow_back from '../../assets/arrow/Ic_arrow_back';
import MemoOne from '../../assets/timer/One';
import MemoPeopleFollow from '../../assets/icons/Ic_people_follow';
import MemoSeventyFive_eightySeven from '../../assets/timer/SeventyFive_eightySeven';
import MemoSixtyThree_seventyFour from '../../assets/timer/SixtyThree_seventyFour';
import MemoThirtySeven_fourtyNine from '../../assets/timer/ThirtySeven_fourtyNine';
import MemoTwentyFive_thirtySix from '../../assets/timer/TwentyFive_thirtySix';
import Memoic_globe from '../../assets/icons/ic_globe';
import useFeedHeader from './hooks/useFeedHeader';
import {PRIVACY_PUBLIC} from '../../utils/constants';
import {calculateTime} from '../../utils/time';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const {width: screenWidth} = Dimensions.get('window');

export const validationTimer = (timer, duration_feed) => {
  const date1 = new Date(timer);
  const date2 = new Date();
  const totalFeed = 24 * duration_feed;
  const hours = Math.abs(date1 - date2) / 36e5;
  const total = (hours / totalFeed) * 100;
  switch (true) {
    case total < 25:
      return (
        <View testID="25">
          <MemoEightyEight_hundred height={17} width={17} />
        </View>
      );
    case total < 38:
      return (
        <View testID="36">
          <MemoSeventyFive_eightySeven height={17} width={17} />
        </View>
      );
    case total < 50:
      return (
        <View testID="50">
          <MemoSixtyThree_seventyFour height={17} width={17} />
        </View>
      );
    case total < 63:
      return (
        <View testID="63">
          <MemoFivety_sixtyTwo height={17} width={17} />
        </View>
      );
    case total < 75:
      return (
        <View testID="75">
          <MemoThirtySeven_fourtyNine height={17} width={17} />
        </View>
      );
    case total < 88:
      return (
        <View testID="80">
          <MemoTwentyFive_thirtySix height={17} width={17} />
        </View>
      );
    default:
      return (
        <View testID="full">
          <MemoOne height={17} width={17} />
        </View>
      );
  }
};

const _renderAnonimity = ({
  time,
  privacy,
  duration_feed,
  expired_at,
  location,
  isBackButton,
  height,
  headerStyle,
  showAnonymousOption = false,
  onHeaderOptionClicked = () => {},
  hideThreeDot
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View
        testID="anonymHeader"
        style={[styles.rowSpaceBeetwen, styles.heightHeader(height), headerStyle]}>
        <View style={styles.rowCenter}>
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
            <Image
              source={AnonymousProfile}
              width={dimen.size.FEED_HEADER_IMAGE_RADIUS}
              height={dimen.size.FEED_HEADER_IMAGE_RADIUS}
              style={styles.imageAnonimity}
            />
          </View>

          <View style={[styles.containerFeedProfile]}>
            <View style={[styles.containerFeedName, {alignItems: 'center'}]}>
              <Text style={[styles.feedUsername]}>Anonymous</Text>
            </View>
            {showAnonymousOption && !hideThreeDot && (
              <GlobalButton
                buttonStyle={{position: 'absolute', right: 0, top: -8}}
                onPress={onHeaderOptionClicked}>
                <View style={{zIndex: 1000}}>
                  <ElipsisIcon width={4} height={14} fill={colors.blackgrey} />
                </View>
              </GlobalButton>
            )}
            <View style={styles.containerFeedText}>
              <Text style={styles.feedDate}>{calculateTime(time)}</Text>
              <View style={styles.point} />
              {privacy.toLowerCase() === PRIVACY_PUBLIC ? (
                <Memoic_globe height={16} width={16} />
              ) : (
                <MemoPeopleFollow height={16} width={16} />
              )}

              {duration_feed !== 'never' ? <View style={styles.point} /> : null}
              {duration_feed !== 'never' ? validationTimer(expired_at, duration_feed) : null}
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
  expired_at,
  location,
  isBackButton,
  height,
  source,
  headerStyle,
  onHeaderOptionClicked = () => {},
  hideThreeDot
}) => {
  const {navigateToProfile, username, profile_pic_url, onBackNormalUser} = useFeedHeader({
    actor,
    source
  });

  return (
    <SafeAreaView>
      <View
        testID="defaultHeader"
        style={[styles.rowSpaceBeetwen, styles.heightHeader(height), headerStyle]}>
        <View style={styles.rowCenter}>
          {isBackButton ? (
            <View testID="haveBackButton" style={styles.btn}>
              <GlobalButton testID="onBack" onPress={onBackNormalUser}>
                <MemoIc_arrow_back height={20} width={20} />
              </GlobalButton>
            </View>
          ) : null}
          <GlobalButton onPress={navigateToProfile}>
            <View style={{}}>
              <FastImage
                source={{
                  uri:
                    profile_pic_url ||
                    'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png'
                }}
                style={styles.avatarImage}
              />
            </View>
          </GlobalButton>
          <GlobalButton
            onPress={navigateToProfile}
            style={[styles.containerFeedProfile, {paddingBottom: 5}]}>
            <View style={[styles.containerFeedName, {alignItems: 'flex-end'}]}>
              <Text style={styles.feedUsername}>{username || 'no name specifics'}</Text>

              <GlobalButton
                buttonStyle={{marginLeft: 'auto', paddingBottom: 0, alignSelf: 'center'}}
                onPress={onHeaderOptionClicked}>
                {hideThreeDot ? null : (
                  <View style={{zIndex: 1000}}>
                    <ElipsisIcon width={4} height={14} fill={colors.blackgrey} />
                  </View>
                )}
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
              {duration_feed !== 'never' ? validationTimer(expired_at, duration_feed) : null}
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
  hideThreeDot
}) => {
  const {anonimity, time, privacy, duration_feed, expired_at, location, actor} = props;

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
      hideThreeDot
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
    hideThreeDot
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
    borderBottomColor: colors.gray1,
    borderBottomWidth: 0.4,
    paddingTop: 8,
    paddingBottom: 8
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
    color: colors.black,
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
    color: colors.blackgrey,
    lineHeight: 18
  },
  feedDateLocation: {
    flex: 1,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.blackgrey,
    lineHeight: 18
  },
  point: {
    width: 2,
    height: 2,
    borderRadius: 4,
    backgroundColor: colors.gray,
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
    color: colors.black
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 24,
    color: colors.black
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: 12,
    lineHeight: 24,
    color: colors.gray
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
  imageAnonimity: {
    marginRight: 0,
    width: dimen.size.FEED_HEADER_IMAGE_RADIUS,
    height: dimen.size.FEED_HEADER_IMAGE_RADIUS
  },
  noPaddingLeft: {
    paddingLeft: 0
  },
  imageAnonymContainer: {
    // paddingRight: 10,
    padding: 10
    // paddingLeft: 24
  },
  avatarImage: {height: 48, width: 48, borderRadius: 24}
});

Header.propsTypes = {
  props: PropsTypes.object,
  isBackButton: PropsTypes.bool
};

export default React.memo(Header);
