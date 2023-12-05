import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {render} from '@testing-library/react-native';

import ChatItemMyTextV2 from '../../../../src/components/AnonymousChat/child/ChatItemMyTextV2';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../../src/utils/constants';

describe('TESTING ChatItemTargetText', () => {
  const avatar = (
    <FastImage
      style={{height: 24, width: 24, borderRadius: 12}}
      source={{uri: DEFAULT_PROFILE_PIC_PATH}}
    />
  );

  it('RENDER not continuous should match snapshot', () => {
    const {toJSON} = render(
      <ChatItemMyTextV2
        avatar={avatar}
        username="username"
        isContinuous={false}
        message="message"
        time="time"
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER continuous should match snapshot', () => {
    const {toJSON} = render(
      <ChatItemMyTextV2
        avatar={avatar}
        username="username"
        isContinuous={true}
        message="message"
        time="time"
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
