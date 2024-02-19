import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../../utils/theme';

const Label = ({label}) => (
  <View style={styles.headerList}>
    <Text style={styles.titleHeader}>
      People in <Text style={styles.textBold}>{label}</Text> follow...
    </Text>
  </View>
);

export default Label;

const styles = StyleSheet.create({
  headerList: {
    height: 40,
    paddingLeft: 22,
    paddingRight: 22,
    backgroundColor: COLORS.concrete,
    flexDirection: 'column',
    justifyContent: 'center'
    // marginBottom: 12,
    // marginTop: 12,
  },
  titleHeader: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.emperor
  },
  textBold: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.emperor
  }
});
