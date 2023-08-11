import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    borderColor: '#f2f2f2',
    borderWidth: 1
  },
  centerText: {
    textAlign: 'center'
  }
});

const styleAsNative = StyleSheet.create({
  container: {
    backgroundColor: '#4D4D4D',
    borderRadius: 45,
    paddingHorizontal: 30,
    paddingVertical: 5,
    width: 295,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18
  }
});
