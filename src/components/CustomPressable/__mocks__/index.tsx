import * as React from 'react';
import {StyleProp, TouchableOpacity, ViewProps} from 'react-native';

type CustomPressableProps = {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewProps>;
};

const CustomPressable = (props: CustomPressableProps) => {
  const {children, onPress, ...otherProps} = props;
  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
      {children}
    </TouchableOpacity>
  );
};

export default CustomPressable;
