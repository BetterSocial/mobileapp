/* eslint-disable import/no-mutable-exports */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable react/display-name */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {act, fireEvent, render} from '@testing-library/react-native';

import ChatItemMyTextV2 from '../../../../src/components/AnonymousChat/child/ChatItemMyTextV2';
import {Context} from '../../../../src/context';
import {DEFAULT_PROFILE_PIC_PATH, MESSAGE_TYPE_REGULAR} from '../../../../src/utils/constants';
import {SIGNED} from '../../../../src/hooks/core/constant';

export let setReplyPreview;
export let contextValue;
export const timestamp = new Date().toISOString();

export const setupTests = () => {
  setReplyPreview = jest.fn();
  contextValue = {
    chat: [{replyTarget: null}, setReplyPreview],
    profile: [{myProfile: {}}]
  };
};

export const renderWithProvider = (Component, props) => {
  return render(
    <Context.Provider value={contextValue}>
      <Component {...props} />
    </Context.Provider>
  );
};

export const expectedReplyPreview = {
  payload: {
    id: 'id986',
    message: 'message',
    message_type: MESSAGE_TYPE_REGULAR,
    chatType: SIGNED,
    updated_at: timestamp,
    user: {username: 'username'},
    attachments: []
  },
  type: 'SET_REPLY_TARGET'
};

export const avatar = (
  <FastImage
    style={{height: 24, width: 24, borderRadius: 12}}
    source={{uri: DEFAULT_PROFILE_PIC_PATH}}
  />
);

global.__reanimatedWorkletInit = jest.fn();
jest.spyOn(React, 'useRef').mockReturnValue({current: {close: jest.fn()}});

beforeEach(() => {
  setupTests();
});

jest.mock('react-native-compressor', () => {
  return {
    compress: jest.fn(() => 'file:///imag.jpg')
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderChatItemMyTextV2 = (isContinous = false) =>
  renderWithProvider(ChatItemMyTextV2, {
    avatar,
    username: 'username',
    isContinuous: isContinous,
    message: 'message',
    time: timestamp,
    chatType: SIGNED,
    messageType: 'regular',
    data: expectedReplyPreview.payload,
    attachments: []
  });

describe('TESTING ChatItemMyTextV2', () => {
  it('should call setReplyPreview when swiped', () => {
    const {getByTestId} = renderChatItemMyTextV2();
    act(() => {
      fireEvent(getByTestId('swipeable'), 'onSwipeableOpen', 'left');
    });
    expect(setReplyPreview).toHaveBeenCalledWith(expectedReplyPreview);
  });

  it('should display the username and time when isContinuous is false', () => {
    const {getByText, getByTestId} = renderChatItemMyTextV2();
    expect(getByText('username')).toBeTruthy();
    expect(getByTestId('timestamp')).toBeTruthy();
  });

  it('should not display the username and time when isContinuous is true', () => {
    const {queryByText} = renderChatItemMyTextV2(true);
    expect(queryByText('username')).toBeNull();
    expect(queryByText('time')).toBeNull();
  });

  it('should display the message', () => {
    const {getByText} = renderChatItemMyTextV2();
    expect(getByText('message')).toBeTruthy();
  });

  it('should match snapshot', () => {
    const tree = renderChatItemMyTextV2().toJSON();
    expect(tree).toMatchSnapshot();
  });
});
