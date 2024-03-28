import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../../utils/theme';
import dimen from '../../../utils/dimen';
import {normalizeFontSize} from '../../../utils/fonts';

const Label = ({label, isOriginalText}) => (
  <View style={styles.headerList}>
    {isOriginalText ? (
      <Text style={styles.titleHeader}>{label}</Text>
    ) : (
      <Text style={styles.titleHeader}>
        People in <Text style={styles.textBold}>{label}</Text> follow...
      </Text>
    )}
  </View>
);

export default Label;

const styles = StyleSheet.create({
  headerList: {
    height: dimen.normalizeDimen(40),
    paddingLeft: dimen.normalizeDimen(22),
    paddingRight: dimen.normalizeDimen(22),
    backgroundColor: COLORS.gray100,
    flexDirection: 'column',
    justifyContent: 'center'
    // marginBottom: 12,
    // marginTop: 12,
  },
  titleHeader: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(18),
    color: COLORS.gray500
  },
  textBold: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(18),
    color: COLORS.black000
  }
});
