import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {cleanup, render} from '@testing-library/react-native';

import PDP from '../../../src/components/PostPageDetail';
import Store from '../../../src/context/Store';

jest.mock('react-native-activity-feed/node_modules/react-native-image-crop-picker', () => ({
  openPicker: jest.fn()
}));

jest.mock('../../../src/hooks/useAfterInteractions', () => ({
  useAfterInteractions: () => ({
    transitionRef: {current: {animateNextTransition: jest.fn()}},
    interactionsComplete: true
  })
}));

const mockedGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      isCaching: jest.fn().mockImplementation(true)
    }
  }),
  useNavigation: () => ({
    goBack: mockedGoBack
  })
}));

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn()
}));

describe('PDP component should run correctly', () => {
  const mockDispatch = jest.fn();
  const props = {
    dispatch: mockDispatch,
    feedId: '9f7f7e87-7641-11ed-82ab-124f97b82f95',
    feeds: [
      {
        anonimity: false,
        count_downvote: 0,
        count_upvote: 0,
        duration_feed: '1',
        expired_at: '2022-12-08T15:12:53.000Z',
        final_score: 0,
        foreign_id: '',
        id: '9f7f7e87-7641-11ed-82ab-124f97b82f95',
        location: 'Everywhere',
        message: '#dia #dian #diam ',
        object:
          '{"feed_group":"main_feed","message":"#dia #dian #diam ","profile_pic_path":"https://res.cloudinary.com/hpjivutj2/image/upload/v1660620884/nrfnzuhcrozz9v34ngv3.jpg","real_name":null,"topics":["dia","dian"],"username":"Fajarism","verb":"tweet"}',
        origin: null,
        actor: {
          created_at: '2022-06-10T13:11:53.385703Z',
          id: 'c6c91b04-795c-404e-b012-ea28813a2007',
          updated_at: '2022-07-29T12:54:03.879150Z'
        }
      }
    ],
    navigateToReplyView: jest.fn(),
    page: 'PostDetailPage',
    setFeedByIndexProps: jest.fn(),
    route: {}
  };

  afterEach(cleanup);

  it('sould match snapshot', () => {
    const {toJSON} = render(
      <SafeAreaProvider>
        <PDP {...props} />
      </SafeAreaProvider>,
      {wrapper: Store}
    );
    expect(toJSON).toMatchSnapshot();
  });
});
