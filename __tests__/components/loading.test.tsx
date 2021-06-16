import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Loading from '../../src/components/Loading';

configure({adapter: new Adapter()});
describe('component Loading', () => {
  it('Loading snapshot', () => {
    const component = shallow(<Loading visible={true} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Loading renders correctly', () => {
    const tree = renderer.create(<Loading visible={true} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
