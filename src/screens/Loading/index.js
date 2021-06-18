import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';

const Loading = ({visible}) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    </Modal>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    padding: 50,
    borderRadius: 10,
  },
});
