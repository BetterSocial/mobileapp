import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Header from '../../src/components/Header';

configure({adapter: new Adapter()});
describe('component header', () => {
  it('header snapshot', () => {
    const component = shallow(
      <Header
        title="Title Header Test"
        onPress={() => {}}
        titleStyle={{}}
        containerStyle={{}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('header renders correctly', () => {
    const tree = renderer
      .create(
        <Header
          title="Title Header Test"
          onPress={() => {}}
          titleStyle={{}}
          containerStyle={{}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
