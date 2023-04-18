import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import configEnv from 'react-native-config';
import {Button, Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useSetRecoilState} from 'recoil';

import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {InitialStartupAtom} from '../../service/initialStartup';
import {demoVerifyUser} from '../../service/users';
import {randomString} from '../../utils/string/StringUtils';
import {removeLocalStorege, setAccessToken, setRefreshToken, setUserId} from '../../utils/token';
import {setDataHumenId} from '../../context/actions/users';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';

const heightBs = Dimensions.get('window').height * 0.6;

const DevDummyLogin = ({resetClickTime = () => {}}) => {
  const {ENABLE_DEV_ONLY_FEATURE} = configEnv;

  const [dummyUsers] = React.useState([
    {name: 'fajarismv2', humanId: 'fajarismv2'},
    {name: 'halofajarism', humanId: 'halofajarism'},
    {name: 'agita', humanId: 'agita'},
    {name: 'bastian', humanId: 'bastian'},
    {name: 'agita2', humanId: 'I4K3M10FGR78EWQQDNQ2'},
    {name: 'agita3', humanId: 'dlNWskypPXEPyNPM'},
    {name: 'BetterSocial_Team', humanId: 'KVL1JKD8VG6KMHUZ0RY5'},
    {name: 'moni', humanId: 'B1NXMDLD9YRF3F7YIYXZ'},
    {name: 'usup', humanId: 'P19FGPQGMSZ5VSHA0YSQ'}
  ]);

  const dummyLoginRbSheetRef = React.useRef(null);
  const navigation = useNavigation();
  const streamChat = useClientGetstream();
  const [, dispatch] = React.useContext(Context).users;
  const closeDummyLogin = () => {
    resetClickTime();
  };

  const setStartupValue = useSetRecoilState(InitialStartupAtom);

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
          setAccessToken(response.token);
          setRefreshToken(response.refresh_token);
          streamChat(response.token).then(() => {
            // navigation.dispatch(StackActions.replace('HomeTabs'));
            // let strObj = {
            //     id: response.token,
            //     deeplinkProfile: false
            // }
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

  if (ENABLE_DEV_ONLY_FEATURE === 'true')
    return (
      <View style={S.devTrialView}>
        <Button
          testID="dummyonboarding"
          title="Dev Dummy Onboarding"
          onPress={() => {
            setDataHumenId(
              {
                appUserId: randomString(16),
                countryCode: 'US'
              },
              dispatch
            );
            navigation.navigate('ChooseUsername');
          }}
        />
        <Button
          testID="demologin"
          title="Demo Login"
          onPress={() => dummyLoginRbSheetRef.current.open()}
        />
        <Button testID="closedemo" title="Close Demo Menu" onPress={closeDummyLogin} />
        <RBSheet height={heightBs} ref={dummyLoginRbSheetRef}>
          <Text>Choose an account you wish to login</Text>
          {dummyUsers.map((item, index) => (
            <View key={`dummyusers-${index}`}>
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
  }
});

export default DevDummyLogin;
