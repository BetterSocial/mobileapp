import * as React from 'react';
import {View, StyleSheet} from 'react-native';

const SingleSidedShadowBox = ({children, style}) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    // overflow: 'hidden',
    paddingBottom: 2,
    elevation: 8,
  },
});

export default SingleSidedShadowBox;
