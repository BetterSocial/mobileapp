import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import SheetMedia from '../../src/elements/Post/SheetMedia';
configure({adapter: new Adapter()});
// jest.useFakeTimers();
describe('component SheetMedia', () => {
  it('SheetMedia snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <SheetMedia
        refMedia={myRef}
        uploadFromMedia={() => {}}
        takePhoto={() => {}}
        createPoll={() => {}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SheetMedia renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };

    const tree = renderer
      .create(
        <SheetMedia
          refMedia={myRef}
          uploadFromMedia={() => {}}
          takePhoto={() => {}}
          createPoll={() => {}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
