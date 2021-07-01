import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Comment from '../../src/components/Comments/Comment';

configure({adapter: new Adapter()});

describe('component Comment', () => {
  it('Comment snapshot', () => {
    const component = shallow(
      <Comment
        onPress={() => {}}
        comment="test"
        username="test"
        time="2021-05-21T06:44:21.108159Z"
        photo="https://picsum.photos/200/300"
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Comment renders correctly', () => {
    const tree = renderer
      .create(
        <Comment
          onPress={() => {}}
          comment="test"
          username="test"
          time="2021-05-21T06:44:21.108159Z"
          photo="https://picsum.photos/200/300"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
