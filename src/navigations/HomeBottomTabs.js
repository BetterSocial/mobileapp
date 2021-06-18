import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, { useContext, useEffect, useState } from 'react';
import {
  ChannelListScreen,
  FeedScreen,
  NewsScreen,
  ProfileScreen,
} from '../screens';

import {colors} from '../utils/colors';
import {Text} from 'react-native';
import MemoHome from '../assets/icon/Home';
import MemoFeed from '../assets/icon/Feed';
import MemoNews from '../assets/icon/News';
import MemoProfileIcon from '../assets/icon/Profile';
import { Context } from '../context';
import jwtDecode from 'jwt-decode';
import { getAccessToken } from '../data/local/accessToken';
import { getMyProfile } from '../service/profile';

const Tab = createBottomTabNavigator();

function HomeBottomTabs() {
  // let context = useContext(Context)
  // let [users] = context.users
  let [profilePic, setProfilePic] = useState(null)

    useEffect(() => {
      let getProfile = async() => {
        try {
          let token = await getAccessToken()
          let selfUserId = await jwtDecode(token).user_id
          let profile = await getMyProfile(selfUserId)
          setProfilePic(profile.data.profile_pic_path)
        } catch(e) {
          console.log(e)
        }
      }

      getProfile()
    }, [])

  const customTabBarStyle = {
    activeTintColor: '#23C5B6',
    inactiveTintColor: 'gray',
    style: {backgroundColor: 'white'},
  };
  return (
    <Tab.Navigator
      tabBarOptions={customTabBarStyle}
      tabBarOptions={{
        showLabel: true,
        activeTintColor: colors.holytosca,
        inactiveTintColor: colors.gray1,
      }}
      screenOptions={({route, navigation}) => {
        return {
          activeTintColor: colors.holytosca,
          tabBarLabel: () => (
            <Text
              style={{
                fontSize: 6,
                color: colors.holytosca,
                marginTop: -12,
                marginBottom: 5,
                alignSelf: 'center',
              }}>
              {navigation.isFocused() ? '\u2B24' : ''}
            </Text>
          ),
        };
      }}>
      <Tab.Screen
        name="ChannelList"
        component={ChannelListScreen}
        options={{
          activeTintColor: colors.holytosca,
          tabBarIcon: ({color}) => <MemoHome fill={color} />,
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          activeTintColor: colors.holytosca,
          tabBarIcon: ({color}) => <MemoFeed fill={color} />,
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          activeTintColor: colors.holytosca,
          tabBarIcon: ({focused, color}) => <MemoNews fill={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          activeTintColor: colors.holytosca,
          tabBarIcon: ({focused}) => <MemoProfileIcon uri={profilePic}/>,
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeBottomTabs;
