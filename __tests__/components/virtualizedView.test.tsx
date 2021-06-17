import React from 'react';
import {Text} from 'react-native';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import VirtualizedView from '../../src/components/VirtualizedView';

configure({adapter: new Adapter()});
describe('component VirtualizedView', () => {
  it('VirtualizedView snapshot', () => {
    const component = shallow(
      <VirtualizedView style={{}} onRefresh={() => {}} refreshing={false}>
        <Text>test</Text>
      </VirtualizedView>,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('VirtualizedView renders correctly', () => {
    const tree = renderer
      .create(
        <VirtualizedView style={{}} onRefresh={() => {}} refreshing={false}>
          <Text>test</Text>
        </VirtualizedView>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
