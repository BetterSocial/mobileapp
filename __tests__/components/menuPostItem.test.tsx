import React from 'react';
import {View, Text} from 'react-native';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import MenuPostItem from '../../src/components/MenuPostItem';

configure({adapter: new Adapter()});
describe('component MenuPostItem', () => {
  it('MenuPostItem snapshot', () => {
    const component = shallow(
      <MenuPostItem
        icon={<View />}
        label="Menu Test"
        labelStyle={{}}
        onPress={{}}
        topic={true}
        listTopic={<Text>Test</Text>}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('MenuPostItem renders correctly', () => {
    const tree = renderer
      .create(
        <MenuPostItem
          icon={<View />}
          label="Menu Test"
          labelStyle={{}}
          onPress={{}}
          topic={true}
          listTopic={<Text>Test</Text>}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
