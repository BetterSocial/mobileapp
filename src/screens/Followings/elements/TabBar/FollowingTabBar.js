import * as React from 'react';
import Animated from 'react-native-reanimated';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {colors} from '../../../../utils/colors';
import {fonts} from '../../../../utils/fonts';
import {COLORS} from '../../../../utils/theme';

const MyTabBar = ({state, descriptors, position, navigation}) => {
  const getLabel = (options, route) => {
    if (options?.tabBarLabel) return options.topBarLabel;
    if (options?.title) return options.title;
    return route?.name;
  };

  const buttonTabBar = () =>
    state.routes.map((route, index) => {
      const {options} = descriptors[route.key];
      const label = getLabel(options, route);
      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
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
};

const S = StyleSheet.create({
  toptabcontainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomColor: COLORS.black30percent,
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

export default React.memo(MyTabBar);
