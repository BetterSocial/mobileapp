/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import {act, renderHook} from '@testing-library/react-hooks';
import * as reactString from 'react-string-replace';
import * as serviceToken from '../../src/utils/token';
import useContentFeed from '../../src/screens/FeedScreen/hooks/useContentFeed';
import {colors} from '../../src/utils/colors';

// // const mockReactString = jest.fn()
// jest.mock('react-string-replace', () => ({
//     default: jest.fn()
// }))

describe('it should run correctly', () => {
  beforeEach(() => {
    jest.spyOn(reactString, 'default');
  });

  it('matchPress should fun correctly', () => {
    const navigation = {
      push: jest.fn()
    };
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
    const navigation = {
      push: jest.fn()
    };
    const {result} = renderHook(() => useContentFeed({navigation}));
    expect(result.current.hashtagAtComponent('#Human @agita')[1].props.children).toEqual('#Human');
    expect(result.current.hashtagAtComponent('#Human @agita')[1].props.style).toEqual({
      color: colors.blue
    });
    expect(result.current.hashtagAtComponent('#Human @agita')[3].props.children).toEqual('@agita');
  });

  it('matchPress should run correctly', async () => {
    const navigation = {
      push: jest.fn()
    };
    const {result} = renderHook(() => useContentFeed({navigation}));
  });
});

// /* eslint-disable no-param-reassign */
// import React from 'react';
// import {Text} from 'react-native';
// import reactStringReplace from 'react-string-replace';
// import {colors} from '../../../utils/colors';
// import {getUserId} from '../../../utils/token';

// const useContentFeed = ({navigation}) => {
//   // eslint-disable-next-line consistent-return
//   const matchPress = (match) => {
//     if (match && match.includes('#')) {
//       return navigation.push('TopicPageScreen', {id: match.replace('#', '')});
//     }
//     if (match && match.includes('@')) {
//       getUserId().then((selfId) => {
//         navigation.push('OtherProfile', {
//           data: {
//             user_id: selfId,
//             username: match.replace('@', '')
//           }
//         });
//       });
//     }
//   };

//   const onPressComponent = React.useCallback((match) => {
//     matchPress(match);
//   }, []);

//   const hanldeShortTextColor = (isShortText) => {
//     if (isShortText) {
//       return 'rgba(255, 255, 255, 0.7)';
//     }
//     return colors.blue;
//   };

//   const hashtagAtComponent = (message, substring, isShortText) => {
//     const regex = /\B([#@][a-zA-Z0-9_+-]+\b)(?!;)/;
//     if (substring) {
//       message = message.substring(0, substring);
//     }
//     if (message && typeof message === 'string') {
//       return reactStringReplace(message, regex, (match) => {
//         return (
//           <Text
//             onPress={() => onPressComponent(match)}
//             testID="regex"
//             style={{color: hanldeShortTextColor(isShortText)}}>
//             {match}
//           </Text>
//         );
//       });
//     }
//     return undefined;
//   };

//   return {
//     hashtagAtComponent,
//     matchPress
//   };
// };

// export default useContentFeed;
