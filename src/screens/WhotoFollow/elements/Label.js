import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

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
    backgroundColor: '#F2F2F2',
    flexDirection: 'column',
    justifyContent: 'center',
    // marginBottom: 12,
    // marginTop: 12,
  },
  titleHeader: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 18,
    color: '#4F4F4F',
  },
  textBold: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 18,
    color: '#4F4F4F',
  },
});
