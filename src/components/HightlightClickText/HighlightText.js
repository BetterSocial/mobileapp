import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  hightlightText: {
    color: COLORS.blue
  }
});

const HightlightText = ({text, onPress}) => (
  <>
    <Text onPress={onPress} style={styles.hightlightText}>
      {text}
    </Text>
  </>
);

export default React.memo(HightlightText);
