import React from 'react';
import { View } from 'react-native';
import { shallow, configure } from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import SlideShow from '../../src/components/SignIn/SlideShow';

jest.mock("react-native", () => {
  const React = require('react');
  const View = React.View;

  function MockedFlatList(props) {
    const items = props.data.map((item, index) => {
      const key = props.keyExtractor(item, index);
      return (
        <View key={key}>
          {props.renderItem({ item, index })}
        </View>
      );
    });
    return (
      <View>
        {items}
      </View>
    );
  }
  return {
    Dimensions: {
      get: (data: string) => {
        if (data === 'window') {
          return {
            width: 200,
            height: 200,
          }
        }
      }
    },
    FlatList: {
      get: () => MockedFlatList,
    }
  }
});

configure({ adapter: new Adapter() });
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
