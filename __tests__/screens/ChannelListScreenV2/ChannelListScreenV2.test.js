/* eslint-disable react/display-name */
import * as React from 'react';
import {render} from '@testing-library/react-native';

import ChannelListScreenV2 from '../../../src/screens/ChannelListScreenV2';
import Store from '../../../src/context/Store';

jest.mock('react-native/Libraries/Pressability/usePressability');
jest.mock('../../../src/screens/ChannelListScreen', () => {
  return () => <></>;
});

describe('ChannelListScreenV2', () => {
  it('RENDER should match snapshot', () => {
    const {toJSON} = render(<ChannelListScreenV2 />, {wrapper: Store});
    expect(toJSON()).toMatchSnapshot();
  });

  it('RENDER should have two tabs', () => {
    const {findByTestId, findByText} = render(<ChannelListScreenV2 />, {wrapper: Store});
    expect(findByTestId('horizontal-tab-0')).toBeTruthy();
    expect(findByText('as @JohnDoe')).toBeTruthy();
    expect(findByTestId('horizontal-tab-1')).toBeTruthy();
    expect(findByText('as Anonymous')).toBeTruthy();
  });
});
