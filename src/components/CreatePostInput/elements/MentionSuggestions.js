import * as React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import Card from '../../../screens/CreatePost/elements/Card';
import {convertString} from '../../../utils/string/StringUtils';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const MentionSuggestions = ({
  hashtagPosition = 0,
  positionTopicSearch = 0,
  message = '',
  allTaggedUser = [],
  userSearch = [],
  setAllTaggedUser = () => {},
  setPositionKeyboard = () => {},
  handleStateMention = () => {},
  setMessage = () => {},
  setUserForTagging = () => {}
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

  const onMentionSuggestionClicked = (item) => {
    const newMessage = reformatStringByPosition(item.username, message);
    setPositionKeyboard('never');
    handleStateMention(newMessage);
    setMessage(newMessage);
    setUserForTagging([]);
    const duplicateId = allTaggedUser.find((userData) => userData.user_id === item.user_id);
    if (duplicateId) return;
    setAllTaggedUser([...allTaggedUser, item]);
  };

  if (userSearch?.length === 0) return <></>;

  return (
    <Card style={styles.cardContainer}>
      {userSearch.map((item, index) => (
        <TouchableNativeFeedback
          key={`userTagging-${index}`}
          onPress={() => onMentionSuggestionClicked(item)}>
          <View style={styles.suggestionContainer}>
            <Text style={styles.suggestions}>@{item.username}</Text>
            {index !== userSearch.length - 1 && <View style={styles.view} />}
          </View>
        </TouchableNativeFeedback>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {marginTop: -16},
  suggestions: {
    color: COLORS.black,
    fontFamily: fonts.inter[500],
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18
  },
  suggestionContainer: {marginBottom: 5},
  view: {height: 1, marginTop: 5, backgroundColor: COLORS.gray110}
});

export default MentionSuggestions;
