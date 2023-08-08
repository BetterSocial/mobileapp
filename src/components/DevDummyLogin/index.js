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
import {useSetRecoilState} from 'recoil';

import StorageUtils from '../../utils/storage';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {InitialStartupAtom} from '../../service/initialStartup';
import {checkPasswordForDemoLogin, demoVerifyUser} from '../../service/users';
import {randomString} from '../../utils/string/StringUtils';
import {
  removeLocalStorege,
  setAccessToken,
  setAnonymousToken,
  setRefreshToken,
  setUserId
} from '../../utils/token';
import {setDataHumenId} from '../../context/actions/users';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';

const heightBs = Dimensions.get('window').height * 0.85;
const heightBsPassword = Dimensions.get('window').height * 0.65;

const S = StyleSheet.create({
  devTrialView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 999,
    backgroundColor: 'red'
  },
  dummyLoginButton: {},
  dummyAccountItem: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  divider: {
    width: '100%',
    backgroundColor: COLORS.gray,
    height: 2
  },
  passwordTextInput: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.lightgrey
  }
});

const DevDummyLogin = ({resetClickTime = () => {}}) => {
  const {ENABLE_DEV_ONLY_FEATURE} = configEnv;
  const {setProfileId} = useProfileHook();

  const [dummyUsers] = React.useState([
    {name: 'fajarismv2', humanId: 'fajarismv2'},
    {name: 'halofajarism', humanId: 'halofajarism'},
    {name: 'fajarus1', humanId: 'tYy3OFurquv0lkYF'},
    {name: 'agita', humanId: 'agita'},
    {name: 'usup', humanId: 'P19FGPQGMSZ5VSHA0YSQ'},
    {name: 'bastian', humanId: 'bastian'},
    {name: 'agita2', humanId: 'I4K3M10FGR78EWQQDNQ2'},
    {name: 'agita3', humanId: 'dlNWskypPXEPyNPM'},
    {name: 'BetterSocial_Team', humanId: 'KVL1JKD8VG6KMHUZ0RY5'},
    {name: 'JSmithWrites', humanId: 'AXZ61CSQ5CGC1WD94QSE'},
    {name: 'SophiaZ', humanId: 'ZZ750A44B7RWBNOP40U2'},
    {name: 'LuckyNumber8', humanId: '2QT5N04V8TU03IWFX61W'},
    {name: 'BornIn1999', humanId: 'G7WWEXKD5N264GLU3FZB'},
    {name: 'CollegeConfessions', humanId: '12ULE1ZRJSMOU24YREHU'},
    {name: 'Harvard_gossip', humanId: 'RRSJWZJCU9DC3Y01XRIC'},
    {name: 'GraceFul', humanId: 'L0ASAI3OQYDD36M49NIY'},
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
  const streamChat = useClientGetstream();
  const [, dispatch] = React.useContext(Context).users;
  const closeDummyLogin = () => {
    resetClickTime();
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
    if (ENABLE_DEV_ONLY_FEATURE === 'true') {
      dummyLoginRbSheetRef.current.close();
    }
    const data = {appUserId, countryCode: 'ID'};
    setDataHumenId(data, dispatch);
    demoVerifyUser(appUserId)
      .then(async (response) => {
        if (response.is_banned) {
          return;
        }
        if (response.data) {
          await setAnonymousToken(response.anonymousToken);
          await setAccessToken(response.token);
          setRefreshToken(response.refresh_token);

          const userId = await JwtDecode(response.token).user_id;
          const anonymousUserId = await JwtDecode(response.anonymousToken).user_id;
          setProfileId({
            anonProfileId: anonymousUserId,
            signedProfileId: userId
          });
          try {
            await setAnonymousToken(response.anonymousToken);
          } catch (e) {
            console.log('e');
            console.log(e);
          }
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
      });
  };

  const openDummyLoginPassword = (mode) => {
    setViewMode(mode);
    dummyLoginPasswordRbSheetRef?.current?.open();
  };

  React.useEffect(() => {
    const savedPasswordText = StorageUtils.onboardingPassword.get();
    if (savedPasswordText) setPasswordText(savedPasswordText);
  }, []);

  if (ENABLE_DEV_ONLY_FEATURE === 'true')
    return (
      <View style={S.devTrialView}>
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
            <ActivityIndicator size={'small'} color={COLORS.red} />
          ) : (
            <Button title={'Login'} onPress={checkPassword} />
          )}
        </RBSheet>
        <RBSheet height={heightBs} ref={dummyLoginRbSheetRef}>
          <Text>Choose an account you wish to login</Text>
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
