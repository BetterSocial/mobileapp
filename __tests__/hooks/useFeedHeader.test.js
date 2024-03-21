import SimpleToast from 'react-native-simple-toast';
import {act, renderHook} from '@testing-library/react-hooks';

import * as actionFeed from '../../src/context/actions/feeds';
import * as servicePost from '../../src/service/post';
import Store from '../../src/context/Store';
import useFeedHeader from '../../src/screens/FeedScreen/hooks/useFeedHeader';

const mockedGoBack = jest.fn();
const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => jest.fn()
}));

jest.mock('@react-navigation/core', () => ({
  useNavigation: () => ({
    goBack: mockedGoBack,
    navigate: mockedNavigate
  })
}));

jest.mock('react-native-simple-toast', () => ({
  show: jest.fn()
}));

describe('Feed Header should run correctly', () => {
  beforeEach(() => {
    mockedGoBack.mockReset();
  });
  const actor = {
    created_at: '2022-06-10T13:11:53.385703Z',
    data: {
      human_id: 'I4K3M10FGR78EWQQDNQ2',
      profile_pic_url:
        'https://res.cloudinary.com/hpjivutj2/image/upload/v1659099243/pbdv3jlyd4mhmtis6kqx.jpg',
      username: 'Agita'
    },
    id: 'c6c91b04-795c-404e-b012-ea28813a2006',
    updated_at: '2022-07-29T12:54:03.879150Z'
  };

  it('navigateToProfile should run correctly', () => {
    const {result} = renderHook(() => useFeedHeader({actor, source: 'public'}), {wrapper: Store});
    const spyActionFeed = jest.spyOn(actionFeed, 'setTimer');
    act(() => {
      result.current.navigateToProfile();
    });
    expect(spyActionFeed).toHaveBeenCalled();
  });
  it('onBackNormal should run correctly', () => {
    const {result} = renderHook(() => useFeedHeader({actor, source: 'public'}), {wrapper: Store});
    act(() => {
      result.current.onBackNormalUser();
    });
    expect(mockedNavigate).toHaveBeenCalled();
  });

  it('handleNavigate should run correctly', () => {
    const {result} = renderHook(() => useFeedHeader({actor, source: 'public'}), {wrapper: Store});
    act(() => {
      result.current.handleNavigate(actor.data.human_id);
    });
    expect(mockedNavigate).toHaveBeenCalled();
  });
  it('handleNavigate no data should run correctly', async () => {
    const {result} = renderHook(() => useFeedHeader({actor: {data: null}, source: 'public'}), {
      wrapper: Store
    });
    await result.current.handleNavigate(actor.data.human_id);
    const spyToast = jest.spyOn(SimpleToast, 'show');

    expect(spyToast).toHaveBeenCalled();
  });
  it('handleNavigate same user id should run correctly', async () => {
    const {result} = renderHook(
      () =>
        useFeedHeader({
          actor: {
            data: {id: 'c6c91b04-795c-404e-b012-ea28813a2006'},
            id: 'c6c91b04-795c-404e-b012-ea28813a2006'
          },
          source: 'public'
        }),
      {
        wrapper: Store
      }
    );
    await result.current.handleNavigate('c6c91b04-795c-404e-b012-ea28813a2006');
    const spyToast = jest.spyOn(SimpleToast, 'show');

    expect(spyToast).toHaveBeenCalled();
  });
  it('sendViewTimePost should run correctly', async () => {
    const spy = jest.spyOn(servicePost, 'viewTimePost');
    const {result} = renderHook(() => useFeedHeader({actor, source: 'public'}), {wrapper: Store});
    await result.current.sendViewTimePost(123);
    expect(spy).toHaveBeenCalled();
  });
});
