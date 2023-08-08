import * as React from 'react';
import {StyleSheet, Text} from 'react-native';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const TopicText = ({
  text,
  navigation = null,
  currentTopic = null,
  goToDetailPage,
  item,
  isShortText
}) => {
  const onClick = () => {
    // Do navigation here
    if (goToDetailPage && navigation) {
      return navigation.push('PostDetailPage', {
        // index: index,
        isalreadypolling: item.isalreadypolling,
        feedId: item.id,
        // refreshParent:  getDataFeedsHandle,
        data: item,
        isCaching: false
      });
    }
    if (!navigation || currentTopic === text.replace('#', '')) return null;
    return navigation.push('TopicPageScreen', {id: `topic_${text.replace('#', '').toLowerCase()}`});
  };

  return (
    <Text
      testID="topicTextComponent"
      onPress={onClick}
      style={[styles.text, styles.shortText(isShortText)]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: COLORS.blue,
    fontFamily: fonts.inter[500]
  },
  shortText: (isShort) => ({
    color: isShort ? 'rgba(255, 255, 255, 0.7)' : COLORS.blue
  })
});

export default React.memo(TopicText);
