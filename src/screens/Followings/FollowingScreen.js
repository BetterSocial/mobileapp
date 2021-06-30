import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Animated from 'react-native-reanimated';

import DomainFragmentScreen from './elements/DomainFragmentScreen';
import TopicFragmentScreen from './elements/TopicFragmentScreen';
import Followings from '.';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

export default function FollowingScreen({}) {
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

  return (
    <Tabs.Navigator
      initialRouteName="TabFollowing"
      tabBar={(props) => {
        return <MyTabBar {...props} />;
      }}>
      <Tabs.Screen
        name="TabFollowing"
        component={Followings}
        options={{
          title: 'User',
        }}
      />
      <Tabs.Screen
        name="TabDomain"
        component={DomainFragmentScreen}
        options={{
          title: 'Domains',
        }}
      />
      <Tabs.Screen
        name="TabTopic"
        component={TopicFragmentScreen}
        options={{
          title: 'Topic',
        }}
      />
    </Tabs.Navigator>
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
