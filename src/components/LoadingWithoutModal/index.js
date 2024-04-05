import * as React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../utils/theme';
import dimen from '../../utils/dimen';
import {normalizeFontSize} from '../../utils/fonts';

const LoadingWithoutModal = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.content(!!props.text)}>
        <ActivityIndicator size="large" color={COLORS.gray510} />
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: dimen.normalizeDimen(isHasText ? 30 : 50),
    borderRadius: dimen.normalizeDimen(10)
  }),
  text: {
    color: COLORS.almostBlack,
    fontSize: normalizeFontSize(16),
    marginTop: dimen.normalizeDimen(10)
  }
});
