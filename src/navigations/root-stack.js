import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import Home from '../screens/HomeTest';
import ChooseUsername from '../screens/Onboarding/ChooseUsername';
import SignIn from '../screens/SignIn/SignIn';
import SplashScreen from '../screens/SplaceScreen/SplaceScreen';
import LocalComunity from '../screens/LocalComunity';
import Topics from '../screens/Topics';
import WhotoFollow from '../screens/WhotoFollow';
import {StatusBar} from 'react-native';
import CreatePost from '../screens/Post/CreatePost';
import Followings from '../screens/Followings';
import OtherProfile from '../screens/OtherProfile';
import Settings from '../screens/Settings';
import HomeBottomTabs from './HomeBottomTabs';
import {ChannelScreen} from '../screens';

const Stack = createStackNavigator();
const RootStact = () => {
  useEffect(() => {
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBarStyle('dark-content', true);
  }, []);
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="HomeTabs"
        component={HomeBottomTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChannelScreen"
        component={ChannelScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChooseUsername"
        component={ChooseUsername}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LocalComunity"
        component={LocalComunity}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Topics"
        component={Topics}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WhotoFollow"
        component={WhotoFollow}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Followings"
        component={Followings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OtherProfile"
        component={OtherProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RootStact;
