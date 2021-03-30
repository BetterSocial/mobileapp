import React from 'react';
import {forwardRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import UserIcon from '../../assets/icons/images/user.svg';
import MediaIcon from '../../assets/icons/images/media.svg';
import CameraIcon from '../../assets/icons/images/camera.svg';
import TrashIcon from '../../assets/icons/images/trash.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {BottomSheet} from '../../components/BottomSheet';

const BottomSheetImage = forwardRef((props, ref) => (
  <BottomSheet ref={ref} closeOnPressMask={true} height={300}>
    <View style={styles.containerBottomSheet}>
      <View style={styles.card}>
        <View style={styles.wrapCardImage}>
          <UserIcon width={16.67} height={16.67} fill={colors.black} />
          <Text style={styles.textCard}>View profile picture</Text>
        </View>
      </View>
      <TouchableNativeFeedback onPress={() => props.onOpenImageGalery()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <MediaIcon width={16.67} height={16.67} fill={colors.black} />
            <Text style={styles.textCard}>Upload from library</Text>
          </View>
          {props.isLoadingUpdateImageGalery ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null}
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => props.onOpenCamera()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <CameraIcon width={16.67} height={16.67} fill={colors.black} />
            <Text style={styles.textCard}>Take a photo</Text>
          </View>
          {props.isLoadingUpdateImageCamera ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null}
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => props.handleRemoveImageProfile()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <TrashIcon width={16.67} height={16.67} fill={colors.black} />
            <Text style={styles.textCard}>Remove current picture</Text>
          </View>
          {props.isLoadingRemoveImage ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null}
        </View>
      </TouchableNativeFeedback>
    </View>
  </BottomSheet>
));

const styles = StyleSheet.create({
  containerBottomSheet: {
    flexDirection: 'column',
  },
  card: {
    height: 52,
    backgroundColor: colors.wildSand,
    borderRadius: 8,
    paddingLeft: 21,
    paddingRight: 21,
    paddingTop: 17,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wrapCardImage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default BottomSheetImage;
