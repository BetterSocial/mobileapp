import React from 'react';
import {shallow} from 'enzyme';
import * as renderer from 'react-test-renderer';
import ChooseUsername from '../../src/screens/Onboarding/ChooseUsername';
import {render, fireEvent} from '@testing-library/react-native';
describe('chooseusername test', () => {
  it('add value', async () => {
    const {getByTestId, findByTestId} = render(<ChooseUsername />);
    fireEvent.changeText(getByTestId('usernameInput'), 'ek');
    let test = await findByTestId('wrapUsername');
    console.log(test);
    // expect()
  });
});
