import * as React from 'react';
import {Text} from 'react-native';

const TopicFragmentScreen = ({navigation}) => {
  React.useEffect(() => {
    navigation.setOptions({
      title: 'Topics (3)',
    });
  }, []);
  return <Text>Topic</Text>;
};

export default TopicFragmentScreen;
