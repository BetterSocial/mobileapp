import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import WriteComment from '../../src/elements/PostDetail/WriteComment';

configure({adapter: new Adapter()});

describe('component WriteComment', () => {
  it('WriteComment snapshot', () => {
    const component = shallow(
      <WriteComment
        onPress={() => {}}
        value={'halo'}
        onChangeText={() => {}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('WriteComment renders correctly', () => {
    const tree = renderer
      .create(
        <WriteComment
          onPress={() => {}}
          value={'halo'}
          onChangeText={() => {}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
