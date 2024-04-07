import * as React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MemoIcCamera from '../../../assets/icons/Ic_camera';
import MemoIcCreatePoll from '../../../assets/icons/ic_create_poll';
import MemoIcMedia from '../../../assets/icons/Ic_media';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import dimen from '../../../utils/dimen';

export type SheetMediaProps = {
  refMedia: React.RefObject<RBSheet>;
  uploadFromMedia: () => void;
  takePhoto: () => void;
  createPoll: () => void;
  medias?: string[];
  isLoadingUploadingMedia?: boolean;
  isLoadingUploadingPhoto?: boolean;
};

export type ListProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isLoading?: boolean;
};

const SheetMedia = ({
  refMedia,
  uploadFromMedia,
  takePhoto,
  createPoll,
  medias = [],
  isLoadingUploadingMedia = false,
  isLoadingUploadingPhoto = false
}: SheetMediaProps) => (
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
          icon={<MemoIcCreatePoll width={16.67} height={16.67} fill={COLORS.white} />}
          onPress={createPoll}
        />
      )}
      <List
        label="Upload media from library"
        icon={<MemoIcMedia width={16.67} height={16.67} fill={COLORS.white} />}
        onPress={uploadFromMedia}
        isLoading={isLoadingUploadingMedia}
      />
      <List
        label="Take a photo"
        icon={<MemoIcCamera width={16.67} height={16.67} fill={COLORS.white} />}
        onPress={takePhoto}
        isLoading={isLoadingUploadingPhoto}
      />
    </View>
  </RBSheet>
);

const List = ({icon, label, onPress, isLoading = false}: ListProps) => (
  <TouchableOpacity style={styles.list} onPress={onPress}>
    {icon}
    <Text style={styles.labelList}>{label}</Text>
    {isLoading ? (
      <ActivityIndicator size="small" color={COLORS.white} style={styles.loader} />
    ) : (
      <></>
    )}
  </TouchableOpacity>
);
export default SheetMedia;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingTop: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(38)
  },
  list: {
    flexDirection: 'row',
    paddingVertical: dimen.normalizeDimen(17.67),
    paddingLeft: dimen.normalizeDimen(21.67),
    backgroundColor: COLORS.gray110,
    borderRadius: 8,
    marginBottom: dimen.normalizeDimen(12),
    alignItems: 'center'
  },
  labelList: {
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(14),
    color: COLORS.black,
    paddingLeft: dimen.normalizeDimen(8),
    flex: 1
  },
  containerSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: COLORS.almostBlack
  },
  draggableIcon: {
    backgroundColor: COLORS.gray110
  },
  loader: {
    marginRight: dimen.normalizeDimen(10)
  }
});
