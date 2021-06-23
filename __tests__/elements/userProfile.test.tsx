import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import UserProfile from '../../src/elements/Post/UserProfile';

configure({adapter: new Adapter()});
jest.useFakeTimers();
describe('component UserProfile', () => {
  it('UserProfile snapshot', () => {
    const component = shallow(
      <UserProfile
        typeUser={false}
        setTypeUser={() => {}}
        username="user Test"
        photo={{
          uri:
            'https://gravatar.com/avatar/f6b72e03802331ff150526be144d899e?s=400&d=robohash&r=x',
        }}
        onPress={() => {}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('UserProfile renders correctly', () => {
    const tree = renderer
      .create(
        <UserProfile
          typeUser={false}
          setTypeUser={() => {}}
          username="user Test"
          photo={{
            uri:
              'https://gravatar.com/avatar/f6b72e03802331ff150526be144d899e?s=400&d=robohash&r=x',
          }}
          onPress={() => {}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
