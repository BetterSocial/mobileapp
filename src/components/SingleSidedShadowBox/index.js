import * as React from 'react';
import {View, StyleSheet} from 'react-native';

const SingleSidedShadowBox = ({children, style}) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingBottom: 2,
  },
});

export default SingleSidedShadowBox;
