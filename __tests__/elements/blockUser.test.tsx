import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import BlockUser from '../../src/elements/Blocking/BlockUser';

configure({adapter: new Adapter()});
jest.useFakeTimers();
describe('component BlockUser', () => {
  it('BlockUser snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <BlockUser
        username="user test"
        onSelect={() => {}}
        refBlockUser={myRef}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('BlockUser renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const tree = renderer
      .create(
        <BlockUser
          username="user test"
          onSelect={() => {}}
          refBlockUser={myRef}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
