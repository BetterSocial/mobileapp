import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ArrowLeftIcon from '../../../assets/icons/images/arrow-left.svg';
import MemoFollowDomain from '../../../assets/icon/IconFollowDomain';
import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import MemoIc_rectangle_gradient from '../../../assets/Ic_rectangle_gradient';
import MemoPeopleFollow from '../../../assets/icons/Ic_people_follow';
import Memoic_globe from '../../../assets/icons/ic_globe';
import { COLORS, SIZES } from '../../../utils/theme';
import {CredderRating} from '../../../components/CredderRating';
import { Gap } from '../../../components';
import { fonts } from '../../../utils/fonts';

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
            uri: image
              ? image
              : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
          }}
          style={[styles.image, StyleSheet.absoluteFillObject]}
        />
      </View>
      <Gap width={SIZES.base} />
      <View style={styles.headerDomainInfoContainer}>
        <Text style={styles.headerDomainName} numberOfLines={1}>{domain}</Text>
        <View style={styles.headerDomainDateContainer}>
          <Text style={styles.headerDomainDate} numberOfLines={1}>
            {new Date(time).toLocaleDateString()}
          </Text>
          <View style={styles.point} />
          <Memoic_globe height={13} width={13} />
          <View style={styles.point} />

          <MemoPeopleFollow height={13} width={12} />
          <Gap style={{ width: 4 }} />
          <Text style={styles.followerNumber}>{follower}</Text>
        </View>
        {/* <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={20} /> */}
      </View>
      <CredderRating containerStyle={styles.credderRating} score={score}/>
      <View style={{ justifyContent: 'center' }}>
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
  credderRating: { height: 28, marginRight: 10 },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 45,
    // backgroundColor: 'white',
  },
  headerDomainInfoContainer: { flex: 1, marginRight: 8, },
  headerDomainDateContainer: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  wrapperText: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#00ADB5',
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDomainName: {
    fontSize: 14,
    fontFamily: fonts.inter[600],
    color: '#000000',
  },
  headerDomainDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: '#828282',
    flexShrink: 1,
  },
  point: {
    width: 3,
    height: 3,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingRight: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray1,
    height: 64,
  },
  backNavigationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingLeft: 22,
    paddingRight: 20,
  },
  followerNumber: {
    color: '#828282',
    fontSize: 12,
    fontFamily: fonts.inter[700],
  },
});

export default DetailDomainScreenHeader;
