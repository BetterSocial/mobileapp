import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import crashlytics from '@react-native-firebase/crashlytics';
import {BackHandler, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {StackActions} from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import {colors} from 'react-native-swiper-flatlist/src/themes';
import {logIn, onCancel, onError, onSuccess} from '@human-internet/react-native-humanid';
import {useNavigation} from '@react-navigation/core';
import {useSetRecoilState} from 'recoil';

import DevDummyLogin from '../../components/DevDummyLogin';
import SlideShow from './elements/SlideShow';
import getRemoteConfig from '../../service/getRemoteConfig';
import useSignin from './hooks/useSignin';
import {Context} from '../../context';
import {InitialStartupAtom} from '../../service/initialStartup';
import {checkToken} from '../../service/outh';
import {fonts} from '../../utils/fonts';
import {removeLocalStorege, setAccessToken, setRefreshToken, setUserId} from '../../utils/token';
import {setDataHumenId} from '../../context/actions/users';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {verifyUser} from '../../service/users';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';

const SignIn = () => {
  const [, dispatch] = React.useContext(Context).users;
  const [clickTime, setClickTime] = React.useState(0);
  const [isDemoLoginEnabled, setIsDemoLoginEnabled] = React.useState(false);
  const setValueStartup = useSetRecoilState(InitialStartupAtom);
  const {getTopicsData} = useSignin();
  const navigation = useNavigation();
  const create = useClientGetstream();

  const onClickContainer = () => {
    setClickTime((prevState) => prevState + 1);
  };

  const resetClickTime = () => {
    setClickTime(0);
  };

  React.useEffect(() => {
    setDataHumenId(null, dispatch);
  });

  React.useEffect(() => {
    onSuccess(async (exchangeToken) => {
      checkToken(exchangeToken)
        .then((res) => {
          if (__DEV__) {
            console.log(res, 'response token');
          }
          if (res.success) {
            const {appUserId} = res.data;
            setDataHumenId(res.data, dispatch);
            verifyUser(appUserId)
              .then((response) => {
                if (response.is_banned) {
                  return;
                }
                if (response.data) {
                  setAccessToken(response.token);
                  setRefreshToken(response.refresh_token);
                  setValueStartup({
                    id: response.token,
                    deeplinkProfile: false
                  });
                  create(response.token);
                } else {
                  removeLocalStorege('userId');
                  navigation.dispatch(StackActions.replace('ChooseUsername'));
                }
                setUserId(appUserId);
              })
              .catch((e) => {
                if (__DEV__) {
                  console.log(e);
                }
              });
          } else {
            SimpleToast.show(res.message, SimpleToast.SHORT);
          }
        })
        .catch((e) => {
          if (__DEV__) {
            console.log('error');
            console.log(e);
          }
        });
    });
    onError((message) => {
      crashlytics().recordError(new Error(message));
    });
    onCancel(() => {
      Analytics.logEvent('cencel_auth_humanid', {
        id: '1'
      });
    });
  }, []);

  const handleLogin = () => {
    try {
      logIn();
    } catch (e) {
      console.log('test', e);
    }
    Analytics.logLogin('humanid');
  };

  React.useEffect(() => {
    getTopicsData();
  }, []);

  const checkIsDemoLoginEnabled = async () => {
    const isEnabled = await getRemoteConfig.isDemoLoginViewEnabled();
    if (isEnabled) {
      setIsDemoLoginEnabled(true);
    }
  };

  React.useEffect(() => {
    checkIsDemoLoginEnabled();
  }, []);

  const preventBackButton = () => true;

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', preventBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', preventBackButton);
    };
  }, []);

  return (
    <SafeAreaView style={S.container}>
      <StatusBar translucent={false} />
      <View style={S.containerSlideShow}>
        {clickTime >= 7 && isDemoLoginEnabled ? (
          <DevDummyLogin resetClickTime={resetClickTime} />
        ) : null}
        <SlideShow onContainerPress={onClickContainer} handleLogin={handleLogin} />
      </View>
    </SafeAreaView>
  );
};

export default withInteractionsManaged(SignIn);

const S = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: 321,
    height: 48,
    borderRadius: 10
  },
  containerSlideShow: {
    height: '100%'
  },
  containerBtnLogin: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 26
  },
  btn: {
    backgroundColor: '#023B60',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 23,
    flexDirection: 'row',
    alignItems: 'center'
  },
  desc: {
    fontWeight: '400',
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: 12,
    width: 250,
    textAlign: 'center',
    color: colors.gray,
    marginTop: 16
  },
  humanID: {
    color: '#11243D',
    // fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  btnText: {fontSize: 17, color: '#fff', fontWeight: 'bold'},
  humen: {fontSize: 17, color: '#fff', fontWeight: '100'},
  btnSign: {
    borderRadius: 10
  }
});
