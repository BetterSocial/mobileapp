import React from 'react';
import {Text, View} from 'react-native';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import VirtualizedView from '../../src/components/VirtualizedView';

jest.mock('react-native', () => {
  const React = require('react');
  const View = React.View;

  function MockedFlatList(props) {
    const items = props.data.map((item, index) => {
      const key = props.keyExtractor(item, index);
      return <View key={key}>{props.renderItem({item, index})}</View>;
    });
    return <View>{items}</View>;
  }
  function MockedText() {
    const RealComponent = jest.requireActual('Text');
    class Text extends React.Component {
      render() {
        return React.createElement('Text', this.props, this.props.children);
      }
    }
    Text.propTypes = RealComponent.propTypes;
    return Text;
  }
  return {
    FlatList: {
      get: () => MockedFlatList,
    },
    Text: {
      get: () => MockedText,
    },
  };
});

configure({adapter: new Adapter()});
describe('component VirtualizedView', () => {
  it('VirtualizedView snapshot', () => {
    const component = shallow(
      <VirtualizedView style={{}} onRefresh={() => {}} refreshing={false}>
        <View>
          <Text>test</Text>
        </View>
      </VirtualizedView>,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('VirtualizedView renders correctly', () => {
    const tree = renderer
      .create(
        <VirtualizedView style={{}} onRefresh={() => {}} refreshing={false}>
          <View>
            <Text>test</Text>
          </View>
        </VirtualizedView>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
