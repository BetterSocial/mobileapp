import React from 'react';
import {Text} from 'react-native';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import PrivacyPolicies from '../../src/screens/WebView/PrivacyPolicies';
configure({adapter: new Adapter()});
jest.useFakeTimers();
jest.mock('../../src/components/Header');

describe('component PrivacyPolicies', () => {
  it('PrivacyPolicies snapshot', () => {
    const component = shallow(<PrivacyPolicies />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('PrivacyPolicies renders correctly', () => {
    const tree = renderer.create(<PrivacyPolicies />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
