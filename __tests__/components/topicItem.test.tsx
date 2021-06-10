import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import TopicItem from '../../src/components/TopicItem';

configure({adapter: new Adapter()});
describe('component TextArea', () => {
  it('TextArea snapshot', () => {
    const component = shallow(
      <TopicItem label="Test" removeTopic={() => {}} style={{}} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('TextArea renders correctly', () => {
    const tree = renderer
      .create(<TopicItem label="Test" removeTopic={() => {}} style={{}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
