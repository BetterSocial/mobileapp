/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import {act, renderHook} from '@testing-library/react-hooks';
import * as reactString from 'react-string-replace';
import * as serviceToken from '../../src/utils/token';
import useContentFeed from '../../src/screens/FeedScreen/hooks/useContentFeed';
import {colors} from '../../src/utils/colors';

describe('it should run correctly', () => {
  beforeEach(() => {
    jest.spyOn(reactString, 'default');
  });

  const navigation = {
    push: jest.fn()
  };

  it('matchPress should fun correctly', () => {
    const spyGetUserId = jest
      .spyOn(serviceToken, 'getUserId')
      .mockImplementation(() => Promise.resolve());
    const {result} = renderHook(() => useContentFeed({navigation}));
    act(() => {
      result.current.matchPress('#black');
    });
    expect(navigation.push).toHaveBeenCalled();
    act(() => {
      result.current.matchPress('@agita');
    });
    expect(spyGetUserId).toHaveBeenCalled();
    expect(navigation.push).toHaveBeenCalled();
  });

  it('hashtagAtComponent should run correctly', async () => {
    const {result} = renderHook(() => useContentFeed({navigation}));
    expect(result.current.hashtagAtComponent('#Human @agita')[1].props.children).toEqual('#Human');
    expect(result.current.hashtagAtComponent('#Human @agita')[1].props.style).toEqual({
      color: colors.blue
    });
    expect(result.current.hashtagAtComponent('#Human @agita')[3].props.children).toEqual('@agita');
    expect(
      result.current.hashtagAtComponent(
        '#Human @agita Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim. Nunc tincidunt ante vitae massa. Duis ante orci, molestie vitae, vehicula venenatis, tincidunt ac, pede. Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Etiam commodo dui eget wisi. Donec iaculis gravida nulla. Donec quis nibh at felis congue commodo. Etiam bibendum elit eget erat. Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit. Nullam sapien sem, ornare ac, nonummy non, lobortis a, enim. Nunc',
        80
      )[3].props.children
    ).toEqual('@agita');
    await result.current.hashtagAtComponent('#Human @agita')[1].props.onPress();
    expect(navigation.push).toHaveBeenCalled();
    expect(result.current.hashtagAtComponent(null)).toBe(undefined);
  });

  // it('handleShortTextColor should run correctly', () => {
  //   const {result} = renderHook(() => useContentFeed({navigation}));

  //   expect(result.current.hanldeShortTextColor(true)).toEqual('rgba(255, 255, 255, 0.7)');
  //   expect(result.current.hanldeShortTextColor(false)).toEqual(colors.blue);
  // });
});
