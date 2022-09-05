import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import StatusBar from '../../src/components/StatusBar';

configure({adapter: new Adapter()});
describe('component StatusBar', () => {
  it('StatusBar  snapshot', () => {
    const component = shallow(
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('StatusBar  renders correctly', () => {
    const tree = renderer
      .create(<StatusBar barStyle="dark-content" backgroundColor="#fff" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
