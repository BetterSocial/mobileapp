import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Hello from '../screens/Hello';
const Stack = createStackNavigator();
const RootStact = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="halo"
        component={Hello}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RootStact;
