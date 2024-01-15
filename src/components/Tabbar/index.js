import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Animated from 'react-native-reanimated';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const S = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'column'
  },

  containertitle: {
    fontSize: 16
  },

  toptabcontainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
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
    borderBottomColor: COLORS.holytosca,
    borderBottomWidth: 1
  }
});

const Tabbar = ({state, descriptors, navigation, position}) => {
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
            key={index}
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
      })}
    </View>
  );
};

export default Tabbar;
