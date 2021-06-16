import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import SlideShow from '../../src/components/SignIn/SlideShow';

configure({adapter: new Adapter()});
describe('component SlideShow', () => {
  it('SlideShow  snapshot', () => {
    const component = shallow(<SlideShow />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SlideShow  renders correctly', () => {
    const tree = renderer.create(<SlideShow />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
