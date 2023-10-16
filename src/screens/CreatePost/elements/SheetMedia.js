import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MemoIcCreatePoll from '../../../assets/icons/ic_create_poll';
import MemoIc_camera from '../../../assets/icons/Ic_camera';
import MemoIc_media from '../../../assets/icons/Ic_media';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

/**
 * @typedef {Object} SheetMediaProps
 * @property {React.MutableRefObject<RBSheet>} refMedia
 * @property {() => void} uploadFromMedia
 * @property {() => void} takePhoto
 * @property {() => void} createPoll
 * @property {Array} medias
 * @property {boolean} isLoadingUploadingMedia
 * @property {boolean} isLoadingUploadingPhoto
 */

/**
 *
 * @param {SheetMediaProps} param0
 * @returns
 */
const SheetMedia = ({
  refMedia,
  uploadFromMedia,
  takePhoto,
  createPoll,
  medias = [],
  isLoadingUploadingMedia = false,
  isLoadingUploadingPhoto = false
}) => (
  <RBSheet
    ref={refMedia}
    closeOnDragDown={true}
    closeOnPressMask={true}
    customStyles={{
      container: styles.containerSheet,
      draggableIcon: styles.draggableIcon
    }}>
    <View style={styles.container}>
      {medias.length === 0 && (
        <List
          label="Add a poll"
          icon={<MemoIcCreatePoll width={16.67} height={16.67} />}
          onPress={createPoll}
        />
      )}
      <List
        label="Upload media from library"
        icon={<MemoIc_media width={16.67} height={16.67} />}
        onPress={uploadFromMedia}
        isLoading={isLoadingUploadingMedia}
      />
      <List
        label="Take a photo"
        icon={<MemoIc_camera width={16.67} height={16.67} />}
        onPress={takePhoto}
        isLoading={isLoadingUploadingPhoto}
      />
    </View>
  </RBSheet>
);

/**
 * @typedef {Object} ListProps
 * @property {React.ReactNode} icon
 * @property {string} label
 * @property {() => void} onPress
 * @property {boolean} [isLoading]
 */

/**
 *
 * @param {ListProps} param0
 * @returns
 */
const List = ({icon, label, onPress, isLoading = false}) => (
  <TouchableOpacity style={styles.list} onPress={onPress}>
    {icon}
    <Text style={styles.labelList}>{label}</Text>
    {isLoading ? <ActivityIndicator size="small" color="#0000ff" style={styles.loader} /> : <></>}
  </TouchableOpacity>
);
export default SheetMedia;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 38
  },
  list: {
    flexDirection: 'row',
    paddingVertical: 17.67,
    paddingLeft: 21.67,
    backgroundColor: colors.lightgrey,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center'
  },
  labelList: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: colors.black,
    paddingLeft: 8,
    flex: 1
  },
  containerSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  draggableIcon: {
    backgroundColor: colors.alto
  },
  loader: {
    marginRight: 10
  }
});
