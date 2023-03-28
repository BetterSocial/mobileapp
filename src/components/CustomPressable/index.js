import * as React from 'react';
import {Pressable} from 'react-native';

import {colors} from '../../utils/colors';

/**
 * @typedef {import('react-native').PressableProps} CustomPressableProps
 */

/**
 *
 * @param {CustomPressableProps} props
 * @returns
 */
const CustomPressable = (props) => {
  const {children, onPress, style, ...otherProps} = props;
  return (
    <Pressable
      onPress={onPress}
      style={style}
      android_ripple={{
        color: colors.gray1,
        borderless: false,
        radius: 100
      }}
      {...otherProps}>
      {children}
    </Pressable>
  );
};

export default CustomPressable;
