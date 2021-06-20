import React from 'react';
import {View} from 'react-native';

const Gap = ({style, width, height}) => {
  return <View style={[style, {width: width, height: height}]} />;
};

export default Gap;
