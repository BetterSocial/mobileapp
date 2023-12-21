import * as React from 'react';
import {StatusBar, View, StyleSheet, Platform} from 'react-native';
import {COLORS} from '../../utils/theme';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const index = ({backgroundColor, ...props}) => (
    <View testID='statusbar' style={[styles.statusBar, {backgroundColor}]}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: COLORS.greenMantis,
    height: APPBAR_HEIGHT,
  },
});
export default index;
