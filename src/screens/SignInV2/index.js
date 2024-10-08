import * as React from 'react';
import JwtDecode from 'jwt-decode';
import SimpleToast from 'react-native-simple-toast';
import crashlytics from '@react-native-firebase/crashlytics';
import {BackHandler, Linking, StatusBar, StyleSheet, View} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {
  handleDeepLink,
  logIn,
  onCancel,
  onError,
  onSuccess,
  unsubscribeAllEventListeners
} from '@human-internet/react-native-humanid';
import {useNavigation} from '@react-navigation/core';
import {useSetRecoilState} from 'recoil';

import DevDummyLogin from '../../components/DevDummyLogin';
import SlideShow from './elements/SlideShow';
import StorageUtils from '../../utils/storage';
import TokenStorage from '../../utils/storage/custom/tokenStorage';
import getRemoteConfig from '../../service/getRemoteConfig';
import useSignin from './hooks/useSignin';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
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

  const subscribeDeeplink = () => {
    const onDeepLink = (deepLink) => {
      handleDeepLink(deepLink?.url, handleExchangeToken, (error) =>
        console.log('error human id', error)
      );
    };

    Linking.addEventListener('url', onDeepLink);
    return () => {
      Linking.removeEventListener('url', onDeepLink);
    };
  };

  React.useEffect(() => {
    setDataHumenId(null, dispatch);
    const unsubscribe = subscribeDeeplink();
    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    onSuccess(handleExchangeToken);
    onError((message) => {
      crashlytics().recordError(new Error(message));
    });
    onCancel(() => {
      Analytics.logEvent('cencel_auth_humanid', {
        id: '1'
      });
    });

    const cleanup = () => {
      if (unsubscribeAllEventListeners) unsubscribeAllEventListeners();
    };

    return cleanup;
  }, []);

  const handleExchangeToken = async (exchangeToken) => {
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
        try {
          const profile = await JwtDecode(token);
          const userId = profile?.user_id;
          const anonymousUserId = await JwtDecode(anonymousToken).user_id;
          setUserId(userId);
          StorageUtils.signedUserId.set(userId);
          StorageUtils.anonymousUserId.set(anonymousUserId);
          AnalyticsEventTracking.setId(profile);
          setAuth({
            anonProfileId: anonymousUserId,
            signedProfileId: userId,
            token,
            anonymousToken
          });
          AnalyticsEventTracking.eventTrack(
            BetterSocialEventTracking.HUMAN_ID_SUCCESS_EXISTING_ACCOUNT
          );
        } catch (e) {
          crashlytics().recordError(new Error(e));
        }
      } else {
        setDataHumenId(response?.data?.humanIdData, dispatch);
        removeLocalStorege('userId');
        navigation.dispatch(StackActions.replace('ChooseUsername'));
        setUserId(response?.data?.humanIdData?.appUserId);
        AnalyticsEventTracking.eventTrack(
          BetterSocialEventTracking.HUMAN_ID_SUCCESS_NEW_REGISTRATION
        );
      }
    } catch (e) {
      SimpleToast.show(e?.message, SimpleToast.SHORT);
      crashlytics().recordError(new Error(e?.message));
      AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.HUMAN_ID_FAILED_VERIFICATION, {
        error: e
      });
      if (__DEV__) {
        console.log('error');
        console.log(e);
      }
    }
  };

  const handleLogin = () => {
    try {
      logIn();
      AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.HUMAN_ID_BUTTON_CLICKED);
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
        {clickTime >= 7 ? <DevDummyLogin resetClickTime={resetClickTime} /> : null}
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
    color: COLORS.gray410,
    marginTop: 16
  },
  humanID: {
    color: COLORS.bunting,
    // fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  btnText: {fontSize: 17, color: COLORS.almostBlack, fontWeight: 'bold'},
  humen: {fontSize: 17, color: COLORS.almostBlack, fontWeight: '100'},
  btnSign: {
    borderRadius: 10
  }
});
