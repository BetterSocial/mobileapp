import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  ChannelListScreen,
  FeedScreen,
  NewsScreen,
  ProfileScreen,
} from '../screens';

import MemoNewsSelected from '../assets/icon/NewsSelected';
import MemoHomeUnselected from '../assets/icon/HomeUnselected';
import MemoHomeSelected from '../assets/icon/HomeSelected';
import MemoFeedSelected from '../assets/icon/FeedSelected';
import MemoFeedUnselected from '../assets/icon/FeedUnselected';
import MemoNewsUnselected from '../assets/icon/NewsUnselected';
import MemoProfileSelected from '../assets/icon/ProfileSelected';
import MemoProfileUnselected from '../assets/icon/ProfileUnselected';
import { colors } from '../utils/colors';
import { Text } from 'react-native';
import MemoHome from '../assets/icon/Home'
import MemoFeed from '../assets/icon/Feed';
import MemoNews from '../assets/icon/News';
import MemoProfileIcon from '../assets/icon/Profile';

const Tab = createBottomTabNavigator();

function HomeBottomTabs() {
  const customTabBarStyle = {
    activeTintColor: '#23C5B6',
    inactiveTintColor: 'gray',
    style: {backgroundColor: 'white'},
  };
  return (
    <Tab.Navigator tabBarOptions={customTabBarStyle}
      tabBarOptions={{
        showLabel : true,
        activeTintColor : colors.holytosca,
        inactiveTintColor : colors.gray1
      }}
      screenOptions={({route, navigation}) => {
        console.log(navigation)
        return {
          activeTintColor : colors.holytosca,
          tabBarLabel : () => <Text style={{
            fontSize : 6,
            color : colors.holytosca,
            marginTop : -12,
            marginBottom : 5,
            alignSelf : 'center'
          }}>{navigation.isFocused() ? "\u2B24" : ""}</Text>
        }
      }}>
      <Tab.Screen
        name="ChannelList"
        component={ChannelListScreen}
        options={{
          activeTintColor : colors.holytosca,
          tabBarIcon: ({color}) => <MemoHome fill={color}/>,
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          activeTintColor : colors.holytosca,
          tabBarIcon: ({color}) => <MemoFeed fill={color}/>
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          activeTintColor : colors.holytosca,
          tabBarIcon: ({focused, color}) => <MemoNews fill={color}/> ,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          activeTintColor : colors.holytosca,
          tabBarIcon: ({focused}) => <MemoProfileIcon/>
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeBottomTabs;
