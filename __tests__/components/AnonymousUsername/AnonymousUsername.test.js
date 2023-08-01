import * as React from 'react';
import {render} from '@testing-library/react-native';
import AnonymousUsername from '../../../src/components/AnonymousUsername';

describe('AnonymousUsername should run correctly', () => {
  it('should render correctly', () => {
    const {getAllByTestId} = render(
      <AnonymousUsername anonUserInfo={{colorName: 'red', emojiName: 'cow'}} version={3} />
    );
    expect(getAllByTestId('newVersion')).toHaveLength(1);
  });
});
