import {useNavigation} from '@react-navigation/core';
import {StackActions} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {getToken} from '../../data/local/accessToken';
import {verifyUser} from '../../service/users';
const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    verify();
  }, []);
  const verify = async () => {
    const token = await getToken();
    verifyUser();
    setTimeout(() => {
      // console.log(token);
      // if (token) {
      // } else {
      // }
      navigation.dispatch(StackActions.replace('SignIn'));
    }, 3000);
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
