import * as React from 'react';
import Toast from 'react-native-simple-toast';
import VersionNumber from 'react-native-version-number';
import analytics from '@react-native-firebase/analytics';
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { useSetRecoilState } from 'recoil';

import ChevronRightIcon from '../../assets/icons/images/chevron-right.svg';
import Header from '../../components/Header';
import ProfileSettingItem from './element/ProfileSettingItem';
import StringConstant from '../../utils/string/StringConstant';
import { Context } from '../../context';
import { InitialStartupAtom } from '../../service/initialStartup';
import { clearLocalStorege } from '../../utils/token';
import { colors } from '../../utils/colors';
import { createClient } from '../../context/actions/createClient';
import { fonts } from '../../utils/fonts';
import { removeAllCache } from '../../utils/cache';
import { resetProfileFeed } from '../../context/actions/myProfileFeed';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const {width} = Dimensions.get('screen');

const Settings = () => {
  const [clientState, dispatch] = React.useContext(Context).client;
  const { client } = clientState;
  const navigation = useNavigation();
  const setStartupValue = useSetRecoilState(InitialStartupAtom)

  const [, myProfileDispatch] = React.useContext(Context).myProfileFeed;
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'Settings',
      screen_name: 'Settings',
    });
  }, []);
  const logout = () => {
    removeAllCache()
    resetProfileFeed(myProfileDispatch)
    client?.disconnectUser();
    createClient(null, dispatch)
    clearLocalStorege();
    
    setStartupValue({
      id: null,
      deeplinkProfile : false,
    })
  };

  const goToPage = (pageName) => {
    navigation.navigate(pageName)
  }

  const deleteAccount = () => {
    // TODO :change this to delete account API call
    logout()
    Toast.show(StringConstant.profileDeleteAccountSuccess, Toast.SHORT);
  }

  const showDeleteAccountAlert = () => {
    Alert.alert(StringConstant.profileDeleteAccountAlertTitle, StringConstant.profileDeleteAccountAlertMessage,
      [
        {text: StringConstant.profileDeleteAccountAlertCancel, onPress: () => {}, style: 'default'},
        {text: StringConstant.profileDeleteAccountAlertSubmit, onPress: deleteAccount, style: 'destructive'}
      ])
  }


  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <SafeAreaView style={styles.container}>
        <Header title="Settings" isCenter onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <ProfileSettingItem text="Blocked List" onPress={() => goToPage('BlockScreen')} />
          <ProfileSettingItem text="Privacy Policies" onPress={() => goToPage('PrivacyPolicies')} />
          <ProfileSettingItem text="Help Center" onPress={() => goToPage('HelpCenter')} />
          <ProfileSettingItem text="Delete Account" onPress={showDeleteAccountAlert} />
          <ProfileSettingItem text="Logout" onPress={logout} />
        </View>
        <View style={styles.footer}>
          <Text
            style={
              styles.textVersion
            }>{`Version ${VersionNumber.appVersion}`}</Text>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerHeader: { padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    paddingBottom: 16,
    paddingTop: 16,
    position: 'relative',
  },
  textSettings: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  floatLeft: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  content: {
    padding: 20,
    flexDirection: 'column',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textVersion: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.black,
  },
});
export default withInteractionsManaged(React.memo(Settings));
