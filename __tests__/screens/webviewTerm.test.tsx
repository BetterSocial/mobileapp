import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import TermsAndCondition from '../../src/screens/WebView/TermsAndCondition';

configure({adapter: new Adapter()});
jest.useFakeTimers();

describe('component TermsAndCondition', () => {
  it('TermsAndCondition snapshot', () => {
    const component = shallow(<TermsAndCondition />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('TermsAndCondition renders correctly', () => {
    const tree = renderer.create(<TermsAndCondition />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
