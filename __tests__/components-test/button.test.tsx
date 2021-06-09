import React from 'react';
import {shallow, configure} from 'enzyme';
import renderer from 'react-test-renderer';
import ButtonAddMedia from '../../src/components/Button/ButtonAddMedia';
import Adapter from 'enzyme-adapter-react-16';

import toJson from 'enzyme-to-json';
configure({adapter: new Adapter()});
describe('button', () => {
  it('button snapshot', () => {
    const component = shallow(
      <ButtonAddMedia
        onPress={() => {}}
        style={{}}
        label="+add more photos"
        labelStyle={{}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Button renders correctly', () => {
    const tree = renderer
      .create(
        <ButtonAddMedia
          onPress={() => {}}
          style={{}}
          label="+add more photos"
          labelStyle={{}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
