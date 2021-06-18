import * as React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import SheetPrivacy from '../../src/elements/Post/SheetPrivacy';
import MemoIc_world from '../../src/assets/icons/Ic_world';
import MemoIc_user_group from '../../src/assets/icons/Ic_user_group';

configure({adapter: new Adapter()});
// jest.useFakeTimers();
describe('component SheetPrivacy', () => {
  let listPrivacy = [
    {
      icon: <MemoIc_world height={16.67} width={16.67} />,
      label: 'Public',
      desc: 'Anyone in your geographic target area can see your post',
      key: 'public',
    },
    {
      icon: <MemoIc_user_group height={16.67} width={16.67} />,
      label: 'People I follow',
      desc: 'Only those you follow can see your post',
      key: 'people_i_follow',
    },
  ];
  it('SheetPrivacy snapshot', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };
    const component = shallow(
      <SheetPrivacy
        data={listPrivacy}
        onSelect={() => {}}
        select={1}
        privacyRef={myRef}
      />,
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('SheetPrivacy renders correctly', () => {
    const myRef = {
      current: {
        open: () => {},
        close: () => {},
      },
    };

    const tree = renderer
      .create(
        <SheetPrivacy
          data={listPrivacy}
          onSelect={() => {}}
          select={1}
          privacyRef={myRef}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
