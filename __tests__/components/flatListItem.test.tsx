import * as React from 'react';
import {View} from 'react-native';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import FlatListItem from '../../src/components/FlatListItem';

configure({adapter: new Adapter()});
describe('FlatListItem', () => {
  it('FlatListItem snapshot', () => {
    const component = shallow(
      <FlatListItem
        value="value test"
        index={1}
        select={1}
        onSelect={() => {}}
        desc="value desc"
        icon={<View />}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('FlatListItem renders correctly', () => {
    const tree = renderer
      .create(
        <FlatListItem
          value="value test"
          index={1}
          select={1}
          onSelect={() => {}}
          desc="value desc"
          icon={<View />}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
