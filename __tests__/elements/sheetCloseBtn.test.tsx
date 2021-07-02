import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import SheetCloseBtn from '../../src/screens/CreatePost/elements/SheetCloseBtn';

configure({adapter: new Adapter()});
// jest.useFakeTimers();

describe('component SheetCloseBtn', () => {
  it('SheetCloseBtn snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <SheetCloseBtn
        goBack={() => {}}
        continueToEdit={() => {}}
        backRef={myRef}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SheetCloseBtn renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };

    const tree = renderer
      .create(
        <SheetCloseBtn
          goBack={() => {}}
          continueToEdit={() => {}}
          backRef={myRef}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
