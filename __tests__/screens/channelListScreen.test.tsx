import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import ChannelListScreen from '../../src/screens/channelListScreen/ChannelListScreen';

configure({adapter: new Adapter()});
jest.useFakeTimers();
describe('component ChannelListScreen', () => {
  it('ChannelListScreen snapshot', () => {
    const component = shallow(<ChannelListScreen navigation={jest.fn()} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('ChannelListScreen renders correctly', () => {
    const tree = renderer
      .create(<ChannelListScreen navigation={jest.fn()} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
