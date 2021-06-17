import * as React from 'react';
import {View, Text} from 'react-native';

import analytics from '@react-native-firebase/analytics';

const NewsScreen = (props) => {
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed',
    });
  }, []);
  return (
    <View>
      <Text>News Screen</Text>
    </View>
  );
};

export default NewsScreen;
