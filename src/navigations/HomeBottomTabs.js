/* eslint-disable no-use-before-define */
import * as React from 'react';
import PushNotification from 'react-native-push-notification';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/core';
import {useRecoilValue} from 'recoil';

import AnonymousChannelListScreen from '../screens/ChannelListScreenV2/AnonymousChannelListScreen';
import AnonymousChatFill from '../assets/icon/AnonymousChatFill';
import AnonymousChatOutline from '../assets/icon/AnonymousChatOutline';
import MemoFeed from '../assets/icon/Feed';
import MemoNews from '../assets/icon/News';
import MemoProfileIcon from '../assets/icon/Profile';
import SignedChat from '../assets/icon/SignedChat';
import StorageUtils from '../utils/storage';
import dimen from '../utils/dimen';
import useAppBadgeHook from '../hooks/appBadge/useAppBadgeHook';
import useCoreChatSystemHook from '../hooks/core/useCoreChatSystemHook';
import usePushNotificationHook from '../hooks/core/push-notification/usePushNotificationHook';
import useRootChannelListHook from '../hooks/screen/useRootChannelListHook';
import {COLORS} from '../utils/theme';
import {ChannelListScreen, FeedScreen, NewsScreen, ProfileScreen} from '../screens';
import {InitialStartupAtom, otherProfileAtom} from '../service/initialStartup';
import {Loading} from '../components';
import {fonts, normalizeFontSize} from '../utils/fonts';

const Tab = createBottomTabNavigator();

function HomeBottomTabs() {
  useCoreChatSystemHook();
  const initialStartup = useRecoilValue(InitialStartupAtom);
  const otherProfileData = useRecoilValue(otherProfileAtom);
  const {signedChannelUnreadCount, anonymousChannelUnreadCount} = useRootChannelListHook();
  const navigation = useNavigation();
  const {isLoadingFetchingChannelDetail} = usePushNotificationHook();
  const {updateAppBadgeWith} = useAppBadgeHook();

  React.useEffect(() => {
    if (otherProfileData !== null && initialStartup.id !== null) {
      navigation.navigate('OtherProfile', {
        data: {
          user_id: initialStartup.id,
          other_id: otherProfileData.user_id,
          username: otherProfileData.username
        }
      });
    }
  }, [initialStartup, otherProfileData]);

  React.useEffect(() => {
    const totalUnreadCount = (signedChannelUnreadCount || 0) + (anonymousChannelUnreadCount || 0);
    updateAppBadgeWith(totalUnreadCount);
  }, [signedChannelUnreadCount, anonymousChannelUnreadCount]);

  const renderTabBarIcon = (route, focused, color) => {
    if (route.name === 'SignedChannelList') {
      return (
        <View style={styles.iconContainer}>
          <SignedChat fill={color} stroke={color} />
        </View>
      );
    }
    if (route.name === 'AnonymousChannelList') {
      return (
        <View style={styles.iconContainer}>
          {focused ? (
            <AnonymousChatFill fill={COLORS.anon_primary} stroke={COLORS.anon_primary} />
          ) : (
            <AnonymousChatOutline fill={color} />
          )}
        </View>
      );
    }
    if (route.name === 'Feed') {
      return (
        <View style={styles.iconContainer}>
          <MemoFeed fill={color} />
        </View>
      );
    }
    if (route.name === 'News') {
      return (
        <View style={styles.iconContainer}>
          <MemoNews fill={color} />
        </View>
      );
    }

    return (
      <View style={styles.iconContainer}>
        <MemoProfileIcon />
      </View>
    );
  };

  const lastMenu = StorageUtils.lastSelectedMenu.get();
  const getInitialRouteName = React.useCallback(() => {
    if (initialStartup !== null && otherProfileData?.user_id === initialStartup.id) {
      return 'Profile';
    }

    return lastMenu ?? 'Feed';
  }, [lastMenu]);

  const saveLastMenu = (route) => ({
    tabPress: () => {
      StorageUtils.lastSelectedMenu.set(route?.name);
    }
  });

  const menuIndicator = (nav, route) => {
    const isAnonChatMenu = route.name === 'AnonymousChannelList';
    const activeColor = isAnonChatMenu ? COLORS.anon_primary : COLORS.signed_primary;
    let label = '';
    if (route.name === 'SignedChannelList') label = 'Primary';
    else if (route.name === 'AnonymousChannelList') label = 'Incognito';
    else if (route.name === 'Feed') label = 'Feed';
    else if (route.name === 'News') label = 'News';
    if (route.name === 'Profile') label = 'Profile';

    const bottomBarExtendedStyle = {
      color: nav?.isFocused() ? activeColor : COLORS.gray410
    };
    return <Text style={[styles.bottomBarLabel, bottomBarExtendedStyle]}>{label}</Text>;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.almostBlack}}>
      <Loading visible={isLoadingFetchingChannelDetail} />
      <Tab.Navigator
        initialRouteName={getInitialRouteName()}
        tabBarOptions={{
          inactiveTintColor: COLORS.gray410,
          safeAreaInsets: {top: 0, bottom: 0, left: 0, right: 0},
          activeBackgroundColor: COLORS.almostBlack,
          inactiveBackgroundColor: COLORS.almostBlack
        }}
        screenOptions={({navigation: nav, route}) => ({
          tabBarLabel: () => menuIndicator(nav, route),
          tabBarIcon: ({focused, color}) => renderTabBarIcon(route, focused, color),
          tabBarActiveTintColor:
            route.name === 'AnonymousChannelList' ? COLORS.anon_primary : COLORS.signed_primary
        })}>
        <Tab.Screen
          name="SignedChannelList"
          component={ChannelListScreen}
          initialParams={{isBottomTab: true}}
          listeners={({route}) => saveLastMenu(route)}
          options={{
            tabBarBadge: signedChannelUnreadCount > 0 ? signedChannelUnreadCount : null,
            tabBarBadgeStyle: styles.bottomBarBadge
          }}
        />
        <Tab.Screen
          name="AnonymousChannelList"
          component={AnonymousChannelListScreen}
          initialParams={{isBottomTab: true}}
          listeners={({route}) => saveLastMenu(route)}
          options={{
            tabBarBadge: anonymousChannelUnreadCount > 0 ? anonymousChannelUnreadCount : null,
            tabBarBadgeStyle: styles.bottomBarBadge
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          initialParams={{isBottomTab: true}}
          listeners={({route}) => saveLastMenu(route)}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{isBottomTab: true}}
          listeners={({route}) => saveLastMenu(route)}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default HomeBottomTabs;

const styles = StyleSheet.create({
  iconContainer: {
    top: dimen.normalizeDimen(5),
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomBarBadge: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(10)
  },
  bottomBarLabel: {
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(10)
  }
});
