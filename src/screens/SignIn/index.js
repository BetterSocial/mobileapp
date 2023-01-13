import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  Button,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import { colors } from 'react-native-swiper-flatlist/src/themes';
import { debounce } from 'lodash'
import {
  logIn,
  onCancel,
  onError,
  onSuccess,
} from '@human-internet/react-native-humanid';
import { useNavigation } from '@react-navigation/core';

import ButtonSign from '../../assets/icon-svg/button_sign.svg';
import ButtonSignDisabled from '../../assets/icon-svg/button_sign_disabled.svg';
import Loading from '../Loading';
import SlideShow from './elements/SlideShow';
import StringConstant from '../../utils/string/StringConstant';
import { Context } from '../../context';
import { ENABLE_DEV_ONLY_FEATURE } from '../../utils/constants';
import { checkToken } from '../../service/outh';
import { fonts } from '../../utils/fonts';
import { openUrl } from '../../utils/Utils';
import {
  removeLocalStorege,
  setAccessToken,
  setRefreshToken,
  setUserId,
} from '../../utils/token';
import { setDataHumenId } from '../../context/actions/users';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';
import { verifyUser } from '../../service/users';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const SignIn = () => {
  const navigation = useNavigation();
  const [, dispatch] = React.useContext(Context).users;
  const [loading, setLoading] = React.useState(false);
  const [, setSlideShowIndex] = React.useState(0)
  const [isCompleteSliding, setIsCompleteSliding] = React.useState(false);
  const create = useClientGetstream();
  const HUMAN_ID_URL = 'https://www.human-id.org/';
  const heightBs = Dimensions.get('window').height * 0.6
  const dummyLoginRbSheetRef = React.useRef(null);
  const [, setShowComponent] = React.useState(false)
  const handleSlideShow = ({ index }, length) => {
    setSlideShowIndex(index)
    if (index === length - 1) {
      setIsCompleteSliding(true);
    }
  };

  const goToHumanIdWeb = () => {
    openUrl(HUMAN_ID_URL);
  };

  React.useEffect(() => {
    onSuccess(async (exchangeToken) => {
      setLoading(true);
      checkToken(exchangeToken)
        .then((res) => {
          if (res.data) {
            const { appUserId } = res.data;
            setDataHumenId(res.data, dispatch);
            verifyUser(appUserId)
              .then((response) => {
                setLoading(false);
                if (response.data) {
                  create();
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
                if (__DEV__) {
                  console.log('verify user getstream error: ', e);
                }
                setLoading(false);
              });
          }
        })
        .catch((e) => {
          if (__DEV__) {
            console.log('error token: ', e);
          }
        });
    });
    onError((message) => {
      crashlytics().recordError(new Error(message));
    });
    onCancel(() => {
      analytics().logEvent('cencel_auth_humanid', {
        id: '1',
      });
    });
  }, []);
  const handleLogin = () => {
    if (!isCompleteSliding) {
      return;
    }
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
    const data = { appUserId, countryCode: 'ID' }
    setDataHumenId(data, dispatch);
    verifyUser(appUserId)
      // verifyUser('1G1H-1TUHI-7U9H7-572G2')
      .then(async (response) => {
        setLoading(false);

        if (response.data) {
          // SimpleToast.show(`on data`)
          setAccessToken(response.token);
          setRefreshToken(response.refresh_token);
          setTimeout(() => {
            navigation.dispatch(StackActions.replace('HomeTabs'));
          }, 100);
        } else {
          // SimpleToast.show(`on not data`)
          removeLocalStorege('userId');
          navigation.dispatch(StackActions.replace('ChooseUsername'));
        }
        setUserId(appUserId);
      })
      .catch((e) => {
        // SimpleToast.show(`on verify catch` + e)
        if (__DEV__) {
          console.log('verify user error: ', e);
        }
        setLoading(false);
      });
  };

  const debounceShowComponent = debounce(() => {
    setShowComponent(true)
  }, 350)

  React.useEffect(() => {
    debounceShowComponent()
  }, [])

  return (
    <SafeAreaView style={S.container}>
      <StatusBar translucent={false} />
      <React.Fragment>
        {ENABLE_DEV_ONLY_FEATURE ? (
          <View style={S.devTrialView}>
            <Button
              title="Dev Dummy Onboarding"
              onPress={() => {
                setDataHumenId('ASDF-GHJK-QWER-1234', dispatch)
                navigation.navigate('ChooseUsername')
              }}
            />
            <Button
              title="Dev Dummy Login"
              onPress={() => dummyLoginRbSheetRef.current.open()}
            />
          </View>
        ) : (
          <></>
        )}
        <View style={S.containerSlideShow}>
          <SlideShow onChangeNewIndex={handleSlideShow} />
        </View>
        <View style={S.containerBtnLogin}>
          {isCompleteSliding ? (
            <TouchableOpacity onPress={() => handleLogin()} style={S.btnSign}>
              <ButtonSign />
            </TouchableOpacity>
          ) : (
            <ButtonSignDisabled />
          )}
          <Text style={S.desc}>
            <Text onPress={goToHumanIdWeb} style={S.humanID}>
              {StringConstant.signInScreenHumanIdBrand}
            </Text>
            {` ${StringConstant.signInScreenHumanIdDetail}`}
          </Text>
        </View>
        <Loading visible={loading} />
        {ENABLE_DEV_ONLY_FEATURE ? (
          <RBSheet height={heightBs} ref={dummyLoginRbSheetRef}>
            <Text>Choose an account you wish to login</Text>
            <TouchableOpacity onPress={() => dummyLogin('HQEGNQCHA8J1OIX4G2CP')}>
              <View style={S.divider} />
              <Text style={S.dummyAccountItem}>
                fajarism : HQEGNQCHA8J1OIX4G2CP
              </Text>
              <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('HQEGNQCHA8J1OIX4G2CQ')}>
              <Text style={S.dummyAccountItem}>
                Fajar_alter : HQEGNQCHA8J1OIX4G2CQ
              </Text>
              <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('HQEGNQCHA8J1OIX4G2CR')}>
              <Text style={S.dummyAccountItem}>
                Fajar_alter2 : HQEGNQCHA8J1OIX4G2CR
              </Text>
              <View style={S.divider} />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => dummyLogin('KVL1JKD8VG6KMHUZ0RY8')}> */}
            <TouchableOpacity onPress={() => dummyLogin('KVL1JKD8VG6KMHUZ0RY5')}>
              <Text style={S.dummyAccountItem}>
                bas_v1-4 : KVL1JKD8VG6KMHUZ0RY5
              </Text>
              <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('1G1H-1TUHI-7U9H7-572G21')}>
              <Text style={S.dummyAccountItem}>
                usupsuparma : P19FGPQGMSZ5VSHA0YSQ
              </Text>
              <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('TVGBYD1BI9YMXMAA6CQS')}>
              <Text style={S.dummyAccountItem}>
                busanid : TVGBYD1BI9YMXMAA6CQS
              </Text>
              <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('GWJ47ZY9PQNQO6MFX2HC')}>
              <Text style={S.dummyAccountItem}>
                agitfirst : GWJ47ZY9PQNQO6MFX2HC
              </Text>
              <View style={S.divider} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dummyLogin('TVGBYD1BI9YMXMAA6CU53')}>
              <Text style={S.dummyAccountItem}>
                usupsu: TVGBYD1BI9YMXMAA6CU53
              </Text>
              <View style={S.divider} />
            </TouchableOpacity>
          </RBSheet>
        ) : (
          <></>
        )}
      </React.Fragment>


    </SafeAreaView>
  );
};

export default withInteractionsManaged (SignIn);

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
  btnText: { fontSize: 17, color: '#fff', fontWeight: 'bold' },
  humen: { fontSize: 17, color: '#fff', fontWeight: '100' },
  btnSign: {
    borderRadius: 10,
  },
});
