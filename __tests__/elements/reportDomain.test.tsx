import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import ReportDomain from '../../src/elements/Blocking/ReportDomain';

jest.mock('react-native', () => {
  function MockingUIManager() {
    const RN = jest.requireActual('react-native');

    RN.UIManager.getViewManagerConfig = (name) => {
      return {};
    };

    Object.defineProperty(RN, 'findNodeHandle', {
      get: jest.fn(() => () => 1),
      set: jest.fn(),
    });

    return RN;
  }
  return {
    StyleSheet: {
      create: jest.fn((e) => e),
    },
  };
});

configure({adapter: new Adapter()});
jest.useFakeTimers();

describe('component ReportDomain', () => {
  it('ReportDomain snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <ReportDomain onSelect={() => {}} refReportDomain={myRef} />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('ReportDomain renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const tree = renderer
      .create(<ReportDomain onSelect={() => {}} refReportDomain={myRef} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
