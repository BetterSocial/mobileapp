import React from 'react';
import {render, cleanup} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Content from '../../../src/screens/FeedScreen/Content';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({goBack: jest.fn()}),
  useRoute: () => ({
    params: {}
  }),
  createNavigatorFactory: jest.fn()
}));

jest.mock('react-native/Libraries/Pressability/usePressability');

jest.mock('react-native');
jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef
  };
});
describe('Content component should run correctly', () => {
  const item = {
    post_type: 1,
    message: 'halo',
    images_url: '',
    pollOptions: [
      {
        counter: '0',
        createdAt: '2022-11-28T01:24:25.000Z',
        option: 'bahaya123',
        polling_id: 'dee1ff13-9e1e-46b2-8ffc-46afdd38acca',
        polling_option_id: 'c4d16d91-89f5-423c-acb5-95a1b91ec53b',
        updatedAt: '2022-11-28T01:24:25.000Z'
      },
      {
        counter: '1',
        createdAt: '2022-11-28T01:24:25.000Z',
        option: 'bahaya1',
        polling_id: 'dee1ff13-9e1e-46b2-8ffc-46afdd38acca',
        polling_option_id: '3bc4ec5e-ac8f-4704-8256-1018edd9224c',
        updatedAt: '2022-11-28T01:25:15.000Z'
      }
    ],
    polls_expired_at: '2022-11-29T01:24:25.170Z',
    multiplechoice: false,
    isalreadypolling: true,
    voteCount: 1,
    topics: ['poll'],
    post_performance_comments_score: 1,
    privacy: 'Public'
  };

  afterEach(cleanup);

  it('Content should not change', () => {
    const onPress = jest.fn();
    const onNewPollFetched = jest.fn();
    const onPressDomain = jest.fn();
    const images_url = ['https://detik.jpg'];
    const {toJSON} = render(
      <SafeAreaProvider>
        <Content
          message={'halo test'}
          item={item}
          images_url={images_url}
          onNewPollFetched={onNewPollFetched}
          onPressDomain={onPressDomain}
          onPress={onPress}
          topics={item.topics}
        />
      </SafeAreaProvider>
    );
    expect(toJSON).toMatchSnapshot();
  });
});
