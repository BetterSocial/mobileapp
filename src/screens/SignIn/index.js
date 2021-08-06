import * as React from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {
  logIn,
  onSuccess,
  onCancel,
  onError,
} from '@human-id/react-native-humanid';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/core';
import {StackActions} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {colors} from 'react-native-swiper-flatlist/src/themes';

import {
  setUserId,
  setAccessToken,
  setRefreshToken,
  removeLocalStorege,
} from '../../utils/token';
import {Context} from '../../context';
import {fonts} from '../../utils/fonts';
import {checkToken} from '../../service/outh';
import {verifyUser} from '../../service/users';
import {setDataHumenId} from '../../context/actions/users';
import StringConstant from '../../utils/string/StringConstant';
import ButtonSign from '../../assets/icon-svg/button_sign.svg';
import Loading from '../Loading';
import SlideShow from './elements/SlideShow';
import {createClient} from '../../context/actions/createClient';

const ENABLE_DEV_ONLY_FEATURE = true;

const SignIn = () => {
  const navigation = useNavigation();
  const [, dispatch] = React.useContext(Context).users;
  const [loading, setLoading] = React.useState(false);

  let dummyLoginRbSheetRef = React.useRef(null);

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'SignIn',
      screen_name: 'SignIn',
    });
  });
  React.useEffect(() => {
    onSuccess(async (exchangeToken) => {
      setLoading(true);
      checkToken(exchangeToken)
        .then((res) => {
          if (res.data) {
            let {appUserId, countryCode} = res.data;
            setDataHumenId(res.data, dispatch);
            verifyUser(appUserId)
              .then((response) => {
                setLoading(false);
                if (response.data) {
                  createClient(response.token);
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
        })
        .catch((e) => {
          console.log('error');
          console.log(e);
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

  const dummyLogin = (appUserId) => {
    if (ENABLE_DEV_ONLY_FEATURE) {
      dummyLoginRbSheetRef.current.close();
    }
    setLoading(true);
    setDataHumenId(appUserId, dispatch);
    verifyUser(appUserId)
      .then(async (response) => {
        setLoading(false);
        if (response.data) {
          setAccessToken(response.token);
          setRefreshToken(response.refresh_token);
          setTimeout(() => {
            navigation.dispatch(StackActions.replace('HomeTabs'));
          }, 100);
        } else {
          removeLocalStorege('userId');
          navigation.dispatch(StackActions.replace('ChooseUsername'));
        }
        setUserId(appUserId);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  return (
    <View style={S.container}>
      {ENABLE_DEV_ONLY_FEATURE ? (
        <View style={S.devTrialView}>
          <Button
            title={'Dev Dummy Onboarding'}
            onPress={() => navigation.navigate('ChooseUsername')}
          />
          <Button
            title={'Dev Dummy Login'}
            onPress={() => dummyLoginRbSheetRef.current.open()}
          />
        </View>
      ) : (
        <></>
      )}
      <View style={S.containerSlideShow}>
        <SlideShow />
      </View>
      <View style={S.containerBtnLogin}>
        <TouchableOpacity onPress={() => handleLogin()} style={S.btnSign}>
          {/* <Image source={BtnHumanID} width={321} height={48} style={S.image} /> */}
          <ButtonSign />
        </TouchableOpacity>
        <Text style={S.desc}>
          <Text style={S.humanID}>
            {StringConstant.signInScreenHumanIdBrand}
          </Text>
          {` ${StringConstant.signInScreenHumanIdDetail}`}
        </Text>
      </View>
      <Loading visible={loading} />
      {ENABLE_DEV_ONLY_FEATURE ? (
        <RBSheet ref={dummyLoginRbSheetRef}>
          <Text>Choose an account you wish to login</Text>
          <TouchableOpacity onPress={() => dummyLogin('HQEGNQCHA8J1OIX4G2CP')}>
            <View style={S.divider} />
            <Text style={S.dummyAccountItem}>
              fajarism : HQEGNQCHA8J1OIX4G2CP
            </Text>
            <View style={S.divider} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dummyLogin('KVL1JKD8VG6KMHUZ0RY5')}>
            <Text style={S.dummyAccountItem}>
              bas_v1-4 : KVL1JKD8VG6KMHUZ0RY5
            </Text>
            <View style={S.divider} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dummyLogin('P19FGPQGMSZ5VSHA0YSQ')}>
            <Text style={S.dummyAccountItem}>
              usupsuparma : P19FGPQGMSZ5VSHA0YSQ
            </Text>
            <View style={S.divider} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dummyLogin('6I7SIFD7BPSKZGK0Y6DF')}>
            <Text style={S.dummyAccountItem}>eka : 6I7SIFD7BPSKZGK0Y6DF</Text>
            <View style={S.divider} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dummyLogin('TVGBYD1BI9YMXMAA6CQS')}>
            <Text style={S.dummyAccountItem}>
              busanid : TVGBYD1BI9YMXMAA6CQS
            </Text>
            <View style={S.divider} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dummyLogin('WFGJR5G7GJMHJL166JMY')}>
            <Text style={S.dummyAccountItem}>
              akudankamu: WFGJR5G7GJMHJL166JMY
            </Text>
            <View style={S.divider} />
          </TouchableOpacity>
        </RBSheet>
      ) : (
        <></>
      )}
    </View>
  );
};

export default SignIn;

const S = StyleSheet.create({
  container: {
    flex: 1,
  },
  devTrialView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 999,
    backgroundColor: 'red',
  },
  dummyLoginButton: {},
  dummyAccountItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  divider: {
    width: '100%',
    backgroundColor: colors.gray,
    height: 2,
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
  },
});
