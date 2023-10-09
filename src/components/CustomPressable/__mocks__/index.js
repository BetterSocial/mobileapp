import * as React from 'react';
import {View} from 'react-native';

const CustomPressable = (props) => {
  const {children, onPress, style, ...otherProps} = props;
  return <View {...otherProps}>{children}</View>;
};

export default CustomPressable;
