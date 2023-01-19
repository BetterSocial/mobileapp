import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as React from 'react';
import {BackHandler, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';

import { withInteractionsManaged, withInteractionsManagedNoStatusBar } from '../../components/WithInteractionManaged';
import {Context} from '../../context';
import {setNavbarTitle, showHeaderProfile} from '../../context/actions/setMyProfileAction'
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import DomainFragmentScreen from './elements/DomainFragmentScreen';
import TopicFragmentScreen from './elements/TopicScreen/TopicFragmentScreen';
import Followings from '.';

function FollowingScreen(props) {
  const {navigation} = props
  const [, dispatchNavbar] = React.useContext(Context).profile
  const TAB_TOPIC = 'TabTopic'
  const TAB_FOLLOWING = 'TabFollowing'
  const TAB_DOMAIN = 'TabDomain'
  const isAndroid = Platform.OS === 'android'
  const Tabs = createMaterialTopTabNavigator();
  function MyTabBar({state, descriptors, navigation, position}) {
    return (
      <View style={S.toptabcontainer}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const inputRange = state.routes.map((_, i) => i);
          const opacity = Animated.interpolateNode(position, {
            inputRange,
            outputRange: inputRange.map((i) => (i === index ? 1 : 0.3)),
          });

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={S.singletab}>
              <Animated.Text style={{opacity, ...S.singletabtext}}>
                {label}
              </Animated.Text>
              <View style={isFocused ? S.viewborderbottom : {}} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }


  const tabComponent = (tabProps) => <MyTabBar {...tabProps} />

  const listenTab = (tabProps) => {
    const {route} = tabProps
    if(route.name === TAB_FOLLOWING) {
      setNavbarTitle("Who you're following", dispatchNavbar)
    }
    if(route.name === TAB_DOMAIN) {
      setNavbarTitle("Your Domains", dispatchNavbar)
    }
    if(route.name === TAB_TOPIC) {
      setNavbarTitle("Your Topics", dispatchNavbar)
    }
  }

  const settingBackhandleAndroid = () => {
    BackHandler.addEventListener('hardwareBackPress', backPress)
  }

  const removeBackHandleAndroid = () => {
    BackHandler.removeEventListener('hardwareBackPress', backPress)
  }

  const backPress = () => {
    return false;
  }

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      showHeaderProfile(true, dispatchNavbar)
    })
    navigation.addListener('blur', () => {
      showHeaderProfile(false, dispatchNavbar)
    })
    settingBackhandleAndroid()
    return () => {
      removeBackHandleAndroid()
    }
  }, [])

  return (
    <View style={{flex: 1}} >
      {isAndroid ? <StatusBar translucent={false} /> : null}
      {/* <StatusBar translucent={false} /> */}
      <Tabs.Navigator
        initialRouteName={TAB_FOLLOWING}
        tabBar={tabComponent}

        >
        <Tabs.Screen
          name={TAB_FOLLOWING}
          component={Followings}
          options={{
            title: 'User',
          }}
          listeners={listenTab}
        />
        <Tabs.Screen
          name={TAB_DOMAIN}
          component={DomainFragmentScreen}
          options={{
            title: 'Domains',
          }}
          listeners={listenTab}
        />
        <Tabs.Screen
          name={TAB_TOPIC}
          component={TopicFragmentScreen}
          options={{
            title: 'Topics',
          }}
          listeners={listenTab}
        />
      </Tabs.Navigator>
    </View>
  );
}

export default withInteractionsManagedNoStatusBar(FollowingScreen)

const S = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'column',
  },

  containertitle: {
    fontSize: 16,
  },

  toptabcontainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomColor: '#00000050',
    borderBottomWidth: 1,
    paddingHorizontal: 4,
  },

  singletab: {
    flex: 1,
    paddingLeft: 16,
  },

  singletabtext: {
    fontFamily: fonts.inter[500],
    textAlign: 'left',
    fontSize: 14,
    paddingVertical: 10,
  },

  viewborderbottom: {
    borderBottomColor: colors.holytosca,
    borderBottomWidth: 1,
  },
});
