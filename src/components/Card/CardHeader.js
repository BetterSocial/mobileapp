import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {StyleSheet, Text, View} from 'react-native';

import Gap from '../Gap';
import MemoDomainProfilePicture from '../../assets/icon/DomainProfilePictureEmptyState';
import TestIdConstant from '../../utils/testId';
import Image, {imageConst} from '../Image';
import {COLORS} from '../../utils/theme';
import {FeedCredderRating} from '../CredderRating';
import {calculateTime} from '../../utils/time';
import {fonts} from '../../utils/fonts';

const Header = ({domain, date, score, image = null}) => {
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
          <View style={styles.point} />
          {/* <Text style={styles.cardHeaderDate} numberOfLines={1}>{date}</Text> */}
          <Text style={styles.cardHeaderDate} numberOfLines={1}>
            {calculateTime(moment(date))}
          </Text>
          <View style={styles.point} />
          <FeedCredderRating
            containerStyle={styles.credderRating}
            score={score}
            iconSize={16}
            scoreSize={12}
          />
        </View>
      </View>
    </View>
  );
};

Header.propTypes = {
  domain: PropTypes.string,
  date: PropTypes.string,
  score: PropTypes.number,
  image: PropTypes.string
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
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
    color: COLORS.gray410,
    fontFamily: fonts.inter[400]
  },
  credderRating: {
    height: 16,
    alignSelf: 'center'
  }
});

export default Header;
