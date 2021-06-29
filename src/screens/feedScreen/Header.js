import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Avatar} from 'react-native-activity-feed';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import PropsTypes from 'prop-types';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {calculateTime} from '../../utils/time';
import {getAccessToken} from '../../utils/token';

import AnonymousProfile from '../../assets/images/AnonymousProfile.png';
import Memoic_globe from '../../assets/icons/ic_globe';
import MemoSeventyFive_eightySeven from '../../assets/timer/SeventyFive_eightySeven';
import MemoPeopleFollow from '../../assets/icons/Ic_people_follow';
import MemoTwentyFive_thirtySix from '../../assets/timer/TwentyFive_thirtySix';
import MemoThirtySeven_fourtyNine from '../../assets/timer/ThirtySeven_fourtyNine';
import MemoFivety_sixtyTwo from '../../assets/timer/Fivety_sixtyTwo';
import MemoSixtyThree_seventyFour from '../../assets/timer/SixtyThree_seventyFour';
import MemoEightyEight_hundred from '../../assets/timer/EightyEight_hundred';
import MemoIc_arrow_back from '../../assets/arrow/Ic_arrow_back';
import MemoOne from '../../assets/timer/One';
import ElipsisIcon from '../../assets/icons/images/ellipsis-vertical.svg';

const {width: screenWidth} = Dimensions.get('window');

const getTime = (date) => calculateTime(date);

const validationTimer = (timer, duration_feed) => {
  let date1 = new Date(timer);
  let date2 = new Date();
  let totalFeed = 24 * duration_feed;
  var hours = Math.abs(date1 - date2) / 36e5;
  let total = (hours / totalFeed) * 100;
  switch (true) {
    case total < 25:
      return <MemoEightyEight_hundred height={17} width={17} />;
    case total < 38:
      return <MemoSeventyFive_eightySeven height={17} width={17} />;
    case total < 50:
      return <MemoSixtyThree_seventyFour height={17} width={17} />;
    case total < 63:
      return <MemoFivety_sixtyTwo height={17} width={17} />;
    case total < 75:
      return <MemoThirtySeven_fourtyNine height={17} width={17} />;
    case total < 88:
      return <MemoTwentyFive_thirtySix height={17} width={17} />;
    // return <MemoOne height={17} width={17} />;
    default:
      return <MemoOne height={17} width={17} />;
  }
};

const _renderAnonimity = ({
  time,
  privacy,
  duration_feed,
  expired_at,
  location,
  isBackButton,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.rowSpaceBeetwen}>
      <View style={styles.rowCenter}>
        {isBackButton ? (
          <View style={{marginEnd: 16}}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <MemoIc_arrow_back height={20} width={20} />
            </TouchableOpacity>
          </View>
        ) : null}
        <Image
          source={AnonymousProfile}
          width={48}
          height={48}
          style={styles.imageAnonimity}
        />
        <View style={styles.containerFeedProfile}>
          <Text style={styles.feedUsername}>Anonymous</Text>
          <View style={styles.containerFeedText}>
            <Text style={styles.feedDate}>{getTime(time)}</Text>
            <View style={styles.point} />
            {privacy === 'Public' ? (
              <Memoic_globe height={16} width={16} />
            ) : (
              <MemoPeopleFollow height={16} width={16} />
            )}

            {duration_feed !== 'never' ? <View style={styles.point} /> : null}
            {duration_feed !== 'never'
              ? validationTimer(expired_at, duration_feed)
              : null}
            <View style={styles.point} />
            <Text style={styles.feedDate}>{location}</Text>
          </View>
        </View>
      </View>
      <TouchableNativeFeedback>
        <ElipsisIcon width={18} height={3.94} fill={colors.black} />
      </TouchableNativeFeedback>
    </View>
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
}) => {
  const navigation = useNavigation();
  let userId = actor.id;
  let {profile_pic_path, username} = actor.data;

  let navigateToProfile = async () => {
    let selfAccessToken = await getAccessToken();
    let selfUserId = await jwtDecode(selfAccessToken).user_id;
    if (selfUserId === userId) return navigation.navigate('ProfileScreen');
    return navigation.navigate('OtherProfile', {
      data: {
        user_id: selfUserId,
        other_id: userId,
        username,
      },
    });
  };

  return (
    <View style={styles.rowSpaceBeetwen}>
      <View style={styles.rowCenter}>
        {isBackButton ? (
          <View style={styles.btn}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <MemoIc_arrow_back height={20} width={20} />
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableNativeFeedback
          onPress={() => navigateToProfile()}
          background={TouchableNativeFeedback.Ripple(colors.gray1, true, 28)}>
          <View style={{}}>
            <Avatar
              source={
                profile_pic_path
                  ? profile_pic_path
                  : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png'
              }
              size={48}
              noShadow
            />
          </View>
        </TouchableNativeFeedback>
        <View style={styles.containerFeedProfile}>
          <View style={styles.containerFeedName}>
            <TouchableNativeFeedback
              onPress={() => navigateToProfile()}
              background={TouchableNativeFeedback.Ripple(
                colors.gray1,
                false,
                30,
              )}>
              <Text style={styles.feedUsername}>
                {username ? username : 'no name specifics'}
              </Text>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple(
                colors.gray1,
                true,
                8,
              )}>
              <View style={{alignSelf: 'center', zIndex: 1000}}>
                <ElipsisIcon width={3.94} height={18} fill={colors.black} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.containerFeedText}>
            <Text style={styles.feedDate}>{getTime(time)}</Text>
            <View style={styles.point} />
            {privacy === 'Public' ? (
              <Memoic_globe height={16} width={16} />
            ) : (
              <MemoPeopleFollow height={16} width={16} />
            )}

            {duration_feed !== 'never' ? <View style={styles.point} /> : null}
            {duration_feed !== 'never'
              ? validationTimer(expired_at, duration_feed)
              : null}
            <View style={styles.point} />
            <Text style={styles.feedDateLocation} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Header = ({props, isBackButton = false}) => {
  let {anonimity, time, privacy, duration_feed, expired_at, location, actor} =
    props;
  if (anonimity) {
    return _renderAnonimity({
      time,
      privacy,
      duration_feed,
      expired_at,
      location,
      isBackButton,
    });
  } else {
    return _renderProfileNormal({
      actor,
      time,
      privacy,
      duration_feed,
      expired_at,
      location,
      isBackButton,
    });
  }
};

const styles = StyleSheet.create({
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: colors.gray1,
    borderBottomWidth: 0.4,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 28,
    marginLeft: -16,
    marginRight: -16,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerFeedProfile: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 13,
    flex: 1,
  },
  containerFeedName: {
    flexDirection: 'row',
    // backgroundColor : 'red',
    // paddingTop : 8
  },
  btn: {marginEnd: 16},
  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  containerFeedText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    width: '100%',
  },
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.blackgrey,
    lineHeight: 18,
  },
  feedDateLocation: {
    flex: 1,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.blackgrey,
    lineHeight: 18,
  },
  point: {
    width: 2,
    height: 2,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
    alignSelf: 'center',
    marginTop: 2,
  },
  contentFeed: {
    marginTop: 12,
    flexDirection: 'column',
  },
  textContentFeed: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    lineHeight: 24,
    color: colors.black,
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray,
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 24,
    color: colors.black,
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: 12,
    lineHeight: 24,
    color: colors.gray,
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
  imageAnonimity: {
    marginRight: 8,
    width: 48,
    height: 48,
  },
});

Header.propsTypes = {
  props: PropsTypes.object,
  isBackButton: PropsTypes.bool,
};

export default Header;
