import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MemoIc_pencil from '../../../assets/icons/Ic_pencil';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const EditGroup = ({editName, setEditName}) => {
  return (
    <View style={styles.container}>
      <View style={styles.itemEdit}>
        <TouchableOpacity style={styles.btnUpdatePhoto}>
          <MemoIc_pencil width={25} height={25} color={COLORS.gray1} />
        </TouchableOpacity>
        <TextInput
          style={styles.editName}
          value={editName}
          onChangeText={setEditName}
        />
      </View>
      <Text style={styles.textDesc}>Provide a group name and group icon</Text>
    </View>
  );
};

export default EditGroup;

const styles = StyleSheet.create({
  editName: {
    color: COLORS.white,
    fontFamily: fonts.inter[400],
    fontSize: 14,
    lineHeight: 24,
    flex: 1,
  },
  itemEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  textDesc: {
    color: COLORS.white,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
  },
  container: {
    backgroundColor: COLORS.holyTosca,
    borderTopWidth: 1,
    borderTopColor: COLORS.alto,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  btnUpdatePhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.alto,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 17,
  },
});
