import * as React from 'react';
import renderer from 'react-test-renderer';
import {render} from '@testing-library/react-native';

import AnonymousAvatar from '../../../src/components/AnonymousAvatar';

describe('AnonymousAvatar test', () => {
  it('Should match version 1 snapshot', () => {
    const toJSON = renderer.create(<AnonymousAvatar version={1} radius={15} />).toJSON();
    expect(toJSON).toMatchSnapshot();
  });

  it('Should match version 2 snapshot', () => {
    const toJSON = renderer
      .create(
        <AnonymousAvatar
          version={2}
          anonUserInfo={{
            colorCode: '#000000',
            emojiCode: '😀'
          }}
          radius={15}
          emojiRadius={10}
        />
      )
      .toJSON();
    expect(toJSON).toMatchSnapshot();
  });

  it('Should render the correct emoji', () => {
    const {queryByText} = render(
      <AnonymousAvatar
        version={2}
        anonUserInfo={{
          colorCode: '#000000',
          emojiCode: '😀'
        }}
        radius={15}
        emojiRadius={10}
      />
    );

    expect(queryByText('😀')).toBeTruthy();
  });
});
