import * as React from 'react';
import {render} from '@testing-library/react-native';

import ChatItemMyTextV2 from '../../../../src/components/AnonymousChat/child/ChatItemMyTextV2';

describe('TESTING ChatItemTargetText', () => {
  it('RENDER not continuous should match snapshot', () => {
    const {toJSON} = render(
      <ChatItemMyTextV2
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
      <ChatItemMyTextV2
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
