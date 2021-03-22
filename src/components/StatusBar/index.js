import React from 'react';
import {
  StatusBar,
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
} from 'react-native';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const index = ({backgroundColor, ...props}) => {
  return (
    <View style={[styles.statusBar, {backgroundColor}]}>
      {/* <SafeAreaView> */}
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      {/* </SafeAreaView> */}
    </View>
  );
};
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#79B45D',
    height: APPBAR_HEIGHT,
  },
});
export default index;
