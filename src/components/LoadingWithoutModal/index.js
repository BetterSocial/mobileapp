import * as React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../utils/theme';

const LoadingWithoutModal = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.content(!!props.text)}>
        <ActivityIndicator size="large" color={COLORS.holytosca} />
        {props?.text && <Text style={styles.text}>{props.text}</Text>}
      </View>
    </View>
  );
};

export default LoadingWithoutModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: (isHasText) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    padding: isHasText ? 30 : 50,
    borderRadius: 10
  }),
  text: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 10
  }
});
