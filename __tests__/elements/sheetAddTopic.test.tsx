import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import SheetAddTopic from '../../src/elements/Post/SheetAddTopic';

configure({adapter: new Adapter()});
jest.useFakeTimers();

describe('component SheetAddTopic', () => {
  let data = ['corona', 'indonesia'];
  it('SheetAddTopic snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <SheetAddTopic
        refTopic={myRef}
        onAdd={() => {}}
        topics={data}
        onClose={() => {}}
        saveOnClose={() => {}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SheetAddTopic renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };

    const tree = renderer
      .create(
        <SheetAddTopic
          refTopic={myRef}
          onAdd={() => {}}
          topics={data}
          onClose={() => {}}
          saveOnClose={() => {}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
