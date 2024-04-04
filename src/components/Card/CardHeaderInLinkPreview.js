import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Gap from '../Gap';
import MemoDomainProfilePicture from '../../assets/icon/DomainProfilePictureEmptyState';
import TestIdConstant from '../../utils/testId';
import Image, {imageConst} from '../Image';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

const Header = ({domain, image = null}) => {
  const renderHeaderImage = () => {
    if (image)
      return (
        <Image
          testID={TestIdConstant.iconDomainProfilePicture}
          style={[{height: '100%', width: '100%', borderRadius: 45}, StyleSheet.absoluteFillObject]}
          source={{uri: image}}
          resizeMode={imageConst.resizeMode.cover}
        />
      );

    return (
      <View
        testID={TestIdConstant.iconDomainProfilePictureEmptyState}
        style={{width: 24, height: 24}}>
        <MemoDomainProfilePicture height={'100%'} width={'100%'} />
      </View>
    );
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerImageContainer}>{renderHeaderImage()}</View>
      <Gap style={{width: 0}} />
      <View style={styles.headerDomainDateContainer}>
        <View style={styles.headerDomainDateRowContainer}>
          <Text style={styles.cardHeaderDomainName} numberOfLines={1}>
            {domain}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    // paddingTop: 12,
    paddingVertical: 8.5,
    paddingLeft: 20,
    paddingRight: 20
  },
  headerImageContainer: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: COLORS.black50,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerDomainDateContainer: {
    justifyContent: 'space-around',
    marginLeft: 8,
    flex: 1,
    alignSelf: 'center'
    // backgroundColor: 'red',
  },
  headerDomainDateRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8
  },
  point: {
    width: 3,
    height: 3,
    borderRadius: 4,
    marginTop: 1,
    backgroundColor: COLORS.balance_gray,
    marginLeft: 6,
    marginRight: 6
  },
  cardHeaderDomainName: {
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.black,
    fontWeight: 'bold',
    fontFamily: fonts.inter[600],
    flexShrink: 1
    // marginLeft: 8,
  },
  cardHeaderDate: {
    fontSize: 12,
    color: COLORS.gray400,
    fontFamily: fonts.inter[400]
    // lineHeight: 12.1,
  },
  credderRating: {
    // height: 24,
    height: 16,
    alignSelf: 'center'
  }
});

export default Header;
