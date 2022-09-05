import * as React from 'react';
import {Text} from 'react-native';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import ButtonAddMedia from '../../src/components/Button/ButtonAddMedia';
import Button from '../../src/components/Button/Button';
import ButtonNewPost from '../../src/components/Button/ButtonNewPost';

configure({adapter: new Adapter()});
describe('component button', () => {
  it('ButtonAddMedia snapshot', () => {
    const component = shallow(
      <ButtonAddMedia
        onPress={() => {}}
        style={{}}
        label="+add more photos"
        labelStyle={{}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('ButtonAddMedia renders correctly', () => {
    const tree = renderer
      .create(
        <ButtonAddMedia
          onPress={() => {}}
          style={{}}
          label="+add more photos"
          labelStyle={{}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Button snapshot', () => {
    const component = shallow(
      <Button>
        <Text>click</Text>
      </Button>,
    );
    expect(toJson(component)).toMatchSnapshot();
  });
  it('Button renders correctly', () => {
    const tree = renderer
      .create(
        <Button>
          <Text>click</Text>
        </Button>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('ButtonNewPost snapshot', () => {
    const component = shallow(<ButtonNewPost />);
    expect(toJson(component)).toMatchSnapshot();
  });
  it('ButtonNewPost renders correctly', () => {
    const tree = renderer.create(<ButtonNewPost />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
