import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import CredderRatingGray from '../../assets/icon/CredderRatingGray';
import CredderRatingGreen from '../../assets/icon/CredderRatingGreen';
import CredderRatingRed from '../../assets/icon/CredderRatingRed';
import CredderRatingYellow from '../../assets/icon/CredderRatingYellow';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

const CredderRating = ({containerStyle = {}, score}) => {
  const renderCredderRatingIcon = () => {
    if ((!score && score !== 0) || score < 0)
      return (
        <View testID="credder-rating-grey" style={{alignSelf: 'center'}}>
          <CredderRatingGray />
        </View>
      );
    if (score <= 35)
      return (
        <View testID="credder-rating-red" style={{alignSelf: 'center'}}>
          <CredderRatingRed testID="credder-rating-red" />
        </View>
      );
    if (score > 35 && score <= 65)
      return (
        <View testID="credder-rating-yellow" style={{alignSelf: 'center'}}>
          <CredderRatingYellow testID="credder-rating-yellow" />
        </View>
      );

    return (
      <View testID="credder-rating-green" style={{alignSelf: 'center'}}>
        <CredderRatingGreen testID="credder-rating-green" />
      </View>
    );
  };

  const renderCredderRatingScore = () => {
    if ((!score && score !== 0) || score < 0) return 'n/a';
    return `${score}%`;
  };

  return (
    <View style={{...styles.credderRatingContainer, ...containerStyle}}>
      {renderCredderRatingIcon()}
      <Text testID="credder-score" style={styles.credderRating}>
        {renderCredderRatingScore()}
      </Text>
    </View>
  );
};

export default CredderRating;

const styles = StyleSheet.create({
  credderRating: {
    fontSize: 16,
    fontFamily: fonts.inter[600],
    color: COLORS.white,
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1
  },
  credderRatingContainer: {
    paddingLeft: 4,
    paddingRight: 4,
    flexDirection: 'row',
    width: 69,
    backgroundColor: COLORS.black43,
    borderRadius: 8
  }
});
