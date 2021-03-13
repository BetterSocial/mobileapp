import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import SignIn from '../screens/SignIn/SignIn';
const Stack = createStackNavigator();
const RootStact = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="SignIn"
        component={SignIn}
      />
    </Stack.Navigator>
  );
};

export default RootStact;
