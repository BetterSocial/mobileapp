import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import BlockDomain from '../../src/elements/Blocking/BlockDomain';

configure({adapter: new Adapter()});
jest.useFakeTimers();
describe('component BlockDomain', () => {
  it('BlockDomain snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <BlockDomain
        domain="domain.com"
        onSelect={() => {}}
        refBlockUser={myRef}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('BlockDomain renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const tree = renderer
      .create(
        <BlockDomain
          domain="domain.com"
          onSelect={() => {}}
          refBlockUser={myRef}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
