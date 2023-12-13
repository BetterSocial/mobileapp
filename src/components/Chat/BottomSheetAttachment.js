import * as React from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback, ActivityIndicator} from 'react-native';

import {fonts} from '../../utils/fonts';
import {colors} from '../../utils/colors';
import {BottomSheet} from '../BottomSheet';
import MediasIcon from '../../assets/icons/images/medias.svg';
import GIFIcon from '../../assets/icons/images/gif.svg';
import FileIcon from '../../assets/icons/images/file.svg';
import CameraIcon from '../../assets/icons/images/camera.svg';

const BottomSheetAttachment = React.forwardRef((props, ref) => (
  <BottomSheet ref={ref} closeOnPressMask={true} height={300} viewstyle={styles.container}>
    <View style={styles.containerBottomSheet}>
      <TouchableNativeFeedback onPress={() => props.onOpenMedia()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <MediasIcon width={20} height={20} fill={colors.black} />
            <Text style={styles.textCard}>Send Photos & Videos</Text>
          </View>
          {props.isLoadingUploadMedia ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => props.onOpenGIF()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <GIFIcon width={20} height={20} fill={colors.black} />
            <Text style={styles.textCard}>Send a GIF</Text>
          </View>
          {props.isLoadingUploadGIF ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => props.onOpenCamera()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <CameraIcon width={20} height={20} fill={colors.black} />
            <Text style={styles.textCard}>Take a Picture</Text>
          </View>
          {props.isLoadingUploadCamera ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => props.onOpenFile()}>
        <View
          style={[
            styles.card,
            {
              borderBottomWidth: 1,
              borderBottomColor: colors.alto
            }
          ]}>
          <View style={styles.wrapCardImage}>
            <FileIcon width={20} height={20} fill={colors.black} />
            <Text style={styles.textCard}>Send a File</Text>
          </View>
          {props.isLoadingUploadFile ? <ActivityIndicator size="small" color="#0000ff" /> : null}
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
    paddingBottom: 0
  },
  containerBottomSheet: {
    marginTop: 20
  },
  card: {
    height: 52,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.alto
  },
  wrapCardImage: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textCard: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: colors.black,
    paddingLeft: 9
  }
});

export default BottomSheetAttachment;
