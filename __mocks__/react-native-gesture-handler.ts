/* eslint-disable react/display-name */
import React from 'react';
import {View} from 'react-native';

module.exports = {
  ...jest.requireActual('react-native-gesture-handler'),
  Swipeable: React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      close: jest.fn()
    }));

    // Create a mock component without using JSX
    return React.createElement(View, props, props.children);
  })
};
