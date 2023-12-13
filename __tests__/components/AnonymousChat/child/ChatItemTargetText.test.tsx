/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {fireEvent, render} from '@testing-library/react-native';

import ChatItemTargetText from '../../../../src/components/AnonymousChat/child/ChatItemTargetText';
import {Context} from '../../../../src/context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../../src/utils/constants';

global.__reanimatedWorkletInit = jest.fn();
jest.spyOn(React, 'useRef').mockReturnValue({current: {close: jest.fn()}});
jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual('react-native-reanimated'),
  useSharedValue: jest.fn(() => ({value: 0})),
  useAnimatedStyle: jest.fn(() => ({})),
  View: require('react-native/Libraries/Components/View/View').View,
  Animated: {
    View: require('react-native/Libraries/Components/View/View').View
  }
}));
jest.mock('react-native-gesture-handler', () => {
  const originalModule = jest.requireActual('react-native-gesture-handler');
  const {View} = require('react-native');
  const React = require('react');

  return {
    ...originalModule,
    Swipeable: React.forwardRef(({children, ...props}, ref) => {
      React.useImperativeHandle(ref, () => ({
        close: jest.fn()
      }));

      return <View {...props}>{children}</View>;
    })
  };
});

jest.mock('react-native-compressor', () => {
  return {
    compress: jest.fn(() => 'file:///imag.jpg')
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('TESTING ChatItemTargetText', () => {
  const avatar = (
    <FastImage
      style={{height: 24, width: 24, borderRadius: 12}}
      source={{uri: DEFAULT_PROFILE_PIC_PATH}}
    />
  );

  it('should call setReplyPreview when swiped to the left', () => {
    const setReplyPreview = jest.fn();
    const contextValue = {
      chat: [{replyTarget: null}, setReplyPreview],
      profile: [{myProfile: {}}]
    };

    const {getByTestId} = render(
      <Context.Provider value={contextValue}>
        <ChatItemTargetText
          avatar={avatar}
          username="username"
          isContinuous={false}
          message="message"
          time="time"
          chatType="SIGNED"
          messageType="regular"
          data={{}}
        />
      </Context.Provider>
    );

    fireEvent(getByTestId('swipeable'), 'onSwipeableOpen', 'left');

    expect(setReplyPreview).toHaveBeenCalled();
  });

  it('should match snapshot', () => {
    const setReplyPreview = jest.fn();
    const contextValue = {
      chat: [{replyTarget: null}, setReplyPreview],
      profile: [{myProfile: {}}]
    };

    const tree = render(
      <Context.Provider value={contextValue}>
        <ChatItemTargetText
          avatar={avatar}
          username="username"
          isContinuous={false}
          message="message"
          time="time"
          chatType="SIGNED"
          messageType="regular"
          data={{}}
        />
      </Context.Provider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
