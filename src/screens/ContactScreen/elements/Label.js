import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Label = ({
  label,
  containerBgColor = '#F2F2F2',
  titleHeaderColor = '#F4F4F4',
  textColor = '#4F4F4F'
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
