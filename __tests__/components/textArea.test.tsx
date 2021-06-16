import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import {TextArea, AutoFocusTextArea} from '../../src/components/TextArea';

configure({adapter: new Adapter()});
describe('component TextArea', () => {
  it('TextArea snapshot', () => {
    const component = shallow(
      <TextArea
        textAlignVertical="top"
        multiline={true}
        placeholder="Input Text"
        onChangeText={() => {}}
        value="Input"
        style={{}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('TextArea renders correctly', () => {
    const tree = renderer
      .create(
        <TextArea
          textAlignVertical="top"
          multiline={true}
          placeholder="Input Text"
          onChangeText={() => {}}
          value="Input"
          style={{}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('AutoFocusTextArea snapshot', () => {
    const component = shallow(
      <AutoFocusTextArea
        placeholder="Input Text"
        onChangeText={() => {}}
        value="Input"
        style={{}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('AutoFocusTextArea renders correctly', () => {
    const tree = renderer
      .create(
        <AutoFocusTextArea
          placeholder="Input Text"
          onChangeText={() => {}}
          value="Input"
          style={{}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
