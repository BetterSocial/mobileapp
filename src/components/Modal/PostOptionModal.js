import * as React from 'react';
import {ReactNativeModal} from 'react-native-modal';
import {StyleSheet, Text, View} from 'react-native';

import GlobalButton from '../Button/GlobalButton';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8
  },
  deletePostText: {
    color: COLORS.red
  }
});

const PostOptionModal = ({isOpen = false, onClose = () => {}, onDeleteClicked = () => {}}) => (
  <ReactNativeModal isVisible={isOpen} onBackdropPress={onClose}>
    <View style={styles.container}>
      <GlobalButton onPress={onDeleteClicked}>
        <Text style={styles?.deletePostText}>Delete Post</Text>
      </GlobalButton>
    </View>
  </ReactNativeModal>
);

export default PostOptionModal;
