import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MemoIc_camera from '../../assets/icons/Ic_camera';
import MemoIc_media from '../../assets/icons/Ic_media';
import MemoIc_user from '../../assets/icons/Ic_user';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const SheetMedia = ({refMedia, uploadFromMedia, takePhoto}) => {
  return (
    <RBSheet
      ref={refMedia}
      closeOnDragDown={true}
      closeOnPressMask={false}
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
        <List
          label="Create a poll"
          icon={<MemoIc_user width={16.67} height={16.67} />}
          onPress={() => {}}
        />
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
