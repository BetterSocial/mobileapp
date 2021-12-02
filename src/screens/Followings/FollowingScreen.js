import * as React from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Animated from 'react-native-reanimated';

import DomainFragmentScreen from './elements/DomainFragmentScreen';
import TopicFragmentScreen from './elements/TopicScreen/TopicFragmentScreen';
import Followings from '.';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {Context} from '../../context';
import {setNavbarTitle} from '../../context/actions/setMyProfileAction'

export default function FollowingScreen() {
  const [, dispatchNavbar] = React.useContext(Context).profile
  const TAB_TOPIC = 'TabTopic'
  const TAB_FOLLOWING = 'TabFollowing'
  const TAB_DOMAIN = 'TabDomain'
  let Tabs = createMaterialTopTabNavigator();
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


  const tabComponent = (tabProps) => {
    return <MyTabBar {...tabProps} />
  }

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

  return (
    <View style={{height: '100%'}}>
      <StatusBar translucent={false} />
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
