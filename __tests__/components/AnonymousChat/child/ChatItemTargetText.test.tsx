import * as React from 'react';
import {render} from '@testing-library/react-native';

import ChatItemTargetText from '../../../../src/components/AnonymousChat/child/ChatItemTargetText';

describe('TESTING ChatItemTargetText', () => {
  it('RENDER not continuous should match snapshot', () => {
    const {toJSON} = render(
      <ChatItemTargetText
        avatar="https://www.google.com"
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
      <ChatItemTargetText
        avatar="https://www.google.com"
        username="username"
        isContinuous={true}
        message="message"
        time="time"
      />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
