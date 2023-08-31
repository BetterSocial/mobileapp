/* eslint-disable no-param-reassign */
import React from 'react';
import {Text} from 'react-native';
import reactStringReplace from 'react-string-replace';
import {colors} from '../../../utils/colors';
import {getUserId} from '../../../utils/token';

const useContentFeed = ({navigation}) => {
  // eslint-disable-next-line consistent-return
  const matchPress = (match) => {
    if (match && match.includes('#')) {
      return navigation.push('TopicPageScreen', {id: match.replace('#', '')});
    }
    if (match && match.includes('@')) {
      getUserId().then((selfId) => {
        navigation.push('OtherProfile', {
          data: {
            user_id: selfId,
            username: match.replace('@', '')
          }
        });
      });
    }
  };

  const onPressComponent = React.useCallback((match) => {
    matchPress(match);
  }, []);

  const hanldeShortTextColor = (isShortText) => {
    if (isShortText) {
      return 'rgba(255, 255, 255, 0.7)';
    }
    return colors.blue;
  };

  const hashtagAtComponent = (message, substring, isShortText) => {
    const regex = /\B([#@][a-zA-Z0-9_+-]+\b)(?!;)/;
    if (substring) {
      message = message.substring(0, substring);
    }
    if (message && typeof message === 'string') {
      return reactStringReplace(message, regex, (match) => {
        return (
          <Text
            onPress={() => onPressComponent(match)}
            testID="regex"
            style={{color: hanldeShortTextColor(isShortText)}}>
            {match}
          </Text>
        );
      });
    }
    return undefined;
  };

  return {
    hashtagAtComponent,
    matchPress,
    hanldeShortTextColor,
    onPressComponent
  };
};

export default useContentFeed;
