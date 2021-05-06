import React from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import {Avatar} from 'react-native-activity-feed';
import moment from 'moment';
import ElipsisIcon from '../../assets/icons/images/elipsis.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

import AnonymousProfile from '../../assets/images/AnonymousProfile.png';

import Memoic_globe from '../../assets/icons/ic_globe';
import MemoSeventyFive_eightySeven from '../../assets/timer/SeventyFive_eightySeven';
import MemoPeopleFollow from '../../assets/icons/Ic_people_follow';
import MemoZero_twentyFour from '../../assets/timer/Zero_twentyFour';
import MemoTwentyFive_thirtySix from '../../assets/timer/TwentyFive_thirtySix';
import MemoThirtySeven_fourtyNine from '../../assets/timer/ThirtySeven_fourtyNine';
import MemoFivety_sixtyTwo from '../../assets/timer/Fivety_sixtyTwo';
import MemoSixtyThree_seventyFour from '../../assets/timer/SixtyThree_seventyFour';
import MemoEightyEight_hundred from '../../assets/timer/EightyEight_hundred';

const {width: screenWidth} = Dimensions.get('window');

const getTime = (time) => {
  let date = new Date(time);
  return date.toLocaleDateString();
};

const validationTimer = (timer, duration_feed) => {
  let date1 = new Date(timer);
  let date2 = new Date();
  let totalFeed = 24 * duration_feed;
  var hours = Math.abs(date1 - date2) / 36e5;
  let total = (hours / totalFeed) * 100;
  switch (true) {
    case total < 25:
      return <MemoZero_twentyFour height={17} width={17} />;
    case total < 38:
      return <MemoTwentyFive_thirtySix height={17} width={17} />;
    case total < 50:
      return <MemoThirtySeven_fourtyNine height={17} width={17} />;
    case total < 63:
      return <MemoFivety_sixtyTwo height={17} width={17} />;
    case total < 75:
      return <MemoSixtyThree_seventyFour height={17} width={17} />;
    case total < 88:
      return <MemoSeventyFive_eightySeven height={17} width={17} />;
    default:
      return <MemoEightyEight_hundred height={17} width={17} />;
  }
};

const _renderAnonimity = (time) => (
  <View style={styles.rowSpaceBeetwen}>
    <View style={styles.rowCenter}>
      <Image
        source={AnonymousProfile}
        width={32}
        height={32}
        style={styles.imageAnonimity}
      />
      <View style={styles.containerFeedProfile}>
        <Text style={styles.feedUsername}>Anonymous</Text>
        <View style={styles.containerFeedText}>
          <Text style={styles.feedDate}>{getTime(time)}</Text>
          <View style={styles.point} />
          <Text style={styles.feedDate}>
            {moment.utc(time).local().fromNow()}
          </Text>
        </View>
      </View>
    </View>
    <TouchableNativeFeedback>
      <ElipsisIcon width={18} height={3.94} fill={colors.black} />
    </TouchableNativeFeedback>
  </View>
);

const _renderProfileNormal = (
  real_name,
  profile_pic_path,
  time,
  privacy,
  duration_feed,
  expired_at,
  location,
) => {
  return (
    <View style={styles.rowSpaceBeetwen}>
      <View style={styles.rowCenter}>
        <Avatar
          source={
            profile_pic_path
              ? profile_pic_path
              : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png'
          }
          size={48}
          noShadow
        />
        <View style={styles.containerFeedProfile}>
          <Text style={styles.feedUsername}>
            {real_name ? real_name : 'no name specifics'}
          </Text>
          <View style={styles.containerFeedText}>
            <Text style={styles.feedDate}>
              {moment.utc(time).local().fromNow()}
            </Text>
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
const Header = ({props}) => {
  let {
    anonimity,
    time,
    privacy,
    duration_feed,
    expired_at,
    location,
    actor,
  } = props;
  if (anonimity) {
    return _renderAnonimity(time);
  } else {
    return _renderProfileNormal(
      actor.data.username,
      actor.data.profile_pic_url,
      time,
      privacy,
      duration_feed,
      expired_at,
      location,
    );
  }
};

const styles = StyleSheet.create({
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerFeedProfile: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 13,
  },

  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  containerFeedText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.black,
    lineHeight: 18,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
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
    width: 32,
    height: 32,
  },
});

export default Header;
