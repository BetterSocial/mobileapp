import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ChooseUsername from '../screens/LocalComunity';


const Stack = createStackNavigator();
const RootStact = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChooseUsername"
        component={ChooseUsername}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default RootStact;
