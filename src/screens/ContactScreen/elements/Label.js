import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../../utils/theme';

const Label = ({
  label,
  containerBgColor = COLORS.gray100,
  titleHeaderColor = COLORS.almostBlackSmoke,
  textColor = COLORS.white
}) => (
  <View style={styles.headerList(containerBgColor)}>
    <Text style={styles.titleHeader(titleHeaderColor)}>
      <Text style={styles.textBold(textColor)}>{label}</Text>
    </Text>
  </View>
);

export default Label;

const styles = StyleSheet.create({
  headerList: (containerBgColor) => ({
    height: 40,
    paddingLeft: 22,
    paddingRight: 22,
    backgroundColor: containerBgColor,
    flexDirection: 'column',
    justifyContent: 'center'
  }),
  titleHeader: (titleHeaderColor) => ({
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 18,
    color: titleHeaderColor
  }),
  textBold: (textColor) => ({
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 18,
    color: textColor,
    textTransform: 'capitalize'
  })
});
