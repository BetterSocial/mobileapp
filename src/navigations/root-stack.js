import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Home from '../screens/HomeTest';
import ChooseUsername from '../screens/Onboarding/ChooseUsername';
import SignIn from '../screens/SignIn/SignIn';
import SplashScreen from '../screens/SplaceScreen/SplaceScreen';
import LocalComunity from '../screens/LocalComunity';

const Stack = createStackNavigator();
const RootStact = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
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
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RootStact;
