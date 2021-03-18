import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ChooseUsername from '../screens/Onboarding/ChooseUsername';
import SignIn from '../screens/SignIn/SignIn';
import SplashScreen from '../screens/SplaceScreen/SplaceScreen';

const Stack = createStackNavigator();
const RootStact = () => {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
};

export default RootStact;
