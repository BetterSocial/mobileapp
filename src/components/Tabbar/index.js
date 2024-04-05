import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import dimen from '../../utils/dimen';

const S = StyleSheet.create({
  container: {
    paddingHorizontal: dimen.normalizeDimen(22),
    paddingVertical: dimen.normalizeDimen(20),
    display: 'flex',
    flexDirection: 'column'
  },

  containertitle: {
    fontSize: normalizeFontSize(16)
  },

  toptabcontainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    borderBottomColor: COLORS.gray200,
    borderBottomWidth: 1,
    paddingHorizontal: dimen.normalizeDimen(4)
  },

  singletab: {
    flex: 1,
    paddingLeft: dimen.normalizeDimen(16)
  },

  singletabtext: {
    fontFamily: fonts.inter[500],
    textAlign: 'center',
    fontSize: normalizeFontSize(14),
    paddingVertical: dimen.normalizeDimen(10),
    color: COLORS.gray400
  },

  viewborderbottom: {
    borderBottomColor: COLORS.signed_primary,
    borderBottomWidth: 2
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

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={S.singletab}>
            <Text style={[S.singletabtext, isFocused ? {color: COLORS.white} : {}]}>{label}</Text>
            <View style={isFocused ? S.viewborderbottom : {}} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Tabbar;
