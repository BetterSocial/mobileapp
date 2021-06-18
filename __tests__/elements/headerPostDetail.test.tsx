import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Header from '../../src/elements/PostDetail/Header';

configure({adapter: new Adapter()});

describe('component Header', () => {
  it('Header snapshot', () => {
    const component = shallow(
      <Header onSearch={() => {}} onSetting={() => {}} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Header renders correctly', () => {
    const tree = renderer
      .create(<Header onSearch={() => {}} onSetting={() => {}} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
