import * as React from 'react';
import VersionNumber from 'react-native-version-number';
import analytics from '@react-native-firebase/analytics';
import {
  Dimensions,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useSetRecoilState} from 'recoil';

import Header from '../../components/Header';
import Loading from '../Loading';
import ProfileSettingItem from './element/ProfileSettingItem';
import useSettings from './hooks/useSettings';
import {COLORS} from '../../utils/theme';
import {SETTINGS_FAQ_URL, SETTINGS_PRIVACY_URL} from '../../utils/constants';
import {debugAtom} from '../../service/debug';
import {fonts} from '../../utils/fonts';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const {width} = Dimensions.get('screen');

const Settings = () => {
  const navigation = useNavigation();
  const [toggleDebug, setToggleDebug] = React.useState(0);
  const setDebugMode = useSetRecoilState(debugAtom);

  const {isLoadingDeletingAccount, logout, showDeleteAccountAlert, setStartupValue} = useSettings();

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'Settings',
      screen_name: 'Settings'
    });
  }, []);

  const goToPage = (pageName) => {
    navigation.navigate(pageName);
  };

  const goToExternalBrowser = async (url) => {
    const canOpenUrl = await Linking.canOpenURL(url);
    if (canOpenUrl) Linking.openURL(url);
  };

  const doLogout = () => {
    logout();
    setStartupValue({
      id: null,
      deeplinkProfile: false
    });
  };

  const turnOnDebugMode = () => {
    if (toggleDebug > 7) {
      setDebugMode(true);
    } else {
      setToggleDebug(toggleDebug + 1);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" translucent={false} />
      <SafeAreaView style={styles.container}>
        <Header title="Settings" isCenter onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <ProfileSettingItem
            testID="blocked"
            text="Blocked List"
            onPress={() => goToPage('BlockScreen')}
          />
          <ProfileSettingItem testID="news" text="News" onPress={() => goToPage('News')} />
          <ProfileSettingItem
            testID="privacy"
            text="Privacy Policies"
            onPress={() => goToExternalBrowser(SETTINGS_PRIVACY_URL)}
          />
          <ProfileSettingItem
            testID="help"
            text="Help Center"
            onPress={() => goToExternalBrowser(SETTINGS_FAQ_URL)}
          />
          <ProfileSettingItem text="Delete Account" onPress={showDeleteAccountAlert} />
          <ProfileSettingItem text="Logout" onPress={doLogout} />
        </View>
        <View>
          <TouchableOpacity onPress={turnOnDebugMode}>
            <View style={styles.versionContainer}>
              <Text style={styles.textVersion}>{`Version ${VersionNumber.appVersion}`}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Loading visible={isLoadingDeletingAccount} />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  containerHeader: {padding: 16},
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    paddingBottom: 16,
    paddingTop: 16,
    position: 'relative'
  },
  textSettings: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.black
  },
  floatLeft: {
    position: 'absolute',
    left: 20,
    top: 20
  },
  content: {
    padding: 20,
    flex: 20
  },
  footer: {
    zIndex: 999
  },
  versionContainer: {
    width,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textVersion: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.gray410
  }
});
export default withInteractionsManaged(React.memo(Settings));
