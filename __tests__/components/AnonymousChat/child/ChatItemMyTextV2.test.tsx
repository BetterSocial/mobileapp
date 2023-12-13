/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable react/display-name */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {act, fireEvent, render} from '@testing-library/react-native';

import ChatItemMyTextV2 from '../../../../src/components/AnonymousChat/child/ChatItemMyTextV2';
import {Context} from '../../../../src/context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../../src/utils/constants';
import {SIGNED} from '../../../../src/hooks/core/constant';

jest.spyOn(React, 'useRef').mockReturnValue({current: {close: jest.fn()}});

const avatar = (
  <FastImage
    style={{height: 24, width: 24, borderRadius: 12}}
    source={{uri: DEFAULT_PROFILE_PIC_PATH}}
  />
);

let setReplyPreview;
let contextValue;
let timestamp;

beforeEach(() => {
  setReplyPreview = jest.fn();
  timestamp = new Date().toISOString();
  contextValue = {
    chat: [{replyTarget: null}, setReplyPreview],
    profile: [{myProfile: {}}]
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderChatItemMyTextV2 = (isContinous = false) =>
  render(
    <Context.Provider value={contextValue}>
      <ChatItemMyTextV2
        avatar={avatar}
        username="username"
        isContinuous={isContinous}
        message="message"
        time={timestamp}
        chatType={SIGNED}
        messageType="regular"
        data={{
          id: 'id986',
          user: {username: 'username'},
          message: 'message',
          message_type: 'regular',
          updated_at: timestamp,
          chatType: SIGNED
        }}
      />
    </Context.Provider>
  );

describe('TESTING ChatItemMyTextV2', () => {
  it('should call setReplyPreview when swiped', () => {
    const {getByTestId} = renderChatItemMyTextV2();
    const expected = {
      payload: {
        id: 'id986',
        message: 'message',
        message_type: 'regular',
        chatType: 'SIGNED',
        updated_at: timestamp,
        user: {username: 'username'}
      },
      type: 'SET_REPLY_TARGET'
    };
    act(() => {
      fireEvent(getByTestId('swipeable'), 'onSwipeableOpen', 'left');
    });
    expect(setReplyPreview).toHaveBeenCalledWith(expected);
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
