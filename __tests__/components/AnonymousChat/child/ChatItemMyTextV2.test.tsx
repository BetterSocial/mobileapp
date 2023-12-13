/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable react/display-name */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {act, fireEvent, render} from '@testing-library/react-native';

import ChatItemMyTextV2 from '../../../../src/components/AnonymousChat/child/ChatItemMyTextV2';
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

describe('TESTING ChatItemMyTextV2', () => {
  const avatar = (
    <FastImage
      style={{height: 24, width: 24, borderRadius: 12}}
      source={{uri: DEFAULT_PROFILE_PIC_PATH}}
    />
  );

  it('should call setReplyPreview when swiped', () => {
    const setReplyPreview = jest.fn();
    const contextValue = {
      chat: [{replyTarget: null}, setReplyPreview],
      profile: [{myProfile: {}}]
    };

    const {getByTestId} = render(
      <Context.Provider value={contextValue}>
        <ChatItemMyTextV2
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

    act(() => {
      fireEvent(getByTestId('swipeable'), 'onSwipeableOpen', 'left');
    });

    expect(setReplyPreview).toHaveBeenCalled();
  });

  it('should display the username and time when isContinuous is false', () => {
    const contextValue = {
      chat: [{replyTarget: null}, jest.fn()],
      profile: [{myProfile: {}}]
    };

    const {getByText} = render(
      <Context.Provider value={contextValue}>
        <ChatItemMyTextV2
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

    expect(getByText('username')).toBeTruthy();
    expect(getByText('time')).toBeTruthy();
  });

  it('should not display the username and time when isContinuous is true', () => {
    const contextValue = {
      chat: [{replyTarget: null}, jest.fn()],
      profile: [{myProfile: {}}]
    };

    const {queryByText} = render(
      <Context.Provider value={contextValue}>
        <ChatItemMyTextV2
          avatar={avatar}
          username="username"
          isContinuous={true}
          message="message"
          time="time"
          chatType="SIGNED"
          messageType="regular"
          data={{}}
        />
      </Context.Provider>
    );

    expect(queryByText('username')).toBeNull();
    expect(queryByText('time')).toBeNull();
  });

  it('should display the message', () => {
    const contextValue = {
      chat: [{replyTarget: null}, jest.fn()],
      profile: [{myProfile: {}}]
    };

    const {getByText} = render(
      <Context.Provider value={contextValue}>
        <ChatItemMyTextV2
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

    expect(getByText('message')).toBeTruthy();
  });

  it('should match snapshot', () => {
    const setReplyPreview = jest.fn();
    const contextValue = {
      chat: [{replyTarget: null}, setReplyPreview],
      profile: [{myProfile: {}}]
    };

    const tree = render(
      <Context.Provider value={contextValue}>
        <ChatItemMyTextV2
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
