import * as React from 'react';
import {Image, StyleSheet} from 'react-native';

function AppIcon() {
  return (
    <Image
      source={require('./../assets/better-icon.png')}
      style={styles.logo}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
  },
});

export default AppIcon;
