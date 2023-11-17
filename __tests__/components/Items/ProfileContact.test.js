import * as React from 'react';
import {cleanup, render} from '@testing-library/react-native';

import ProfileContact from '../../../src/components/Items/ProfileContact';
import {SIGNED} from '../../../src/hooks/core/constant';

jest.mock('react-native/Libraries/Pressability/usePressability');

describe('ProfileContact component should run correctly', () => {
  afterEach(cleanup);

  it('should match snapshot', () => {
    const onPress = jest.fn();
    const {toJSON, getByTestId, getAllByTestId} = render(
      <ProfileContact
        photo={'https://image.jpg'}
        fullname="Agita Firstawan"
        onPress={onPress}
        select={true}
        from={SIGNED}
      />
    );
    expect(toJSON).toMatchSnapshot();
    expect(getByTestId('image').props.source).toEqual({uri: 'https://image.jpg'});
    expect(getByTestId('name').props.children[0]).toEqual('Agita Firstawan');
    const {getByTestId: getUndefinedPhoto} = render(
      <ProfileContact fullname="Agita Firstawan" onPress={onPress} select={false} />
    );
    expect(getUndefinedPhoto('image').props.source).toEqual({uri: undefined});
    expect(getAllByTestId('selected')).toHaveLength(1);
  });
});
