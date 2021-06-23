import * as React from 'react';
import {View} from 'react-native';

const Gap = ({width, height, style}) => {
  return <View style={[style, {width: width, height: height}]} />;
};

export default Gap;
