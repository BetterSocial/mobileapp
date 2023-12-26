import * as React from 'react';
import JwtDecode from 'jwt-decode';
import SimpleToast from 'react-native-simple-toast';
import crashlytics from '@react-native-firebase/crashlytics';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import {StackActions} from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import {colors} from 'react-native-swiper-flatlist/src/themes';
import {
  logIn,
  onCancel,
  onError,
  onSuccess,
  unsubscribeAllEventListener
} from '@human-internet/react-native-humanid';
import {useNavigation} from '@react-navigation/core';
import {useSetRecoilState} from 'recoil';

import DevDummyLogin from '../../components/DevDummyLogin';
import SlideShow from './elements/SlideShow';
import TokenStorage from '../../utils/storage/custom/tokenStorage';
import getRemoteConfig from '../../service/getRemoteConfig';
import useSignin from './hooks/useSignin';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {InitialStartupAtom} from '../../service/initialStartup';
import {fonts} from '../../utils/fonts';
import {removeLocalStorege, setUserId} from '../../utils/token';
import {setDataHumenId} from '../../context/actions/users';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {verifyHumanIdExchangeToken} from '../../service/users';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const SignIn = () => {
  const {setAuth} = useUserAuthHook();

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
  }, []);

  React.useEffect(() => {
    onSuccess(async (exchangeToken) => {
      try {
        const response = await verifyHumanIdExchangeToken(exchangeToken);
        if (response?.data?.data) {
          const {token, anonymousToken} = response?.data || {};
          TokenStorage.set(response?.data);
          setValueStartup({
            id: token,
            deeplinkProfile: false
          });
          create(token);
          setUserId(response?.data?.appUserId);
          try {
            const userId = await JwtDecode(token).user_id;
            const anonymousUserId = await JwtDecode(anonymousToken).user_id;
            setAuth({
              anonProfileId: anonymousUserId,
              signedProfileId: userId,
              token,
              anonymousToken
            });
          } catch (e) {
            crashlytics().recordError(new Error(e));
          }
        } else {
          setDataHumenId(response?.data?.humanIdData, dispatch);
          removeLocalStorege('userId');
          navigation.dispatch(StackActions.replace('ChooseUsername'));
          setUserId(response?.data?.humanIdData?.appUserId);
        }
      } catch (e) {
        SimpleToast.show(e?.message, SimpleToast.SHORT);
        crashlytics().recordError(new Error(e?.message));
        if (__DEV__) {
          console.log('error');
          console.log(e);
        }
      }
    });
    onError((message) => {
      crashlytics().recordError(new Error(message));
    });
    onCancel(() => {
      Analytics.logEvent('cencel_auth_humanid', {
        id: '1'
      });
    });

    const cleanup = () => {
      if (unsubscribeAllEventListener) unsubscribeAllEventListener();
    };

    return cleanup;
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
    <View style={S.container}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <View style={S.containerSlideShow}>
        {clickTime >= 7 && isDemoLoginEnabled ? (
          <DevDummyLogin resetClickTime={resetClickTime} />
        ) : null}
        <SlideShow onContainerPress={onClickContainer} handleLogin={handleLogin} />
      </View>
    </View>
  );
};

export default withInteractionsManaged(SignIn);

const S = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue
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
    backgroundColor: COLORS.blueLoyal,
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
    color: COLORS.blackgrey,
    marginTop: 16
  },
  humanID: {
    color: COLORS.bunting,
    // fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  btnText: {fontSize: 17, color: COLORS.white, fontWeight: 'bold'},
  humen: {fontSize: 17, color: COLORS.white, fontWeight: '100'},
  btnSign: {
    borderRadius: 10
  }
});
