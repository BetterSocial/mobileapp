import * as React from 'react';
import JwtDecode from 'jwt-decode';
import RBSheet from 'react-native-raw-bottom-sheet';
import SimpleToast from 'react-native-simple-toast';
import configEnv from 'react-native-config';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSetRecoilState} from 'recoil';

import StorageUtils from '../../utils/storage';
import TokenStorage from '../../utils/storage/custom/tokenStorage';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {InitialStartupAtom} from '../../service/initialStartup';
import {checkPasswordForDemoLogin, demoVerifyUser} from '../../service/users';
import {randomString} from '../../utils/string/StringUtils';
import {removeLocalStorege, setUserId} from '../../utils/token';
import {setDataHumenId} from '../../context/actions/users';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';

const heightBs = Dimensions.get('window').height * 0.85;
const heightBsPassword = Dimensions.get('window').height * 0.65;

const S = StyleSheet.create({
  dummyInput: {
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    textTransform: 'lowercase'
  },
  devTrialView: (top) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 999,
    backgroundColor: 'red',
    paddingTop: top
  }),
  dummyLoginButton: {},
  dummyAccountItem: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  divider: {
    width: '100%',
    backgroundColor: COLORS.gray410,
    height: 2
  },
  passwordTextInput: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.gray110
  }
});

const DevDummyLogin = ({resetClickTime = () => {}}) => {
  const {ENABLE_DEV_ONLY_FEATURE} = configEnv;
  const {setAuth} = useUserAuthHook();
  const [dummyInput, setDummyInput] = React.useState('');

  const [dummyUsers] = React.useState([
    {name: 'fajarismv2', humanId: 'fajarismv2'},
    {name: 'halofajarism', humanId: 'halofajarism'},
    {name: 'agita', humanId: 'agita'},
    {name: 'usup', humanId: 'P19FGPQGMSZ5VSHA0YSQ'},
    {name: 'new_test_account1', humanId: 'newtestaccount1'},
    {name: 'new_test_account2', humanId: 'newtestaccount2'},
    {name: 'new_test_account3', humanId: 'newtestaccount3'},
    {name: 'bastian', humanId: 'bastian'},
    {name: 'new_account_1', humanId: 'newaccount1'},
    {name: 'new_account_2', humanId: 'newaccount2'},
    {name: 'new_account_3', humanId: 'newaccount3'},
    {name: 'BetterSocial_Team', humanId: 'KVL1JKD8VG6KMHUZ0RY5'},
    {name: 'smith.confessions', humanId: 'AXZ61CSQ5CGC1WD94QSE'},
    {name: 'swat_confessions', humanId: 'ZZ750A44B7RWBNOP40U2'},
    {name: 'Carl_confessions', humanId: 'FIE72UIZAMQ1CQX1G9LO'},
    {name: 'Mac_confessions', humanId: 'P94ZX8ICBDSWUDX1L7DE'},
    {name: 'fandm_confessions', humanId: '2QT5N04V8TU03IWFX61W'},
    {name: 'BornIn1999', humanId: 'G7WWEXKD5N264GLU3FZB'},
    {name: 'CollegeConfessions', humanId: '12ULE1ZRJSMOU24YREHU'},
    {name: 'Harvard_gossip', humanId: 'RRSJWZJCU9DC3Y01XRIC'},
    {name: 'trinity_confessions', humanId: 'L0ASAI3OQYDD36M49NIY'},
    {name: 'CatLadyForever', humanId: 'YZ55TDV3W49CCFW722CX'},
    {name: 'Liz2', humanId: 'HXDX51MNA1DFV09608SX'},
    {name: 'Simplythebest2', humanId: 'WUCHMWWT9ZNHYFCMPMXZ'},
    {name: 'AlwaysinCrimson', humanId: 'GEPIX69EXGSRF17MMX0S'}
  ]);

  const [passwordText, setPasswordText] = React.useState('');
  const [isPasswordShown, setIsPasswordShown] = React.useState(false);
  const [isLoadingCheckPassword, setIsLoadingCheckPassword] = React.useState(false);
  const [viewMode, setViewMode] = React.useState('');

  const dummyLoginRbSheetRef = React.useRef(null);
  const dummyLoginPasswordRbSheetRef = React.useRef(null);
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();
  const streamChat = useClientGetstream();
  const [, dispatch] = React.useContext(Context).users;
  const closeDummyLogin = () => {
    resetClickTime();
    AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.BACKDOOR_CLOSE_MENU_CLICKED);
  };

  const setStartupValue = useSetRecoilState(InitialStartupAtom);

  const navigateToChooseUsername = () => {
    setDataHumenId(
      {
        appUserId: randomString(16),
        countryCode: 'US'
      },
      dispatch
    );
    navigation.navigate('ChooseUsername');
  };

  const openDummyLogin = () => {
    setTimeout(() => {
      dummyLoginRbSheetRef.current.open();
    }, 1000);
  };

  const checkPassword = async () => {
    setIsLoadingCheckPassword(true);
    StorageUtils.onboardingPassword.set(passwordText);
    const response = await checkPasswordForDemoLogin(passwordText);
    setIsLoadingCheckPassword(false);
    if (!response?.success && response?.code === 429) {
      SimpleToast.show('Too many requests, please try again later.', SimpleToast.SHORT);
      return;
    }

    if (!response?.success) {
      SimpleToast.show('Wrong Password', SimpleToast.SHORT);
      return;
    }

    dummyLoginPasswordRbSheetRef.current.close();
    if (viewMode === 'login') openDummyLogin();
    else if (viewMode === 'onboarding') navigateToChooseUsername();
  };

  const dummyLogin = (appUserId) => {
    if (!appUserId) return;

    if (ENABLE_DEV_ONLY_FEATURE === 'true') {
      dummyLoginRbSheetRef.current.close();
    }
    const data = {appUserId, countryCode: 'ID'};
    const password = StorageUtils.onboardingPassword.get();

    setDataHumenId(data, dispatch);
    demoVerifyUser(appUserId, password)
      .then(async (response) => {
        if (response.is_banned) {
          return;
        }
        if (response.data) {
          TokenStorage.set(response);

          const profile = await JwtDecode(response.token);
          const userId = profile?.user_id;
          const anonymousUserId = await JwtDecode(response.anonymousToken).user_id;
          StorageUtils.signedUserId.set(userId);
          StorageUtils.anonymousUserId.set(anonymousUserId);
          AnalyticsEventTracking.setId(profile);
          setAuth({
            anonProfileId: anonymousUserId,
            signedProfileId: userId,
            token: response.token,
            anonymousToken: response.anonymousToken
          });

          streamChat(response.token).then(() => {
            const testObj = {
              id: response.token,
              deeplinkProfile: false
            };
            setStartupValue(testObj);
          });
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
        SimpleToast.show(e?.message);
      });
  };

  const openDummyLoginPassword = (mode) => {
    setViewMode(mode);
    if (mode === 'onboarding') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.BACKDOOR_DUMMY_ONBOARDING_CLICKED
      );
    } else if (mode === 'login') {
      AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.BACKDOOR_DEMO_LOGIN_CLICKED);
    }
    dummyLoginPasswordRbSheetRef?.current?.open();
  };

  const sendBackoorMenuAnalyticEvent = () => {
    AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.BACKDDOR_MENU_OPEN);
  };

  React.useEffect(() => {
    const savedPasswordText = StorageUtils.onboardingPassword.get();
    if (savedPasswordText) setPasswordText(savedPasswordText);

    sendBackoorMenuAnalyticEvent();
  }, []);

  if (ENABLE_DEV_ONLY_FEATURE === 'true')
    return (
      <View style={S.devTrialView(top)}>
        <Button
          testID="dummyonboarding"
          title="Dev Dummy Onboarding"
          onPress={() => openDummyLoginPassword('onboarding')}
        />
        <Button
          testID="demologin"
          title="Demo Login"
          onPress={() => openDummyLoginPassword('login')}
        />
        <Button testID="closedemo" title="Close Demo Menu" onPress={closeDummyLogin} />
        <RBSheet height={heightBsPassword} ref={dummyLoginPasswordRbSheetRef}>
          <Text>Input password to continue</Text>
          <TextInput
            style={S.passwordTextInput}
            value={passwordText}
            secureTextEntry={!isPasswordShown}
            onChangeText={(text) => setPasswordText(text)}
          />
          <Button
            title={`${isPasswordShown ? 'Hide' : 'Show'} Password`}
            onPress={() => setIsPasswordShown((prev) => !prev)}
          />
          {isLoadingCheckPassword ? (
            <ActivityIndicator size={'small'} color={COLORS.redalert} />
          ) : (
            <Button title={'Login'} onPress={checkPassword} />
          )}
        </RBSheet>
        <RBSheet height={heightBs} ref={dummyLoginRbSheetRef}>
          <Text>Choose an account you wish to login</Text>
          <TextInput
            placeholder="Custom ID"
            value={dummyInput}
            onChangeText={(value) => setDummyInput(value)}
            style={S.dummyInput}
          />
          <Button title={'Login with custom id'} onPress={() => dummyLogin(dummyInput)} />
          {dummyUsers.map((item) => (
            <View testID={`dev-dummy-login-${item.name}`} key={`dummyusers-${item.name}`}>
              <TouchableOpacity onPress={() => dummyLogin(item.humanId)}>
                <View style={S.divider} />
                <Text style={S.dummyAccountItem}>{`${item.name}`}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </RBSheet>
      </View>
    );

  return <></>;
};

export default DevDummyLogin;
