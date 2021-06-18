import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Gap from '../../src/components/Gap';

configure({adapter: new Adapter()});

describe('component gap', () => {
  it('gap snapshot', () => {
    const component = shallow(<Gap style={{width: 20}} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('gap renders correctly', () => {
    const tree = renderer.create(<Gap style={{width: 20}} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
