import * as React from 'react';
import {cleanup, render} from '@testing-library/react-native';
import {useState} from 'react';

import NetworkStatusIndicator from '../../../src/components/NetworkStatusIndicator';

jest.useFakeTimers();

const mockNetInfo = jest.fn().mockImplementation({isInternetReachable: false});
const mockAddEventListener = jest.fn();

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: () => ({
    netInfo: mockNetInfo
  }),
  addEventListener: jest.fn().mockImplementation(() => mockAddEventListener)
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));

describe('Testing Network Status Indicator Component', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });
  afterEach(cleanup);

  it('Match Snapshot', () => {
    const {toJSON} = render(<NetworkStatusIndicator />);
    expect(toJSON).toMatchSnapshot();
  });

  it('props hide should run correctly', () => {
    const {getAllByTestId} = render(<NetworkStatusIndicator hide={true} />);
    expect(getAllByTestId('isHide')).toHaveLength(1);
    expect(mockAddEventListener).toHaveBeenCalled();
  });
});
