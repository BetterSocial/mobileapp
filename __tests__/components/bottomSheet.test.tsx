import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import BottomSheet from '../../src/components/BottomSheet/BottomSheet';

configure({adapter: new Adapter()});
describe('component BottomSheet', () => {
  it('BottomSheet snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(<BottomSheet ref={myRef} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('BottomSheet renders correctly', () => {
    // const myRef = useRef();
    const tree = renderer.create(<BottomSheet />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
