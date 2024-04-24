import * as React from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {StyleSheet, Text, View} from 'react-native';

import CredderRatingGray from '../../assets/icon/CredderRatingGray';
import CredderRatingGreen from '../../assets/icon/CredderRatingGreen';
import CredderRatingRed from '../../assets/icon/CredderRatingRed';
import CredderRatingYellow from '../../assets/icon/CredderRatingYellow';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

const FeedCredderRating = ({
  containerStyle = {},
  iconSize = 14,
  scoreSize = 16,
  score,
  viewBox = '0 0 18 18',
  scoreStyle = {}
}) => {
  const renderCredderRatingIcon = () => {
    if (!score || score < 0)
      return (
        <CredderRatingGray
          style={styles.credderIcon}
          height={iconSize}
          width={iconSize}
          viewBox={viewBox}
        />
      );
    if (score <= 35)
      return (
        <CredderRatingRed
          style={styles.credderIcon}
          height={iconSize}
          width={iconSize}
          viewBox={viewBox}
        />
      );
    if (score > 35 && score <= 65)
      return (
        <CredderRatingYellow
          style={styles.credderIcon}
          height={iconSize}
          width={iconSize}
          viewBox={viewBox}
        />
      );

    return (
      <CredderRatingGreen
        style={styles.credderIcon}
        height={iconSize}
        width={iconSize}
        viewBox={viewBox}
      />
    );
  };

  const renderCredderRatingScore = () => {
    if (!score || score < 0) return 'n/a';
    const parsedScore = Math.round(parseInt(score, 10));
    return (
      <Text>
        {`${parsedScore}`}
        <Text style={{fontSize: scoreSize - 3}}>%</Text>
      </Text>
    );
  };

  return (
    <View style={{...styles.credderRatingContainer, ...containerStyle}}>
      {renderCredderRatingIcon()}
      <Text style={{...styles.credderRating(scoreSize, score), ...scoreStyle}}>
        {renderCredderRatingScore()}
      </Text>
    </View>
  );
};

export default FeedCredderRating;

const styles = StyleSheet.create({
  credderIcon: {
    alignSelf: 'center'
  },
  credderRating: (fontSize, score) => {
    return {
      fontSize,
      fontFamily: fonts.inter[400],
      color: COLORS.gray410,
      alignSelf: 'center',
      marginLeft: 4,
      lineHeight: 14.52
      // marginTop: (!score || score < 0) ? 0 : 0,
      // backgroundColor: 'red',
    };
  },
  credderRatingContainer: {
    flexDirection: 'row',
    // flex: 1,
    borderRadius: 8
  }
});
