import * as React from 'react';
import Animated from 'react-native-reanimated';
import {BackHandler, Platform, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation, useRoute} from '@react-navigation/core';

import DomainFragmentScreen from './elements/DomainFragmentScreen';
import Followings from '.';
import TopicFragmentScreen from './elements/TopicScreen/TopicFragmentScreen';
import {Context} from '../../context';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {setNavbarTitle, showHeaderProfile} from '../../context/actions/setMyProfileAction';
import {withInteractionsManagedNoStatusBar} from '../../components/WithInteractionManaged';
import Search from '../DiscoveryScreenV2/elements/Search';

function FollowingScreen() {
  const navigation = useNavigation();
  const router = useRoute();
  const [profileState, dispatchNavbar] = React.useContext(Context).profile;
  const TAB_TOPIC = 'TabTopic';
  const TAB_FOLLOWING = 'TabFollowing';
  const TAB_DOMAIN = 'TabDomain';
  const isAndroid = Platform.OS === 'android';
  const Tabs = createMaterialTopTabNavigator();

  const followingHeader = () => {
    if ((Platform.OS === 'ios' && profileState.isShowHeader) || Platform.OS === 'android') {
      return (
        // TODO: integrate search
        <Search
          // searchText={searchText}
          // setSearchText={setSearchText}
          // setDiscoveryLoadingData={setIsLoadingDiscovery}
          // isFocus={isFocus}
          // setIsFocus={setIsFocus}
          // fetchDiscoveryData={fetchMember}
          // onCancelToken={onTokenCancel}
          placeholderText={profileState.navbarTitle}
          // setIsFirstTimeOpen={setIsFirstTimeOpen}
        />
      );
    }

    return null;
  };

  function MyTabBar({state, descriptors, position}) {
    const buttonTabBar = () =>
      state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel
          ? options.tabBarLabel
          : options.title
          ? options.title
          : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name);
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = Animated.interpolateNode(position, {
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? 1 : 0.3))
        });

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={S.singletab}>
            <Animated.Text style={{opacity, ...S.singletabtext}}>{label}</Animated.Text>
            <View style={isFocused ? S.viewborderbottom : {}} />
          </TouchableOpacity>
        );
      });
    return <View style={S.toptabcontainer}>{buttonTabBar()}</View>;
  }

  const listenTab = (tabProps) => {
    const {route} = tabProps;
    if (route.name === TAB_FOLLOWING) {
      setNavbarTitle('Search users', dispatchNavbar);
    }
    if (route.name === TAB_DOMAIN) {
      setNavbarTitle('Your Domains', dispatchNavbar);
    }
    if (route.name === TAB_TOPIC) {
      setNavbarTitle('Your Communities', dispatchNavbar);
    }
  };

  const settingBackhandleAndroid = () => {
    BackHandler.addEventListener('hardwareBackPress', backPress);
  };

  const removeBackHandleAndroid = () => {
    BackHandler.removeEventListener('hardwareBackPress', backPress);
  };

  const backPress = () => {
    return false;
  };

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

  const renderTabbar = (tabProps) => <MyTabBar navigation={navigation} {...tabProps} />;
  const {params} = router;

  return (
    <View style={{flex: 1}}>
      {isAndroid ? <StatusBar translucent={false} /> : null}
      {followingHeader()}
      {/* <StatusBar translucent={false} /> */}
      {!params.params.isFollower ? (
        <Tabs.Navigator initialRouteName={TAB_FOLLOWING} tabBar={renderTabbar}>
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
              title: 'Communities'
            }}
            listeners={listenTab}
          />
        </Tabs.Navigator>
      ) : (
        <Followings />
      )}
    </View>
  );
}

export default withInteractionsManagedNoStatusBar(FollowingScreen);

const S = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'column'
  },
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
  },

  singletab: {
    flex: 1,
    paddingLeft: 16
  },

  singletabtext: {
    fontFamily: fonts.inter[500],
    textAlign: 'left',
    fontSize: 14,
    paddingVertical: 10
  },

  viewborderbottom: {
    borderBottomColor: colors.holytosca,
    borderBottomWidth: 1
  }
});
