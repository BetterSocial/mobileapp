import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {Image, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import ActionButtonGroup from './elements/ActionButtonGroup';
import CredderInfoGroup from './elements/CredderInfoGroup';
import DomainFollowerNumber from './elements/DomainFollowerNumber';
import MemoDomainProfilePicture from '../../../../assets/icon/DomainProfilePictureEmptyState';
import MemoIc_interface from '../../../../assets/icons/Ic_interface';
import StringConstant from '../../../../utils/string/StringConstant';
import {COLORS, SIZES} from '../../../../utils/theme';
import {Gap, SingleSidedShadowBox} from '../../../../components';
import {fonts, normalize, normalizeFontSize} from '../../../../utils/fonts';

const Header = ({
  image,
  domain,
  description,
  followers,
  onPressBlock,
  onPressUnblock,
  handleFollow,
  handleUnfollow,
  follow = false,
  isBlocked,
  item
}) => {
  const openDomainLink = async () => {
    const isURL = await Linking.canOpenURL(`https://${domain}`);
    if (isURL) {
      Linking.openURL(`https://${domain}`);
    } else {
      SimpleToast.show(StringConstant.domainCannotOpenURL, SimpleToast.SHORT);
    }
  };

  return (
    <View style={styles.headerDomain}>
      <View style={styles.row}>
        <View style={styles.wrapperImage}>
          {image ? (
            <>
              <View style={styles.circleImageWrapper} />
              <Image
                source={{uri: image}}
                style={[styles.circleImage, StyleSheet.absoluteFillObject]}
              />
            </>
          ) : (
            <MemoDomainProfilePicture height={normalize(100)} width={normalize(100)} />
          )}
        </View>
        <View style={styles.wrapperHeader}>
          <View style={{...styles.row, ...styles.domainNameContainer}}>
            <Text style={styles.domainName} ellipsizeMode="tail" numberOfLines={1}>
              {domain}
            </Text>
            <View style={{alignSelf: 'center'}}>
              <TouchableOpacity style={styles.openInBrowserIcon} onPress={openDomainLink}>
                <MemoIc_interface width={17} height={17} fill={COLORS.signed_primary} />
              </TouchableOpacity>
            </View>
          </View>
          <DomainFollowerNumber followers={followers} />
          <CredderInfoGroup score={item.domain.credderScore} />
        </View>
      </View>
      <Gap height={normalize(14)} />
      <Text style={styles.domainDescription}>
        {description}
        {/* Lorem Ipsum Dolor sit amet, consectetur adipiscing elit. Praesent placerat erat tellus, non consequat mi sollicitudin quis. */}
      </Text>
      <Gap height={normalize(10)} />
      <ActionButtonGroup
        follow={follow}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        isBlocked={isBlocked}
        onPressBlock={onPressBlock}
        onPressUnblock={onPressUnblock}
      />
      <Gap height={normalize(12)} />
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {flexDirection: 'row', alignItems: 'center'},
  desc: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    lineHeight: normalizeFontSize(16)
  },
  containerFollowers: {flexDirection: 'row'},
  followers: {
    color: COLORS.signed_primary,
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(16),
    fontWeight: '700'
  },
  wrapperDomain: {flexDirection: 'row', marginTop: 8},
  iconDomain: {marginStart: 8, justifyContent: 'center'},
  domainNameContainer: {
    width: '100%'
  },
  domain: {
    fontSize: normalizeFontSize(24),
    fontFamily: fonts.inter[600],
    fontWeight: 'bold'
  },
  actionText: (color) => ({
    fontSize: normalizeFontSize(14),
    color
  }),
  headerDomain: {
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    borderTopColor: COLORS.transparent,
    // shadowColor: COLORS.black,
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.8,
    // shadowRadius: 1,
    paddingTop: 15
  },
  container: {
    flexDirection: 'row'
  },
  wrapperHeader: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 28
  },
  width: (wid) => ({
    width: wid
  }),
  height: (height) => ({
    height
  }),
  wrapperImage: {
    borderRadius: normalize(50),
    borderColor: COLORS.black50,
    width: normalize(100),
    height: normalize(100),
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row'
  },
  followButtonText: {
    fontSize: normalizeFontSize(14),
    color: COLORS.white,
    paddingHorizontal: 25
  },
  domainName: {
    fontSize: RFValue(20),
    fontFamily: fonts.inter[700],
    lineHeight: RFValue(24.2),
    color: COLORS.black,
    // flex: 1,
    flexShrink: 1
  },
  domainDescription: {
    fontFamily: fonts.inter[400],
    lineHeight: normalizeFontSize(17),
    fontSize: normalizeFontSize(14),
    color: COLORS.white2
  },
  shadowBox: {
    paddingBottom: 8
  },
  arrow: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: COLORS.white,
    top: 23,
    zIndex: 10000000,
    left: 10,
    transform: [{rotate: '45deg'}],
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  openInBrowserIcon: {
    padding: normalize(4),
    // paddingHorizontal: normalize(12),
    // marginLeft: 5.67,
    marginLeft: 3.67,
    top: 0,
    color: COLORS.bondi_blue
  },
  circleImage: {
    height: normalize(100),
    width: normalize(100),
    alignSelf: 'center',
    borderRadius: normalize(100),
    resizeMode: 'cover',
    zIndex: -10000
  },
  circleImageWrapper: {
    height: normalize(100),
    width: normalize(100),
    borderRadius: normalize(50),
    borderWidth: 0.2,
    borderColor: COLORS.black50
  }
});

export default Header;
