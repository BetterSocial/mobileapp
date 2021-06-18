import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Profile from '../../src/elements/PostDetail/Profile';

configure({adapter: new Adapter()});

describe('component Profile', () => {
  it('Profile snapshot', () => {
    const component = shallow(<Profile />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Profile renders correctly', () => {
    const tree = renderer.create(<Profile />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
