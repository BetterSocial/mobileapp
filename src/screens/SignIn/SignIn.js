import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SlideShow from '../../components/SignIn/SlideShow';
import {
  logIn,
  onSuccess,
  onCancel,
  onError,
} from '@human-id/react-native-humanid';
import {setToken} from '../../data/local/accessToken';
import {fonts} from '../../utils/fonts';

const SignIn = () => {
  React.useEffect(() => {
    onSuccess((exchangeToken) => {
      setToken(exchangeToken);
      console.log('exchangeToken', exchangeToken);
    });
    onError((message) => {
      console.log('error message', message);
    });
    onCancel(() => {
      console.log('canceled');
    });
  }, []);
  const handleLogin = () => {
    logIn();
  };
  return (
    <View style={S.container}>
      <View style={S.containerSlideShow}>
        <SlideShow />
      </View>
      <View style={S.containerBtnLogin}>
        <TouchableOpacity style={S.btn} onPress={() => handleLogin()}>
          <Image source={require('../../assets/HumanID.png')} style={S.image} />
          <Text style={S.btnText}>
            Anonymous Login with <Text style={S.humen}>human</Text>ID
          </Text>
        </TouchableOpacity>
        <Text style={S.desc}>
          <Text style={S.humanID}>humanID</Text> is an independent non profit
          guaranteeing you privacy. Ping will receive absolutely zero personal
          information
        </Text>
      </View>
    </View>
  );
};

export default SignIn;

const S = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    marginRight: 7,
  },
  containerSlideShow: {
    height: '70%',
  },
  containerBtnLogin: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
  },
  btn: {
    backgroundColor: '#023B60',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 23,
    flexDirection: 'row',
    alignItems: 'center',
  },
  desc: {
    fontWeight: '500',
    fontFamily: fonts.inter[500],
    fontSize: 12,
    width: 250,
    textAlign: 'center',
    color: '#b0b0b0',
  },
  humanID: {
    color: '#11243D',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  btnText: {fontSize: 17, color: '#fff', fontWeight: 'bold'},
  humen: {fontSize: 17, color: '#fff', fontWeight: '100'},
});
