import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import ToastMessage from 'react-native-toast-message';

const BlurredLayerToast = () => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() =>
        ToastMessage.show({
          type: 'asNative',
          text1: 'Follow more users to enable interactions with anonymous posts',
          position: 'bottom'
        })
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '200%',
    zIndex: 11
  }
});
export default React.memo(BlurredLayerToast);
