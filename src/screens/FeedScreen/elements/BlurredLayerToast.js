import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import ToastMessage from 'react-native-toast-message';

const BlurredLayerToast = ({children}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        ToastMessage.show({
          type: 'asNative',
          text1: 'Follow more users to enable interactions with anonymous posts',
          position: 'bottom'
        })
      }>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%'
  }
});
export default React.memo(BlurredLayerToast);
