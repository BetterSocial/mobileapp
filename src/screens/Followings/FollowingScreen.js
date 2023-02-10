import * as React from 'react';
import {BackHandler, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import DomainFragmentScreen from './elements/DomainFragmentScreen';
import Followings from '.';
import Header from '../../components/Header';
import MyTabBar from './elements/TabBar/FollowingTabBar';
import TopicFragmentScreen from './elements/TopicScreen/TopicFragmentScreen';
import {Context} from '../../context';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {setNavbarTitle, showHeaderProfile} from '../../context/actions/setMyProfileAction';
import {withInteractionsManagedNoStatusBar} from '../../components/WithInteractionManaged';

function FollowingScreen(props) {
  const {navigation} = props;
  const [profileState, dispatchNavbar] = React.useContext(Context).profile;
  const TAB_TOPIC = 'TabTopic';
  const TAB_FOLLOWING = 'TabFollowing';
  const TAB_DOMAIN = 'TabDomain';
  const isAndroid = Platform.OS === 'android';
  const Tabs = createMaterialTopTabNavigator();

  const followingHeader = () => {
    if ((Platform.OS === 'ios' && profileState.isShowHeader) || Platform.OS === 'android') {
      return (
        <Header
          title={profileState.navbarTitle}
          titleStyle={S.headerTitle}
          onPress={() => navigation.goBack()}
          isCenter
        />
      );
    }

    return null;
  };

  const listenTab = (tabProps) => {
    const {route} = tabProps;
    if (route.name === TAB_FOLLOWING) {
      setNavbarTitle("Who you're following", dispatchNavbar);
    }
    if (route.name === TAB_DOMAIN) {
      setNavbarTitle('Your Domains', dispatchNavbar);
    }
    if (route.name === TAB_TOPIC) {
      setNavbarTitle('Your Topics', dispatchNavbar);
    }
  };

  const settingBackhandleAndroid = () => {
    BackHandler.addEventListener('hardwareBackPress', backPress);
  };

  const removeBackHandleAndroid = () => {
    BackHandler.removeEventListener('hardwareBackPress', backPress);
  };

  const backPress = () => false;

  React.useEffect(() => {
    const unsubFocusListener = navigation.addListener('focus', () => {
      showHeaderProfile(true, dispatchNavbar);
    });
    const unsubBlurListener = navigation.addListener('blur', () => {
      showHeaderProfile(false, dispatchNavbar);
    });
    settingBackhandleAndroid();
    return () => {
      removeBackHandleAndroid();
      unsubBlurListener();
      unsubFocusListener();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      {isAndroid ? <StatusBar translucent={false} /> : null}
      {followingHeader()}
      {/* <StatusBar translucent={false} /> */}
      <Tabs.Navigator
        initialRouteName={TAB_FOLLOWING}
        tabBar={(tabProps) => <MyTabBar navigation={navigation} {...tabProps} />}>
        <Tabs.Screen
          name={TAB_FOLLOWING}
          component={Followings}
          options={{
            title: 'User'
          }}
          listeners={listenTab}
        />
        <Tabs.Screen
          name={TAB_DOMAIN}
          component={DomainFragmentScreen}
          options={{
            title: 'Domains'
          }}
          listeners={listenTab}
        />
        <Tabs.Screen
          name={TAB_TOPIC}
          component={TopicFragmentScreen}
          options={{
            title: 'Topics'
          }}
          listeners={listenTab}
        />
      </Tabs.Navigator>
    </View>
  );
}

export default withInteractionsManagedNoStatusBar(FollowingScreen);

const S = StyleSheet.create({
  headerTitle: {fontSize: 16, fontFamily: fonts.inter[600], textAlign: 'center'},
  containertitle: {
    fontSize: 16
  },

  toptabcontainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomColor: '#00000050',
    borderBottomWidth: 1,
    paddingHorizontal: 4
  }
});
