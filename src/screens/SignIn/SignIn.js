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
import {colors} from 'react-native-swiper-flatlist/src/themes';
const SignIn = () => {
  const navigation = useNavigation();
  const [, dispatch] = useContext(Context).users;
  React.useEffect(() => {
    onSuccess(async (exchangeToken) => {
      // await setToken(exchangeToken);
      checkToken(exchangeToken).then((res) => {
        if (res.data) {
          let {appUserId, countryCode} = res.data;
          setDataHumenId(res.data, dispatch);
          verifyUser(appUserId).then((response) => {
            if (response.data) {
              setToken(response.token);
              navigation.dispatch(StackActions.replace('HomeTabs'));
            } else {
              removeLocalStorege('userId');
              navigation.dispatch(StackActions.replace('ChooseUsername'));
            }
            // setUserId(appUserId);
          });
        }
      });
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
        <TouchableOpacity onPress={() => handleLogin()} style={S.btnSign}>
          <Image source={BtnHumanID} width={321} height={48} style={S.image} />
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
    width: 321,
    height: 48,
    borderRadius: 10,
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
  btnSign: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.48,
    shadowRadius: 2.62,
    elevation: 3,
    // height: 49,
  },
});
