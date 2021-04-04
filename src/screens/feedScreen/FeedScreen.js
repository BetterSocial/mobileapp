import React from 'react';
import {View, Text} from 'react-native';
import {ButtonNewPost} from '../../components/Button';

const FeedScreen = (props) => {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <Text>Feed Screen</Text>
      <ButtonNewPost />
    </View>
  );
};

export default FeedScreen;
