import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import CreatePollContainer from '../../src/elements/Post/CreatePollContainer';

configure({adapter: new Adapter()});
jest.useFakeTimers();

describe('component CreatePollContainer', () => {
  it('CreatePollContainer snapshot', () => {
    const component = shallow(
      <CreatePollContainer
        polls={[{text: ''}, {text: ''}]}
        onremoveallpoll={() => {}}
        onaddpoll={() => {}}
        onremovesinglepoll={(index) => {}}
        onsinglepollchanged={(item, index) => {}}
        ismultiplechoice={false}
        onmultiplechoicechanged={(ismultiple) => {}}
        selectedtime={{day: 1, hour: 0, minute: 0}}
        ontimechanged={(timeobject) => {}}
        expiredobject={{day: 7, hour: 24}}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('CreatePollContainer renders correctly', () => {
    const tree = renderer
      .create(
        <CreatePollContainer
          polls={[{text: ''}, {text: ''}]}
          onremoveallpoll={() => {}}
          onaddpoll={() => {}}
          onremovesinglepoll={(index) => {}}
          onsinglepollchanged={(item, index) => {}}
          ismultiplechoice={false}
          onmultiplechoicechanged={(ismultiple) => {}}
          selectedtime={{day: 1, hour: 0, minute: 0}}
          ontimechanged={(timeobject) => {}}
          expiredobject={{day: 7, hour: 24}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
