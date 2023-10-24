import React from 'react';
import renderer from 'react-test-renderer';
import {cleanup, fireEvent, render} from '@testing-library/react-native';

import DummyLogin from '../../../src/components/DevDummyLogin';
import Store, {Context} from '../../../src/context/Store';
import {myProfileState} from '../../../src/context/reducers/myProfileReducer';
import {usersState} from '../../../src/context/reducers/userReducer';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({goBack: jest.fn(), navigate: mockNavigate}),
  useRoute: () => ({
    params: {}
  })
}));

jest.mock('../../../src/utils/getstream/ClientGetStram', () => ({
  useClientGetstream: () => ({
    create: jest.fn()
  })
}));

jest.mock('react-native-config', () => ({
  ENABLE_DEV_ONLY_FEATURE: 'true'
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({children}) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({children}) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset)
  };
});

jest.mock('recoil', () => ({
  useRecoilState: () => [{}, jest.fn()],
  atom: jest.fn(),
  useSetRecoilState: () => jest.fn()
}));

describe('DummyLogin should run correctly', () => {
  afterEach(cleanup);
  it('should match snapshot', () => {
    const contextValue = {
      users: [usersState, () => jest.fn()],
      profile: [myProfileState, () => jest.fn()]
    };

    const reset = jest.fn();
    const {toJSON} = renderer.create(
      <Context.Provider value={contextValue}>
        <DummyLogin resetClickTime={reset} />;
      </Context.Provider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('closeDummy login should run correctly', () => {
    const reset = jest.fn();
    const {getByTestId} = render(<DummyLogin resetClickTime={reset} />, {wrapper: Store});
    fireEvent.press(getByTestId('closedemo'));
    expect(reset).toHaveBeenCalled();
  });
});
