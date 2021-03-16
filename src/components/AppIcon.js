import React from 'react';
import {Image, StyleSheet} from 'react-native';

function AppIcon() {
  return (
    <Image
      source={require('./../assets/ping.png')}
      style={styles.logo}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 41,
    height: 52,
  },
});

export default AppIcon;
