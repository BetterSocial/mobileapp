import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import {Input} from '../../src/components/Input';

configure({adapter: new Adapter()});
describe('component Input', () => {
  it('Input snapshot', () => {
    const component = shallow(
      <Input
        placeholder="Test"
        onChangeText={() => {}}
        value="Test Input"
        autoCapitalize="none"
        autoCorrect={false}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Input renders correctly', () => {
    const tree = renderer
      .create(
        <Input
          placeholder="Test"
          onChangeText={() => {}}
          value="Test Input"
          autoCapitalize="none"
          autoCorrect={false}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
