import React from 'react';
import { View, Text } from 'react-native';
import Navigation from './elements/Navigation';

const TopicPageScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Navigation domain={'Bali'} />
      <View style={{ flex: 1 }}>
        <Text>Not implement, in progress</Text>
      </View>
    </View>
  );
};
export default TopicPageScreen;
