import * as React from 'react';
import {Shadow} from 'react-native-shadow-2';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1
  }
});

const ShadowFloatingButtons = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default ShadowFloatingButtons;
