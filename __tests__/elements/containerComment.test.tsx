import React from 'react';
import {shallow, configure} from 'enzyme';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import ContainerComment from '../../src/elements/PostDetail/ContainerComment';

configure({adapter: new Adapter()});
jest.useFakeTimers();

let comment = [
  {
    created_at: '2021-05-24T13:01:24.317789Z',
    updated_at: '2021-05-24T13:01:24.317789Z',
    id: '6542f596-5b07-442d-8e76-a46ed3fba0e3',
    user_id: '619ec1a3-f0f7-4ac1-9811-7142d8e21e3f',
    user: {
      created_at: '2021-05-20T13:38:22.600485Z',
      updated_at: '2021-05-20T13:38:22.600485Z',
      id: '619ec1a3-f0f7-4ac1-9811-7142d8e21e3f',
      data: {
        created_at: '2021-05-20T06:38:17.000Z',
        human_id: 'TVGBYD1BI9YMXMAA6CQ11',
        profile_pic_url:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
        username: 'user sebelas',
      },
    },
    kind: 'comment',
    activity_id: '5072e770-b977-11eb-ae63-128a130028af',
    data: {
      count_downvote: 0,
      count_upvote: 0,
      text: 'user 15 comment',
    },
    parent: 'f57e3b14-c9db-4ed9-a15d-30a8b7e54854',
    latest_children: {},
    children_counts: {},
  },
  {
    created_at: '2021-05-24T08:13:46.933655Z',
    updated_at: '2021-05-24T08:13:46.933655Z',
    id: 'c1df141c-ea82-4b59-9017-0f5a87f86ed0',
    user_id: 'e554d0ac-81cc-4139-9939-11de565cda27',
    user: {
      created_at: '2021-05-20T14:18:50.537997Z',
      updated_at: '2021-05-20T14:18:50.537997Z',
      id: 'e554d0ac-81cc-4139-9939-11de565cda27',
      data: {
        created_at: '2021-05-20T07:18:45.000Z',
        human_id: 'P19FGPQGMSZ5VSHA0YSQ',
        profile_pic_url:
          'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
        username: 'usupsuparma',
      },
    },
    kind: 'comment',
    activity_id: '5072e770-b977-11eb-ae63-128a130028af',
    data: {
      count_downvote: 0,
      count_upvote: 0,
      text: 'sedang mikirin kamu',
    },
    parent: 'f57e3b14-c9db-4ed9-a15d-30a8b7e54854',
    latest_children: {},
    children_counts: {},
  },
];
describe('component ContainerComment', () => {
  it('ContainerComment snapshot', () => {
    const component = shallow(<ContainerComment comments={comment} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('ContainerComment renders correctly', () => {
    const tree = renderer
      .create(<ContainerComment comments={comment} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
