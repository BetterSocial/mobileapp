import React, {useContext} from 'react';
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
  setRefershToken,
} from '../../data/local/accessToken';
import {fonts} from '../../utils/fonts';
import {checkToken} from '../../service/outh';
import {verifyUser} from '../../service/users';
import {useNavigation} from '@react-navigation/core';
import {StackActions} from '@react-navigation/native';
import {setDataHumenId} from '../../context/actions/users';
import {Context} from '../../context';

import crashlytics from '@react-native-firebase/crashlytics';
import BtnHumanID from '../../assets/images/humanid.png';
import {colors} from '../../utils/colors';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
const SignIn = () => {
  const navigation = useNavigation();
  const [, dispatch] = useContext(Context).users;
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'SignIn',
      screen_name: 'SignIn',
    });
    onSuccess(async (exchangeToken) => {
      await setToken(exchangeToken);
      checkToken(exchangeToken).then((res) => {
        if (res.data) {
          let {appUserId, countryCode} = res.data;
          // crashlytics().setAttributes({
          //   'user-id': appUserId,
          //   'country-code': countryCode,
          // });
          setDataHumenId(res.data, dispatch);
          verifyUser(appUserId)
            .then((response) => {
              if (response.data) {
                setToken(response.token);
                setRefershToken(response.refresh_token);
                navigation.dispatch(StackActions.replace('Home'));
              } else {
                removeLocalStorege('userId');
                navigation.dispatch(StackActions.replace('ChooseUsername'));
              }
              // setUserId(appUserId);
              // crashlytics().setAttributes({
              //   appUserId,
              //   countryCode,
              // });
            })
            .catch((err) => {
              crashlytics().recordError(new Error(err));
            });
        }
      });
    });
    onError((message) => {
      crashlytics().recordError(new Error(message));
      console.log('error message', message);
    });
    onCancel(() => {
      console.log('canceled');
    });
  }, []);
  const handleLogin = () => {
    logIn();
  };
  const showId = (v) => {
    console.log(v);
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
      {/* <Button
        onPress={async () => {
          crashlytics().recordError(new Error('error test'));
          await console.log('test');
        }}
        title="test"
      /> */}
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
