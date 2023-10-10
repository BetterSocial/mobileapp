import * as React from 'react';
import {TouchableOpacity} from 'react-native';

const CustomPressable = (props) => {
  const {children, onPress, style, ...otherProps} = props;
  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
      {children}
    </TouchableOpacity>
  );
};

export default CustomPressable;
