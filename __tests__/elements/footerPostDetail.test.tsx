import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Footer from '../../src/elements/PostDetail/Footer';

configure({adapter: new Adapter()});

describe('component Footer', () => {
  it('Footer snapshot', () => {
    const component = shallow(<Footer onBlock={() => {}} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Footer renders correctly', () => {
    const tree = renderer.create(<Footer onBlock={() => {}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
