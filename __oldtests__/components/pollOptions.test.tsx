import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import PollOptions from '../../src/components/PollOptions';

configure({adapter: new Adapter()});
describe('component PollOptions', () => {
  it('PollOptions snapshot', () => {
    const component = shallow(
      <PollOptions item={{option: 'test'}} index={1} total={20} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('PollOptions renders correctly', () => {
    const tree = renderer
      .create(<PollOptions item={{option: 'test'}} index={1} total={20} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
