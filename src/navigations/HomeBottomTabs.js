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

const Tab = createBottomTabNavigator();

function HomeBottomTabs() {
  const customTabBarStyle = {
    activeTintColor: '#23C5B6',
    inactiveTintColor: 'gray',
    style: {backgroundColor: 'white'},
  };
  return (
    <Tab.Navigator tabBarOptions={customTabBarStyle}>
      <Tab.Screen
        name="ChannelList"
        component={ChannelListScreen}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({focused}) => {
            if (focused) {
              return <MemoHomeSelected />;
            } else {
              return <MemoHomeUnselected />;
            }
          },
        }}
      />
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({focused}) => {
            if (focused) {
              return <MemoFeedSelected />;
            } else {
              return <MemoFeedUnselected />;
            }
          },
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: ({focused}) => {
            if (focused) {
              return <MemoNewsSelected />;
            } else {
              return <MemoNewsUnselected />;
            }
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => {
            if (focused) {
              return <MemoProfileSelected />;
            } else {
              return <MemoProfileUnselected />;
            }
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeBottomTabs;
