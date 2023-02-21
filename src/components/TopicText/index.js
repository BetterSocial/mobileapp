import * as React from 'react';
import {StyleSheet, Text} from 'react-native';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const TopicText = ({text, navigation = null, currentTopic = null}) => {
  const onClick = () => {
    // Do navigation here
    if (!navigation || currentTopic === text.replace('#', '')) return;
    navigation.push('TopicPageScreen', {id: text.replace('#', '').toLowerCase()});
  };

  return (
    <Text testID="topicTextComponent" onPress={onClick} style={styles.text}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: COLORS.blue,
    fontFamily: fonts.inter[500]
  }
});

export default TopicText;
