import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import analytics from '@react-native-firebase/analytics';
const ProfileScreen = (props) => {
  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'ProfileScreen',
      screen_name: 'ProfileScreen',
    });
  }, []);
  return (
    <View>
      <Text>Profile Screen</Text>
    </View>
  );
};

export default ProfileScreen;
