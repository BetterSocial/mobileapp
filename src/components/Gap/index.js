import * as React from 'react';
import {View} from 'react-native';

const Gap = ({style, width, height}) => {
  return <View style={[{width: width, height: height}, style]} />;
};

export default Gap;
