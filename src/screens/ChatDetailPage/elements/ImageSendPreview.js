import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useMessageInputContext} from 'stream-chat-react-native-core';
import {COLORS} from '../../../utils/theme';

const ImageSendPreview = () => {
  const {ImageUploadPreview} = useMessageInputContext();
  return <View style={styles.container}>{<ImageUploadPreview />}</View>;
};

export default ImageSendPreview;

const styles = StyleSheet.create({
  container: {backgroundColor: COLORS.brilliance}
});
