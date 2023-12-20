import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import AnonymousIcon from '../../../assets/icon/AnonymousIcon';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

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
    fontFamily: isActive ? fonts.inter[600] : fonts.inter[400],
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    color: isActive ? COLORS.bondi_blue : COLORS.blackgrey
  }),
  anonymousPostTextSubtitle: (isActive) => ({
    fontFamily: isActive ? fonts.inter[600] : fonts.inter[400],
    fontSize: 10,
    textAlign: 'center',
    color: isActive ? COLORS.holyTosca : COLORS.blackgrey
  })
});

const AnonymousTab = ({isActive = false}) => {
  return (
    <View style={styles.anonymousContainer}>
      <AnonymousIcon fill={isActive ? COLORS.holyTosca : COLORS.blackgrey} width={17} height={17} />
      <View style={styles.anonymousTextContainer}>
        <Text style={styles.anonymousPostTextTitle(isActive)}>Anonymous Posts</Text>
        <Text style={styles.anonymousPostTextSubtitle(isActive)}>Only visible to you</Text>
      </View>
    </View>
  );
};

export default AnonymousTab;
