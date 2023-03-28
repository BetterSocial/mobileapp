import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import AnonymousIcon from '../../../assets/icon/AnonymousIcon';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const styles = StyleSheet.create({
  anonymousIcon: {
    width: 17,
    height: 17
  },
  anonymousTextContainer: {
    marginStart: 6
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  anonymousPostTextTitle: (isActive) => ({
    fontFamily: fonts.inter[400],
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    color: isActive ? colors.bondi_blue : colors.blackgrey
  }),
  anonymousPostTextSubtitle: (isActive) => ({
    fontFamily: fonts.inter[400],
    fontSize: 10,
    textAlign: 'center',
    color: isActive ? colors.bondi_blue : colors.blackgrey
  })
});

const AnonymousTab = ({isActive = false}) => {
  return (
    <View style={styles.anonymousContainer}>
      <AnonymousIcon
        fill={isActive ? colors.bondi_blue : colors.blackgrey}
        width={17}
        height={17}
      />
      {/* <Image source={AnonymousImage} style={styles.anonymousIcon} /> */}
      <View style={styles.anonymousTextContainer}>
        <Text style={styles.anonymousPostTextTitle(isActive)}>Anonymous Posts</Text>
        <Text style={styles.anonymousPostTextSubtitle(isActive)}>Only visible to you</Text>
      </View>
    </View>
  );
};

export default AnonymousTab;
