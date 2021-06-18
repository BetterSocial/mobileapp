import * as React from 'react';
import {View, Text} from 'react-native';
import analytics from '@react-native-firebase/analytics';

import {getDomains} from '../../service/domain';
const NewsScreen = (props) => {
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed',
    });
  }, []);

  React.useEffect(() => {
    const initData = async () => {
      let data = await getDomains();
      console.log(data.length);
    };
    initData();
  }, []);

  return (
    <View>
      <Text>News Screen</Text>
    </View>
  );
};

export default NewsScreen;
