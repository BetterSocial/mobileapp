import * as React from 'react';

import {render, cleanup, fireEvent} from '@testing-library/react-native';
import Tabbar from '../../../src/components/Tabbar';
import {act} from 'react-test-renderer';
describe('it should run correctly', () => {
  afterEach(() => {
    cleanup();
  });

  const navigation = {
    emit: jest.fn().mockImplementation(() => ({defaultPrevented: false})),
    navigate: jest.fn()
  };
  it('should match snapshot', () => {
    const state = {
      routes: [{name: 'Home', key: 'home'}]
    };
    const descriptors = {
      home: {
        options: {
          tabBarLabel: 'Home'
        }
      }
    };
    const {toJSON} = render(
      <Tabbar state={state} descriptors={descriptors} navigation={navigation} position={1} />
    );
    expect(toJSON).toMatchSnapshot();
  });
  it('onTabBarPress should run correctly', () => {
    const state = {
      routes: [{name: 'Home', key: 'home'}]
    };
    const descriptors = {
      home: {
        options: {
          tabBarLabel: 'Home'
        }
      }
    };
    const {getByTestId} = render(
      <Tabbar state={state} descriptors={descriptors} navigation={navigation} position={1} />
    );
    act(() => {
      fireEvent.press(getByTestId('tabbarPress'));
    });
    expect(navigation.emit).toHaveBeenCalled();
  });
});
