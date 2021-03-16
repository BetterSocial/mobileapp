import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
const SplashScreen = () => {
  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/ping-icon.png')} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
