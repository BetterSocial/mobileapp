import React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react-native';
import RenderItem from '../../../src/screens/NewsScreen/RenderItem';
import Store from '../../../src/context/Store';

jest.mock('react-native/Libraries/Pressability/usePressability');

const mockPush = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({goBack: jest.fn(), push: mockPush}),
  useRoute: () => ({
    params: {}
  })
}));

describe('RenderItem news should run correctly', () => {
  const image =
    'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
  const item = {
    actor: '[]',
    content: {
      author: '',
      created_at: '2022-12-13T09:26:42.000Z',
      description:
        'Region on high alert after dozens reported injured in first clash in disputed area for more than two years',
      domain_page_id: '574943cd-77ba-43fc-b666-c27b6c59aa02',
      image:
        'https://i.guim.co.uk/img/media/8578e07d0ad28fed8fae2d0c1f5343a9f4e529ef/0_205_3200_1920/master/3200.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdGctZGVmYXVsdC5wbmc&enable=upscale&s=bce3a50ac0b6e4030a4dc55de7c74614',
      keyword: '',
      news_link_id: 'ee78af8b-696c-48be-8abb-9fad1086c48a',
      news_url:
        'https://www.theguardian.com/world/2022/dec/13/chinese-and-indian-troops-in-fresh-skirmish-at-himalayan-border',
      site_name: 'the Guardian',
      title: 'Chinese and Indian troops in fresh skirmish at Himalayan border',
      updated_at: '2022-12-13T09:26:42.000Z',
      url: 'https://www.theguardian.com/world/2022/dec/13/chinese-and-indian-troops-in-fresh-skirmish-at-himalayan-border',
      url_compact:
        'https://www.theguardian.com/world/2022/dec/13/chinese-and-indian-troops-in-fresh-skirmish-at-himalayan-border'
    },
    content_created_at: '2022-12-13T09:26:42.000Z',
    count_downvote: 0,
    count_upvote: 0,
    crawled_date: 1670983850442,
    domain: {
      credderLastChecked: '2022-11-15',
      credderScore: 66,
      domain_page_id: '574943cd-77ba-43fc-b666-c27b6c59aa02',
      image: 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png',
      name: 'theguardian.com',
      site_name: 'the Guardian'
    },
    foreign_id: '4c07b839-8b59-41af-9f4a-d433c26b62631670941833442',
    id: 'b472fd74-7af2-11ed-abfb-0a6648bb8f8d',
    latest_reactions: {
      upvotes: [
        {
          activity_id: '6c9f61aa-7aef-11ed-a382-0e4b8d0e7a11',
          data: {
            count_upvote: 1,
            text: 'You have new upvote'
          },
          id: 'd8ff378f-d700-4aa4-9586-c9bde3f0a94b',
          kind: 'upvotes',
          parent: '',
          target_feeds: 'notification:undefined',
          updated_at: '2022-12-23T00:39:10.407719Z',
          user: {
            created_at: '2022-06-10T13:11:53.385703Z',
            data: {
              human_id: 'I4K3M10FGR78EWQQDNQ2',
              profile_pic_url:
                'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg',
              username: 'Agita'
            },
            id: 'c6c91b04-795c-404e-b012-ea28813a2006',
            updated_at: '2022-07-29T12:54:03.879150Z'
          },
          user_id: 'c6c91b04-795c-404e-b012-ea28813a2006'
        }
      ]
    }
  };
  const url = 'theguardian.com';
  const time = '2022-12-13T09:26:42.000Z';
  afterEach(cleanup);
  it('should match snapshot', () => {
    const onPressBlock = jest.fn();
    const onPressComment = jest.fn();
    const onPressDownVote = jest.fn();
    const onPressShare = jest.fn();
    const onUpvote = jest.fn();
    const {toJSON} = render(
      <RenderItem
        item={item}
        onPressBlock={onPressBlock}
        onPressComment={onPressComment}
        onPressDownVote={onPressDownVote}
        onPressShare={onPressShare}
        onPressUpvote={onUpvote}
      />,
      {wrapper: Store}
    );
    expect(toJSON).toMatchSnapshot();
  });

  it('Press upvote should be call', () => {
    const spyState = jest.spyOn(React, 'useState');
    const onPressBlock = jest.fn();
    const onPressComment = jest.fn();
    const onPressDownVote = jest.fn();
    const onPressShare = jest.fn();
    const onUpvote = jest.fn();
    const setState = jest.fn();

    spyState.mockImplementation((init) => [init, setState]);
    const {getByTestId} = render(
      <RenderItem
        item={item}
        onPressBlock={onPressBlock}
        onPressComment={onPressComment}
        onPressDownVote={onPressDownVote}
        onPressShare={onPressShare}
        onPressUpvote={onUpvote}
      />,
      {wrapper: Store}
    );
    fireEvent.press(getByTestId('pressUpvote'));
    expect(onUpvote).toHaveBeenCalled();
  });

  it('press downvote should be call', () => {
    const onPressBlock = jest.fn();
    const onPressComment = jest.fn();
    const onPressDownVote = jest.fn();
    const onPressShare = jest.fn();
    const onUpvote = jest.fn();
    const {getByTestId, getAllByTestId} = render(
      <RenderItem
        item={item}
        onPressBlock={onPressBlock}
        onPressComment={onPressComment}
        onPressDownVote={onPressDownVote}
        onPressShare={onPressShare}
        onPressUpvote={onUpvote}
      />,
      {wrapper: Store}
    );
    expect(getAllByTestId('downvoteOff')).toHaveLength(1);
    fireEvent.press(getByTestId('downVoteBtn'));
    expect(onPressDownVote).toHaveBeenCalled();
  });

  it('onComment should run correctly', () => {
    const onPressBlock = jest.fn();
    const onPressComment = jest.fn();
    const onPressDownVote = jest.fn();
    const onPressShare = jest.fn();
    const onUpvote = jest.fn();
    const {getByTestId} = render(
      <RenderItem
        item={item}
        onPressBlock={onPressBlock}
        onPressComment={onPressComment}
        onPressDownVote={onPressDownVote}
        onPressShare={onPressShare}
        onPressUpvote={onUpvote}
      />,
      {wrapper: Store}
    );
    fireEvent.press(getByTestId('availableComment'));
    expect(onPressComment).toHaveBeenCalled();
  });
});
