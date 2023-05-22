import * as React from 'react';
import {render} from '@testing-library/react-native';

import AnonymousUsername from '../../../src/components/AnonymousUsername';

describe('AnonymousUsername test', () => {
  it('Should match version 1 snapshot', () => {
    const {toJSON, getByTestId} = render(
      <AnonymousUsername version={1} anonUserInfo={{colorName: 'red', emojiName: 'hourse'}} />
    );
    expect(toJSON).toMatchSnapshot();
    console.log(getByTestId('v1').props, 'lapuk');
    expect(getByTestId('v1').props.children).toEqual('Anonymous');
  });

  it('Should match version 1 snapshot', () => {
    const {toJSON, getByTestId} = render(
      <AnonymousUsername version={2} anonUserInfo={{colorName: 'red', emojiName: 'horse'}} />
    );
    expect(toJSON).toMatchSnapshot();
    expect(getByTestId('v2').props.children).toEqual('red horse');

  });
});
