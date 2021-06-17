import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import ProgressBar from '../../src/components/ProgressBar/ProgressBar';

configure({adapter: new Adapter()});
describe('component ProgressBar', () => {
  it('ProgressBar snapshot', () => {
    const component = shallow(<ProgressBar isStatic={true} value={30} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('ProgressBar renders correctly', () => {
    const tree = renderer
      .create(<ProgressBar isStatic={true} value={30} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
