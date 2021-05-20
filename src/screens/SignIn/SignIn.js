import React, {useContext, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SlideShow from '../../components/SignIn/SlideShow';
import {
  logIn,
  onSuccess,
  onCancel,
  onError,
} from '@human-id/react-native-humanid';
import {
  removeLocalStorege,
  setToken,
  setUserId,
  setRefreshToken,
  setAccessToken,
} from '../../data/local/accessToken';
import {fonts} from '../../utils/fonts';
import {checkToken} from '../../service/outh';
import {verifyUser} from '../../service/users';
import {useNavigation} from '@react-navigation/core';
import {StackActions} from '@react-navigation/native';
import {setDataHumenId} from '../../context/actions/users';
import {Context} from '../../context';
import BtnHumanID from '../../assets/images/humanid.png';
import ButtonSign from '../../assets/icon-svg/button_sign.svg';
import {colors} from 'react-native-swiper-flatlist/src/themes';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import Loading from '../Loading';

const SignIn = () => {
  const navigation = useNavigation();
  const [, dispatch] = useContext(Context).users;
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'SignIn',
      screen_name: 'SignIn',
    });
  });
  React.useEffect(() => {
    onSuccess(async (exchangeToken) => {
      // await setToken(exchangeToken);
      setLoading(true);
      checkToken(exchangeToken).then((res) => {
        if (res.data) {
          let {appUserId, countryCode} = res.data;
          setDataHumenId(res.data, dispatch);
          verifyUser(appUserId)
            .then((response) => {
              setLoading(false);
              if (response.data) {
                setAccessToken(response.token);
                setRefreshToken(response.refresh_token);
                navigation.dispatch(StackActions.replace('HomeTabs'));
              } else {
                removeLocalStorege('userId');
                navigation.dispatch(StackActions.replace('ChooseUsername'));
              }
              setUserId(appUserId);
            })
            .catch((e) => {
              setLoading(false);
            });
        }
      });
    });
    onError((message) => {
      crashlytics().recordError(new Error(message));
      console.log('error message', message);
    });
    onCancel(() => {
      analytics().logEvent('cencel_auth_humanid', {
        id: '1',
      });
      console.log('canceled');
    });
  }, []);
  const handleLogin = () => {
    logIn();
    analytics().logLogin({
      method: 'humanid',
    });
  };
  return (
    <View style={S.container}>
      <View style={S.containerSlideShow}>
        <SlideShow />
      </View>
      <View style={S.containerBtnLogin}>
        <TouchableOpacity onPress={() => handleLogin()} style={S.btnSign}>
          {/* <Image source={BtnHumanID} width={321} height={48} style={S.image} /> */}
          <ButtonSign />
        </TouchableOpacity>
        <Text style={S.desc}>
          <Text style={S.humanID}>humanID</Text> is an independent non-profit
          guaranteeing your privacy and anonymity. BetterSocial will receive
          absolutely zero personal information.
        </Text>
      </View>
      <Loading visible={loading} />
    </View>
  );
};

export default SignIn;

const S = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 321,
    height: 48,
    borderRadius: 10,
  },
  containerSlideShow: {
    height: '70%',
  },
  containerBtnLogin: {
    // backgroundColor: 'orange',
    // backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    paddingTop: 26,
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
    fontWeight: '400',
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: 12,
    width: 250,
    textAlign: 'center',
    color: colors.gray,
    marginTop: 16,
  },
  humanID: {
    color: '#11243D',
    // fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  btnText: {fontSize: 17, color: '#fff', fontWeight: 'bold'},
  humen: {fontSize: 17, color: '#fff', fontWeight: '100'},
  btnSign: {
    borderRadius: 10,
    // backgroundColor: '#BDBDBB',
    // shadowColor: 'rgba(189,189,187,0.32)',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.62,
    // elevation: 2,
  },
});
