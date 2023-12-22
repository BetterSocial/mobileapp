import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View, TouchableOpacity} from 'react-native';
import Animated from 'react-native-reanimated';
import {fonts} from '../../utils/fonts';
import Header from './elements/Header';
import Link from './elements/Link';
import Media from './elements/Media';
import {COLORS} from '../../utils/theme';

const GroupMedia = () => {
  const Tab = createMaterialTopTabNavigator();
  const MyTabBar = ({state, descriptors, navigation, position}) => {
    return (
      <View style={styles.toptabcontainer}>
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
              style={styles.singletab}>
              <Animated.Text style={{opacity, ...styles.singletabtext}}>{label}</Animated.Text>
              <View style={isFocused ? styles.viewborderbottom : {}} />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent={false} />
      <View style={styles.container}>
        <Header title="Group Media" />
        <Tab.Navigator
          tabBar={(props) => {
            return <MyTabBar {...props} />;
          }}>
          <Tab.Screen name="Media" component={Media} />
          <Tab.Screen name="Links" component={Link} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default GroupMedia;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.white},

  toptabcontainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.black30percent,
    borderBottomWidth: 1,
    paddingHorizontal: 4
  },

  singletab: {
    flex: 1,
    paddingHorizontal: 19
  },

  singletabtext: {
    fontFamily: fonts.inter[500],
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 16.94,
    paddingTop: 15,
    paddingBottom: 16
  },

  viewborderbottom: {
    borderBottomColor: COLORS.holytosca,
    borderBottomWidth: 2
  }
});
