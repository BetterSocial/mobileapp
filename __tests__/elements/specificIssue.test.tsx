import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import SpecificIssue from '../../src/elements/Blocking/SpecificIssue';

jest.mock('react-native', () => {
  return {
    StyleSheet: {
      create: jest.fn((e) => e),
    },
  };
});

configure({adapter: new Adapter()});
jest.useFakeTimers();

describe('component SpecificIssue', () => {
  it('SpecificIssue snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <SpecificIssue onPress={() => {}} refSpecificIssue={myRef} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SpecificIssue renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const tree = renderer
      .create(<SpecificIssue onPress={() => {}} refSpecificIssue={myRef} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
