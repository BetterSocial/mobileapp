import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Avatar from '../../src/components/Avatar';

configure({adapter: new Adapter()});

describe('component blocking', () => {
  it('Avatar snapshot', () => {
    const component = shallow(
      <Avatar
        image="https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png"
        style={{}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Avatar renders correctly', () => {
    const tree = renderer
      .create(
        <Avatar
          image="https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png"
          style={{}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
