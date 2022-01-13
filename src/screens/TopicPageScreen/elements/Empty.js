import React from 'react';
import {
  View, Text, Image, StyleSheet, Platform, Dimensions,
} from 'react-native';

const Empty = () => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      source={require('../../../assets/ic_empty.png')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('screen').height * 0.7
  },
  image: {
    width: 300,
    height: 300,
  },
});

export default Empty;
