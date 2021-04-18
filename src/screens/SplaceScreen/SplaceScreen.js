import {useNavigation} from '@react-navigation/core';
import {StackActions} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {
  getToken,
  getUserId,
  removeLocalStorege,
} from '../../data/local/accessToken';
import {verifyTokenGetstream, verifyUser} from '../../service/users';
const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    verify();
    analytics().logScreenView({
      screen_class: 'SplashScreen',
      screen_name: 'SplashScreen',
    });
  }, []);
  const verify = async () => {
    const token = await getToken();
    console.log('ini token ', token);
    if (token) {
      const verifyToken = await verifyTokenGetstream();
      if (verifyToken) {
        navigation.dispatch(StackActions.replace('HomeTabs'));
      } else {
        navigation.dispatch(StackActions.replace('SignIn'));
      }
    } else {
      navigation.dispatch(StackActions.replace('SignIn'));
    }
  };

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
