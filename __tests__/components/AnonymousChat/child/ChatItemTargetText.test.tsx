/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {fireEvent, render} from '@testing-library/react-native';

import ChatItemTargetText from '../../../../src/components/AnonymousChat/child/ChatItemTargetText';
import {Context} from '../../../../src/context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../../src/utils/constants';

jest.spyOn(React, 'useRef').mockReturnValue({current: {close: jest.fn()}});

const avatar = (
  <FastImage
    style={{height: 24, width: 24, borderRadius: 12}}
    source={{uri: DEFAULT_PROFILE_PIC_PATH}}
  />
);

let setReplyPreview;
let contextValue;

beforeEach(() => {
  setReplyPreview = jest.fn();
  contextValue = {
    chat: [{replyTarget: null}, setReplyPreview],
    profile: [{myProfile: {}}]
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderChatItemTargetText = () =>
  render(
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

describe('TESTING ChatItemTargetText', () => {
  it('should call setReplyPreview when swiped to the left', () => {
    const {getByTestId} = renderChatItemTargetText();
    fireEvent(getByTestId('swipeable'), 'onSwipeableOpen', 'left');
    expect(setReplyPreview).toHaveBeenCalled();
  });

  it('should match snapshot', () => {
    const tree = renderChatItemTargetText().toJSON();
    expect(tree).toMatchSnapshot();
  });
});
