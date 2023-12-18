import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import ArrowLeftIcon from '../../../assets/icons/images/arrow-left.svg';
import MemoFollowDomain from '../../../assets/icon/IconFollowDomain';
import MemoPeopleFollow from '../../../assets/icons/Ic_people_follow';
import {COLORS, SIZES} from '../../../utils/theme';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {FeedCredderRating} from '../../../components/CredderRating';
import {Gap} from '../../../components';
import {calculateTime} from '../../../utils/time';
import {fonts} from '../../../utils/fonts';

const DetailDomainScreenHeader = ({
  image,
  domain,
  time,
  onFollowDomainPressed,
  score = -1,
  follower = 0
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backNavigationContainer}
        onPress={() => {
          navigation.goBack();
        }}>
        <ArrowLeftIcon width={20} height={12} fill="#000" />
      </TouchableOpacity>
      <View style={styles.wrapperImage}>
        <Image
          source={{
            uri: image ?? DEFAULT_PROFILE_PIC_PATH
          }}
          style={[styles.image, StyleSheet.absoluteFillObject]}
        />
      </View>
      <Gap width={SIZES.base} />
      <View style={styles.headerDomainInfoContainer}>
        <Text style={styles.headerDomainName} numberOfLines={1}>
          {domain}
        </Text>
        <View style={styles.headerDomainDateContainer}>
          <Text style={styles.headerDomainDate} numberOfLines={1}>
            {/* {new Date(time).toLocaleDateString()} */}
            {calculateTime(time)}
          </Text>
          {/* <View style={styles.point} /> */}
          {/* <Memoic_globe height={13} width={13} /> */}
          <View style={styles.point} />
          <MemoPeopleFollow height={13} width={12} />
          <Gap style={{width: 4}} />
          <Text style={styles.followerNumber}>{follower}</Text>
          <View style={styles.point} />
          <FeedCredderRating score={score} iconSize={16} scoreSize={12} />
        </View>
        {/* <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={20} /> */}
      </View>
      {/* <CredderRating containerStyle={styles.credderRating} score={score}/> */}
      <View style={{justifyContent: 'center'}}>
        <TouchableOpacity onPress={onFollowDomainPressed}>
          <View style={styles.wrapperText}>
            <MemoFollowDomain />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  credderRating: {height: 28, marginRight: 10},
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 45
    // backgroundColor: 'white',
  },
  headerDomainInfoContainer: {flex: 1, marginRight: 8},
  headerDomainDateContainer: {flexDirection: 'row', alignItems: 'center', flexShrink: 1},
  wrapperText: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderColor: COLORS.blue,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5
  },
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerDomainName: {
    fontSize: 14,
    fontFamily: fonts.inter[600],
    color: COLORS.black
  },
  headerDomainDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.blackgrey,
    flexShrink: 1
  },
  point: {
    width: 2,
    height: 2,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginLeft: 5,
    marginRight: 5
  },
  headerContainer: {
    flexDirection: 'row',
    paddingRight: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray1,
    height: 64
  },
  backNavigationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingLeft: 22,
    paddingRight: 20
  },
  followerNumber: {
    color: COLORS.blackgrey,
    fontSize: 12,
    fontFamily: fonts.inter[700]
  }
});

export default DetailDomainScreenHeader;
