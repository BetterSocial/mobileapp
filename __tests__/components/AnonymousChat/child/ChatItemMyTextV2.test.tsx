import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {render} from '@testing-library/react-native';

import ChatItemMyTextV2 from '../../../../src/components/AnonymousChat/child/ChatItemMyTextV2';
import {ChatStatus} from '../../../../types/database/schema/ChannelList.types';

describe('TESTING ChatItemTargetText', () => {
  const image =
    'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg';

  it('RENDER not continuous should match snapshot', () => {
    const {toJSON} = render(
      <ChatItemMyTextV2
        AnonymousImage={<FastImage source={{uri: image}} />}
        status={ChatStatus.SENT}
        chatType="ANON_PM"
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
        AnonymousImage={<FastImage source={{uri: image}} />}
        status={ChatStatus.SENT}
        chatType="ANON_PM"
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
