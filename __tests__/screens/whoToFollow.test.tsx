import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import WhotoFollow from '../../src/screens/WhotoFollow';

configure({adapter: new Adapter()});
jest.useFakeTimers();

describe('component WhotoFollow', () => {
  it('WhotoFollow snapshot', () => {
    const component = shallow(<WhotoFollow />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('WhotoFollow renders correctly', () => {
    const tree = renderer.create(<WhotoFollow />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
