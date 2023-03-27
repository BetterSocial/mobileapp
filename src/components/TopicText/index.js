import * as React from 'react';
import {StyleSheet, Text} from 'react-native';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const TopicText = ({text}) => {
  return (
    <Text testID="topicTextComponent" style={styles.text}>
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

export default React.memo(TopicText);
