import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import ShowMedia from '../../src/elements/Post/ShowMedia';

configure({adapter: new Adapter()});
// jest.useFakeTimers();
describe('component ShowMedia', () => {
  it('ShowMedia snapshot', () => {
    let data = [
      {
        id: 1,
        data:
          'https://gravatar.com/avatar/f6b72e03802331ff150526be144d899e?s=400&d=robohash&r=x',
      },
      {
        id: 2,
        data:
          'https://gravatar.com/avatar/f6b72e03802331ff150526be144d899e?s=400&d=robohash&r=x',
      },
      {
        id: 3,
        data:
          'https://gravatar.com/avatar/f6b72e03802331ff150526be144d899e?s=400&d=robohash&r=x',
      },
    ];
    const component = shallow(
      <ShowMedia
        onRemoveAll={() => {}}
        onRemoveItem={() => {}}
        onAddMedia={() => {}}
        data={data}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('ShowMedia renders correctly', () => {
    let data = [
      {
        id: 1,
        data:
          'https://gravatar.com/avatar/f6b72e03802331ff150526be144d899e?s=400&d=robohash&r=x',
      },
      {
        id: 2,
        data:
          'https://gravatar.com/avatar/f6b72e03802331ff150526be144d899e?s=400&d=robohash&r=x',
      },
      {
        id: 3,
        data:
          'https://gravatar.com/avatar/f6b72e03802331ff150526be144d899e?s=400&d=robohash&r=x',
      },
    ];
    const tree = renderer
      .create(
        <ShowMedia
          onRemoveAll={() => {}}
          onRemoveItem={() => {}}
          onAddMedia={() => {}}
          data={data}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
