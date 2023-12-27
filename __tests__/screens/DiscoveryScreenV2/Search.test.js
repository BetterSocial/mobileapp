import * as React from 'react';
import renderer from 'react-test-renderer';
import {Pressable, View} from 'react-native';
import {cleanup, fireEvent, render} from '@testing-library/react-native';

import DiscoverySearch from '../../../src/screens/DiscoveryScreenV2/elements/Search';
import TestIdConstant from '../../../src/utils/testId';
import {Context} from '../../../src/context/Store';
import {discoveryState} from '../../../src/context/reducers/discoveryReducer';
import {generalComponentState} from '../../../src/context/reducers/generalComponentReducer';

beforeEach(cleanup);

jest.useFakeTimers('modern');

describe('Testing Discovery Screen V2', () => {
  describe('Testing Discovery Search Bar', () => {
    it('Match Snapshot', () => {
      const contextValue = {
        generalComponent: [generalComponentState, () => jest.fn()],
        discovery: [discoveryState, () => jest.fn()]
      };

      const tree = renderer
        .create(
          <Context.Provider value={contextValue}>
            <DiscoverySearch />
          </Context.Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('Change text when given', () => {
      const discoveryDispatch = jest.fn();
      const generalDispatch = jest.fn();
      const setSearchText = jest.fn();

      const contextValue = {
        generalComponent: [generalComponentState, generalDispatch],
        discovery: [discoveryState, discoveryDispatch]
      };

      const {getByTestId, getByText} = render(
        <Context.Provider value={contextValue}>
          <DiscoverySearch setSearchText={setSearchText} />
        </Context.Provider>
      );

      fireEvent.changeText(getByTestId(TestIdConstant.discoveryScreenSearchBar), 'Coba');
      expect(setSearchText).toBeCalled();
    });
  });
});
