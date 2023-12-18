/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import * as React from 'react';
import {fireEvent} from '@testing-library/react-native';

import ChatItemTargetText from '../../../../src/components/AnonymousChat/child/ChatItemTargetText';
import {SIGNED} from '../../../../src/hooks/core/constant';
import {
  avatar,
  expectedReplyPreview,
  renderWithProvider,
  setReplyPreview,
  setupTests,
  timestamp
} from './ChatItemMyTextV2.test';

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

const renderChatItemTargetText = (isContinous = false) =>
  renderWithProvider(ChatItemTargetText, {
    username: 'username',
    avatar,
    messageType: 'regular',
    message: 'message',
    chatType: SIGNED,
    data: expectedReplyPreview.payload,
    isContinuous: isContinous,
    time: timestamp,
    attachments: []
  });

describe('TESTING ChatItemTargetText', () => {
  it('should call setReplyPreview when swiped to the left', () => {
    const {getByTestId} = renderChatItemTargetText();
    fireEvent(getByTestId('swipeable'), 'onSwipeableOpen', 'left');
    expect(setReplyPreview).toHaveBeenCalledWith(expectedReplyPreview);
  });

  it('should match snapshot', () => {
    const tree = renderChatItemTargetText().toJSON();
    expect(tree).toMatchSnapshot();
  });
});
