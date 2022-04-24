import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import SimpleToast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  Button,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { StackActions } from '@react-navigation/native';
import { colors } from 'react-native-swiper-flatlist/src/themes';
import { debounce } from 'lodash'
import {
  logIn,
  onCancel,
  onError,
  onSuccess,
} from '@human-id/react-native-humanid';
import { useNavigation } from '@react-navigation/core';

import ButtonSign from '../../assets/icon-svg/button_sign.svg';
import ButtonSignDisabled from '../../assets/icon-svg/button_sign_disabled.svg';
import DevDummyLogin from '../../components/DevDummyLogin';
import Loading from '../Loading';
import SlideShow from './elements/SlideShow';
import StringConstant from '../../utils/string/StringConstant';
import useIsReady from '../../hooks/useIsReady';
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
  const [, dispatch] = React.useContext(Context).users;
  const [loading, setLoading] = React.useState(false);
  const [slideShowIndex, setSlideShowIndex] = React.useState(0)
  const [isCompleteSliding, setIsCompleteSliding] = React.useState(false);
  const [showComponent, setShowComponent] = React.useState(false)

  // const isReady = useIsReady()
  const navigation = useNavigation();
  const create = useClientGetstream();

  const handleSlideShow = ({ index }, length) => {
    setSlideShowIndex(index)
    if (index === length - 1) {
      setIsCompleteSliding(true);
    }
  };

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
          console.log(res, 'response token')
          if (res.success) {
            const { appUserId, countryCode } = res.data;
            console.log(appUserId, 'resak')
            setDataHumenId(res.data, dispatch);
            verifyUser(appUserId)
              .then((response) => {
                console.log(response.data, appUserId, 'response data')
                setLoading(false);
                if (response.data) {
                  console.log('masuk response data', response.data)
                  create();
                  setAccessToken(response.token);
                  setRefreshToken(response.refresh_token);
                  navigation.dispatch(StackActions.replace('HomeTabs'));
                } else {
                  console.log('masuk revove user id')
                  removeLocalStorege('userId');
                  navigation.dispatch(StackActions.replace('ChooseUsername'));
                }
                setUserId(appUserId);
              })
              .catch((e) => {
                console.log(e, 'eman')
                setLoading(false);
              });
          } else {
            SimpleToast.show(res.message, SimpleToast.SHORT)
            console.log("else data")
          }
        })
        .catch((e) => {
          // SimpleToast.show(`on checkt token catch` + e)
          // console.log('on check token catch')
          console.log('error');
          console.log(e);
        });
    });
    onError((message) => {
      console.log('on general error')
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

  const debounceShowComponent = debounce(() => {
    setShowComponent(true)
  }, 350)

  React.useEffect(() => {
    debounceShowComponent()
  }, [])

  // if (!isReady) return null

  return (
    <SafeAreaView style={S.container}>
      <StatusBar translucent={false} />
      <View style={S.containerSlideShow}>
        <DevDummyLogin />
        <SlideShow onChangeNewIndex={handleSlideShow} handleLogin={handleLogin}/>
      </View>
    </SafeAreaView>
  );
};

export default withInteractionsManaged(SignIn);

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
    height: '100%',
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
