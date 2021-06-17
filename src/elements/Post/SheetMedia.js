import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';

import MemoIc_camera from '../../assets/icons/Ic_camera';
import MemoIcCreatePoll from '../../assets/icons/ic_create_poll';
import MemoIc_media from '../../assets/icons/Ic_media';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const SheetMedia = ({
  refMedia,
  uploadFromMedia,
  takePhoto,
  createPoll,
  medias = [],
}) => {
  return (
    <RBSheet
      ref={refMedia}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
        draggableIcon: {
          backgroundColor: colors.alto,
        },
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
        />
        <List
          label="Take a photo"
          icon={<MemoIc_camera width={16.67} height={16.67} />}
          onPress={takePhoto}
        />
      </View>
    </RBSheet>
  );
};
const List = ({icon, label, onPress}) => (
  <TouchableOpacity style={styles.list} onPress={onPress}>
    {icon}
    <Text style={styles.labelList}>{label}</Text>
  </TouchableOpacity>
);
export default SheetMedia;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 38,
  },
  list: {
    flexDirection: 'row',
    paddingVertical: 17.67,
    paddingLeft: 21.67,
    backgroundColor: colors.lightgrey,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  labelList: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: colors.black,
    paddingLeft: 8,
  },
});
