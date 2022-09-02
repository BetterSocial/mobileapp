import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import PollItem from '../../src/screens/CreatePost/elements/PollItem';

configure({adapter: new Adapter()});
jest.useFakeTimers();

describe('component PollItem', () => {
  it('PollItem snapshot', () => {
    const component = shallow(
      <PollItem
        index={1}
        poll={[{text: ''}, {text: ''}]}
        onremovepoll={(index) => {}}
        onpollchanged={(item, index) => {}}
        showdeleteicon={true}
        showcharactercount={false}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('PollItem renders correctly', () => {
    const tree = renderer
      .create(
        <PollItem
          index={1}
          poll={[{text: ''}, {text: ''}]}
          onremovepoll={(index) => {}}
          onpollchanged={(item, index) => {}}
          showdeleteicon={true}
          showcharactercount={false}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
