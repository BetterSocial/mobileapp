import * as React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import CameraIcon from '../../assets/icons/images/camera.svg';
import FileIcon from '../../assets/icons/images/file.svg';
import GIFIcon from '../../assets/icons/images/gif.svg';
// TODO: Garry,  need to pass props color
import MediasIcon from '../../assets/icons/images/medias.svg';
import {BottomSheet} from '../BottomSheet';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

const BottomSheetAttachment = React.forwardRef((props, ref) => (
  <BottomSheet
    ref={ref}
    closeOnPressMask={true}
    height={300}
    viewstyle={styles.container}
    onClose={() => props?.onClose?.()}>
    <View style={styles.containerBottomSheet}>
      <TouchableNativeFeedback
        onPress={() => props.onOpenMedia()}
        disabled={props.isLoadingUploadMedia}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <MediasIcon width={20} height={20} />
            <Text style={styles.textCard}>Send Photos & Videos</Text>
          </View>
          {props.isLoadingUploadMedia ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : null}
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => props.onOpenGIF()}
        disabled={props.isLoadingUploadGIF}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <GIFIcon width={20} height={20} />
            <Text style={styles.textCard}>Send a GIF</Text>
          </View>
          {props.isLoadingUploadGIF ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : null}
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => props.onOpenCamera()}
        disabled={props.isLoadingUploadCamera}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <CameraIcon width={20} height={20} />
            <Text style={styles.textCard}>Take a Picture</Text>
          </View>
          {props.isLoadingUploadCamera ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : null}
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback
        onPress={() => props.onOpenFile()}
        disabled={props.isLoadingUploadFile}>
        <View
          style={[
            styles.card,
            {
              borderBottomWidth: 1,
              borderBottomColor: COLORS.gray210
            }
          ]}>
          <View style={styles.wrapCardImage}>
            <FileIcon width={20} height={20} />
            <Text style={styles.textCard}>Send a File</Text>
          </View>
          {props.isLoadingUploadFile ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : null}
        </View>
      </TouchableNativeFeedback>
    </View>
  </BottomSheet>
));
BottomSheetAttachment.displayName = 'BottomSheetAttachment';
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: COLORS.almostBlack
  },
  containerBottomSheet: {
    marginTop: 20,
    backgroundColor: COLORS.almostBlack
  },
  card: {
    height: 52,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray210
  },
  wrapCardImage: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textCard: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: COLORS.black,
    paddingLeft: 9
  }
});

BottomSheetAttachment.propTypes = {
  onOpenMedia: PropTypes.func,
  isLoadingUploadMedia: PropTypes.bool,
  onOpenGIF: PropTypes.func,
  isLoadingUploadGIF: PropTypes.bool,
  onOpenCamera: PropTypes.func,
  isLoadingUploadCamera: PropTypes.bool,
  onOpenFile: PropTypes.func,
  isLoadingUploadFile: PropTypes.bool
};

export default BottomSheetAttachment;
