import * as React from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback, ActivityIndicator} from 'react-native';

import {fonts} from '../../../utils/fonts';
import {BottomSheet} from '../../../components/BottomSheet';
import UserIcon from '../../../assets/icons/images/user.svg';
import TrashIcon from '../../../assets/icons/images/trash.svg';
import MediaIcon from '../../../assets/icons/images/media.svg';
import CameraIcon from '../../../assets/icons/images/camera.svg';
import {COLORS} from '../../../utils/theme';

const BottomSheetImage = React.forwardRef((props, ref) => (
  <BottomSheet ref={ref} closeOnPressMask={true} height={300}>
    <View style={styles.containerBottomSheet}>
      <TouchableNativeFeedback onPress={() => props.onViewProfilePicture()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <UserIcon width={16.67} height={16.67} fill={COLORS.black} />
            <Text style={styles.textCard}>View profile picture</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => props.onOpenImageGalery()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <MediaIcon width={16.67} height={16.67} fill={COLORS.black} />
            <Text style={styles.textCard}>Upload from library</Text>
          </View>
          {props.isLoadingUpdateImageGalery ? (
            <ActivityIndicator size="small" color={COLORS.darkBlue} />
          ) : null}
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => props.onOpenCamera()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <CameraIcon width={16.67} height={16.67} fill={COLORS.black} />
            <Text style={styles.textCard}>Take a photo</Text>
          </View>
          {props.isLoadingUpdateImageCamera ? (
            <ActivityIndicator size="small" color={COLORS.darkBlue} />
          ) : null}
        </View>
      </TouchableNativeFeedback>

      <TouchableNativeFeedback onPress={() => props.handleRemoveImageProfile()}>
        <View style={styles.card}>
          <View style={styles.wrapCardImage}>
            <TrashIcon width={16.67} height={16.67} fill={COLORS.black} />
            <Text style={styles.textCard}>Remove current picture</Text>
          </View>
          {props.isLoadingRemoveImage ? (
            <ActivityIndicator size="small" color={COLORS.darkBlue} />
          ) : null}
        </View>
      </TouchableNativeFeedback>
    </View>
  </BottomSheet>
));
BottomSheetImage.displayName = 'BottomSheetImage';
const styles = StyleSheet.create({
  containerBottomSheet: {
    flexDirection: 'column'
  },
  card: {
    height: 52,
    backgroundColor: COLORS.wildSand,
    borderRadius: 8,
    paddingLeft: 21,
    paddingRight: 21,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
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

export default BottomSheetImage;
