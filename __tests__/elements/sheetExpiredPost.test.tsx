import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import SheetExpiredPost from '../../src/elements/Post/SheetExpiredPost';

configure({adapter: new Adapter()});
// jest.useFakeTimers();

describe('component SheetExpiredPost', () => {
  let data = [
    {
      label: '24 hours',
      value: '1',
      expiredobject: {
        hour: 24,
        day: 1,
      },
    },
    {
      label: '7 days',
      value: '7',
      expiredobject: {
        hour: 24,
        day: 7,
      },
    },
  ];
  it('SheetExpiredPost snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <SheetExpiredPost
        data={data}
        onSelect={() => {}}
        select={1}
        refExpired={myRef}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SheetExpiredPost renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };

    const tree = renderer
      .create(
        <SheetExpiredPost
          data={data}
          onSelect={() => {}}
          select={1}
          refExpired={myRef}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
