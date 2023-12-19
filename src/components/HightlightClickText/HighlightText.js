import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {colors} from '../../utils/colors';

const styles = StyleSheet.create({
  hightlightText: {
    color: colors.blue
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
