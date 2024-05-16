import * as React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import Card from '../../../screens/CreatePost/elements/Card';
import {convertString} from '../../../utils/string/StringUtils';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const TopicSuggestions = ({
  message = '',
  topicSearch = [],
  setPositionKeyboard = () => {},
  setMessage = () => {},
  setTopicSearch = () => {},
  hashtagPosition = 0,
  positionTopicSearch = 0,
  handleStateHashtag = () => {}
}) => {
  const reformatStringByPosition = (str = '', strFromState = '') => {
    const topicItem = convertString(str, ' ', '');
    const topicItemWithSpace = topicItem.concat(' ');
    const oldMessage = strFromState;
    const start = hashtagPosition + 1;
    const end = positionTopicSearch + 1;
    const s = oldMessage.substring(0, end);
    const newMessage = s.insert(start, topicItemWithSpace);
    return newMessage;
  };

  const onTopicSuggestionClicked = (item) => {
    const newMessage = reformatStringByPosition(item.name.toLowerCase(), message);
    setPositionKeyboard('never');
    handleStateHashtag(newMessage);
    setMessage(newMessage);
    setTopicSearch([]);
  };

  if (topicSearch?.length === 0) return <></>;

  return (
    <Card style={styles.cardContainer}>
      {topicSearch.map((item, index) => (
        <TouchableNativeFeedback
          key={`topicSearch-${index}`}
          onPress={() => onTopicSuggestionClicked(item)}>
          <View style={styles.topicSuggestionContainer}>
            <Text style={styles.suggestions}>#{convertString(item.name, ' ', '')}</Text>
            {index !== topicSearch.length - 1 && <View style={styles.view} />}
          </View>
        </TouchableNativeFeedback>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginTop: -16
  },
  suggestions: {
    color: COLORS.black,
    fontFamily: fonts.inter[500],
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18
  },
  topicSuggestionContainer: {marginBottom: 5},
  view: {height: 1, marginTop: 5, backgroundColor: COLORS.gray110}
});

export default TopicSuggestions;
