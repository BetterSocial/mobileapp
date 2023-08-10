import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {cleanup, render} from '@testing-library/react-native';

import PDP from '../../../src/screens/PostPageDetail';
import Store from '../../../src/context/Store';

jest.mock('react-native-activity-feed/node_modules/react-native-image-crop-picker', () => ({
  openPicker: jest.fn()
}));

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn()
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

jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({children}) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({children}) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset)
  };
});

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn()
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
    render(
      <SafeAreaProvider>
        <PDP {...props} />
      </SafeAreaProvider>,
      {wrapper: Store}
    );
    expect(props.route.params.refreshCache).toHaveBeenCalled();
  });
});
