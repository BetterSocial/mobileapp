import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import SplashScreen from '../screens/SplaceScreen/SplaceScreen';
const Stack = createStackNavigator();
const RootStact = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name="Splash"
        component={SplashScreen}
      />
    </Stack.Navigator>
  );
};

export default RootStact;
