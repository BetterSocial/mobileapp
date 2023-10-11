import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import Tabbar from '../../../src/components/Tabbar';

describe('Tabbar should run correctly', () => {
  const state = {
    routes: [{key: 'user'}, {key: 'communities'}],
    index: 1
  };
  const descriptors = {
    user: {
      options: {
        tabBarLabel: 'User'
      }
    },
    communities: {
      options: {
        tabBarLabel: 'Communities'
      }
    }
  };
  it('tabbar should match with snapshot', () => {
    const navigation = {
      emit: jest.fn()
    };
    const {toJSON} = render(
      <Tabbar state={state} navigation={navigation} descriptors={descriptors} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('tabbar onPress should run correctly', async () => {
    const navigation = {
      emit: jest.fn().mockImplementation(() => ({
        defaultPrevented: false
      })),
      navigate: jest.fn()
    };
    const {getByTestId} = render(
      <Tabbar state={state} navigation={navigation} descriptors={descriptors} />
    );
    await fireEvent.press(getByTestId('btn1'));
    expect(navigation.emit).toHaveBeenCalled();
    await fireEvent.press(getByTestId('btn0'));
    expect(navigation.navigate).toHaveBeenCalled();
  });
});
