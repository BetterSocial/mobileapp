import * as React from 'react';
import VersionNumber from 'react-native-version-number';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/core';

import Header from '../../components/Header';
import Loading from '../Loading';
import ProfileSettingItem from './element/ProfileSettingItem';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import useSettings from './hooks/useSettings';

const { width } = Dimensions.get('screen');

const Settings = () => {

  const navigation = useNavigation();

  const {isLoadingDeletingAccount, logout, showDeleteAccountAlert, setStartupValue} = useSettings()
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'Settings',
      screen_name: 'Settings',
    });
  }, []);


  const goToPage = (pageName) => {
    navigation.navigate(pageName)
  }

  const doLogout = () => {
    logout()
    setStartupValue({
      id: null,
      deeplinkProfile: false,
    })
  }

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <SafeAreaView style={styles.container}>
        <Header title="Settings" isCenter onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <ProfileSettingItem testID='blocked' text="Blocked List" onPress={() => goToPage('BlockScreen')} />
          <ProfileSettingItem testID='privacy' text="Privacy Policies" onPress={() => goToPage('PrivacyPolicies')} />
          <ProfileSettingItem testID='help' text="Help Center" onPress={() => goToPage('HelpCenter')} />
          <ProfileSettingItem text="Delete Account" onPress={showDeleteAccountAlert} />
          <ProfileSettingItem text="Logout" onPress={doLogout} />
        </View>
        <View style={styles.footer}>
          <Text
            style={
              styles.textVersion
            }>{`Version ${VersionNumber.appVersion}`}</Text>
        </View>

        <Loading visible={isLoadingDeletingAccount} />
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
