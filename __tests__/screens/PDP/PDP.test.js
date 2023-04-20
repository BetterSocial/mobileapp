import React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import PDP from '../../../src/screens/PostPageDetail';
import Store from '../../../src/context/Store';

jest.mock('react-native-activity-feed/node_modules/react-native-image-crop-picker', () => ({
  openPicker: jest.fn()
}));

jest.mock('../../../src/hooks/useAfterInteractions', () => ({
  useAfterInteractions: () => ({
    transitionRef: {current: {animateNextTransition: jest.fn()}},
    interactionsComplete: true
  })
}));
const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      isCaching: jest.fn().mockImplementation(true)
    }
  }),
  useNavigation: () => ({
    goBack: mockedGoBack
  })
}));

describe('PDP page should run correctly', () => {
  const props = {
    route: {
      params: {
        isCaching: false,
        refreshCache: jest.fn()
      }
    }
  };

  afterEach(cleanup);

  it('should be same as snapshot', () => {
    const {toJSON} = render(<PDP {...props} />, {wrapper: Store});
    expect(toJSON).toMatchSnapshot();
  });

  it('refresh cache should call if refreshCache params exist', () => {
    expect(props.route.params.refreshCache).toHaveBeenCalled();
  });
});
