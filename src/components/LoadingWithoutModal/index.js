import * as React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import {COLORS} from '../../utils/theme';

const LoadingWithoutModal = ({visible}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={COLORS.holyTosca} />
      </View>
    </View>
  );
};

export default LoadingWithoutModal;

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
