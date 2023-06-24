import * as React from 'react';
import {cleanup, render} from '@testing-library/react-native';
import {useState} from 'react';

import NetworkStatusIndicator from '../../../src/components/NetworkStatusIndicator';

jest.useFakeTimers();

const mockNetInfo = jest.fn().mockImplementation({isInternetReachable: false});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));

describe('Testing Network Status Indicator Component', () => {
  beforeEach(() => {
    useState.mockImplementation(jest.requireActual('react').useState);
  });
  afterEach(cleanup);

  const setup = (mockOverrides) => ({
    addEventListener: jest.fn((callback) => {
      callback({isConnected: false});
      return () => {};
    }),
    ...mockOverrides
  });
  it('Match Snapshot', () => {
    const {toJSON} = render(<NetworkStatusIndicator />);
    expect(toJSON).toMatchSnapshot();
  });

  it('internet not available should occur', () => {
    jest.doMock('@react-native-community/netinfo', () =>
      setup({
        addEventListener: jest.fn((callback) => {
          callback({isConnected: false});
          return () => {};
        })
      })
    );
    const {getAllByTestId} = render(<NetworkStatusIndicator hide={false} />);
    setTimeout(() => {
      expect(getAllByTestId('internet-not-available')).toHaveLength(1);
    }, 4000);
  });

  it('props hide should run correctly', () => {
    jest.doMock('@react-native-community/netinfo', () =>
      setup({
        addEventListener: jest.fn((callback) => {
          callback({isConnected: true});
          return () => {};
        })
      })
    );
    const {getAllByTestId} = render(<NetworkStatusIndicator hide={true} />);
    expect(getAllByTestId('isHide')).toHaveLength(1);
  });
});
