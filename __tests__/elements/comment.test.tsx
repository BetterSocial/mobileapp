import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Comment from '../../src/elements/PostDetail/Comment';

configure({adapter: new Adapter()});

describe('component Comment', () => {
  it('Comment snapshot', () => {
    const component = shallow(
      <Comment onPress={() => {}} comment="test" username="test" />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Comment renders correctly', () => {
    const tree = renderer
      .create(<Comment onPress={() => {}} comment="test" username="test" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
