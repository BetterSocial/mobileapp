import * as React from 'react';
import VersionNumber from 'react-native-version-number';
import analytics from '@react-native-firebase/analytics';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import ChevronRightIcon from '../../assets/icons/images/chevron-right.svg';
import Header from '../../components/Header';
import { Context } from '../../context';
import {clearLocalStorege} from '../../utils/token';
import {colors} from '../../utils/colors';
import {createClient} from '../../context/actions/createClient';
import {fonts} from '../../utils/fonts';
import { removeAllCache } from '../../utils/cache';
import {resetProfileFeed} from '../../context/actions/myProfileFeed';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const width = Dimensions.get('screen').width;

const Settings = () => {
  const [clientState, dispatch] = React.useContext(Context).client;
  const { client } = clientState;
  const navigation = useNavigation();
  let [, myProfileDispatch] = React.useContext(Context).myProfileFeed;
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
    navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
  };

  const goToPage = (pageName) => {
    navigation.navigate(pageName)
  }


  return (
    <>
      <StatusBar barStyle="dark-content" translucent={false} />
      <SafeAreaView style={styles.container}>
      <Header title="Settings" isCenter onPress={() => navigation.goBack()} />
        <View style={styles.content}>
          <TouchableOpacity onPress={() => goToPage('BlockScreen')} >
            <View style={styles.card}>
              <Text style={styles.textCard}>Blocked list</Text>
              <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('TermsAndCondition')}
            >
            <View style={styles.card}>
              <Text style={styles.textCard}>Terms and Condition</Text>
              <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicies')}>
            <View style={styles.card}>
              <Text style={styles.textCard}>Privacy Policy</Text>
              <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('HelpCenter')}>
            <View style={styles.card}>
              <Text style={styles.textCard}>Help Center</Text>
              <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <View style={styles.card}>
              <Text style={styles.textCard}>Logout</Text>
              <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
            </View>
          </TouchableOpacity>
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
  containerHeader: {padding: 16},
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
  card: {
    height: 52,
    borderRadius: 8,
    backgroundColor: colors.lightgrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 18,
    paddingBottom: 18,
    marginBottom: 12,
  },
  textCard: {
    fontFamily: fonts.inter[700],
    fontWeight: '800',
    fontSize: 14,
    color: colors.black,
    lineHeight: 16,
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
export default withInteractionsManaged (React.memo(Settings));
