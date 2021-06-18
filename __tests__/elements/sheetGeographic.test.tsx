import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import SheetGeographic from '../../src/elements/Post/SheetGeographic';

configure({adapter: new Adapter()});
// jest.useFakeTimers();

describe('component SheetGeographic', () => {
  let data = [
    {
      location_id: 'everywhere',
      neighborhood: 'Everywhere',
    },
    {
      location_id: 'indonesia',
      neighborhood: 'Indonesia',
    },
  ];
  it('SheetGeographic snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <SheetGeographic
        data={data}
        onSelect={() => {}}
        select={1}
        geoRef={myRef}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SheetGeographic renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };

    const tree = renderer
      .create(
        <SheetGeographic
          data={data}
          onSelect={() => {}}
          select={1}
          geoRef={myRef}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
