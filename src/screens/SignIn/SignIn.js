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
} from '../../data/local/accessToken';
import {fonts} from '../../utils/fonts';
import {checkToken} from '../../service/outh';
import {verifyUser} from '../../service/users';
import {useNavigation} from '@react-navigation/core';
import {StackActions} from '@react-navigation/native';
import {setDataHumenId} from '../../context/actions/users';
import {Context} from '../../context';
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
      // await setToken(exchangeToken);
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
                navigation.dispatch(StackActions.replace('HomeTabs'));
              } else {
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
  return (
    <View style={S.container}>
      <View style={S.containerSlideShow}>
        <SlideShow />
      </View>
      <View style={S.containerBtnLogin}>
        <TouchableOpacity onPress={() => handleLogin()}>
          <Image source={BtnHumanID} width={321} height={48} style={S.image} />
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
    width: 321,
    height: 48,
    borderRadius: 5,
  },
  containerSlideShow: {
    height: '70%',
  },
  containerBtnLogin: {
    backgroundColor: '#fff',
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
});
