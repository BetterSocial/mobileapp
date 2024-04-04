import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../utils/theme';
import {fonts, normalizeFontSize} from '../utils/fonts';
import dimen from '../utils/dimen';

export const toastConfig = {
  center: ({text1, text2}) => (
    <View style={styles.container}>
      <Text style={styles.centerText}>{text1}</Text>
      <Text style={styles.centerText}>{text2}</Text>
    </View>
  ),
  asNative: ({text1, props}) => (
    <View style={styleAsNative.container}>
      <Text style={styleAsNative.text}>{text1}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black75,
    alignItems: 'center',
    justifyContent: 'center',
    padding: dimen.normalizeDimen(10),
    borderRadius: dimen.normalizeDimen(10)
  },
  centerText: {
    textAlign: 'center'
  }
});

const styleAsNative = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black75,
    borderRadius: dimen.normalizeDimen(45),
    paddingHorizontal: dimen.normalizeDimen(30),
    paddingVertical: dimen.normalizeDimen(5),
    width: dimen.normalizeDimen(295),
    minHeight: dimen.normalizeDimen(42),
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: COLORS.white2,
    textAlign: 'center',
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(18)
  }
});
