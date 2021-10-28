import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import MemoIc_pencil from '../../../assets/icons/Ic_pencil';
import {Context} from '../../../context';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const EditGroup = ({editName, setEditName, onUpdateImage, imageUri}) => {
  const [groupChat] = React.useContext(Context).groupChat;
  let countUser = Object.entries(groupChat.participants).length;
  console.log('countUser');
  console.log(countUser);

  return (
    <View style={styles.container}>
      <View style={styles.itemEdit}>
        {countUser > 2 ? (
          <TouchableOpacity
            style={styles.btnUpdatePhoto}
            onPress={onUpdateImage}>
            {imageUri ? (
              <Image source={{uri: imageUri}} style={styles.image} />
            ) : (
              <MemoIc_pencil width={25} height={25} color={COLORS.gray1} />
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.btnUpdatePhoto}>
            {imageUri ? (
              <Image source={{uri: imageUri}} style={styles.image} />
            ) : (
              <MemoIc_pencil width={25} height={25} color={COLORS.gray1} />
            )}
          </View>
        )}
        {countUser > 2 ? (
          <TextInput
            style={styles.editName}
            value={editName}
            onChangeText={setEditName}
          />
        ) : (
          <Text style={styles.editName}>{editName}</Text>
        )}
      </View>
      <Text style={styles.textDesc}>Provide a group name and group icon</Text>
    </View>
  );
};

export default EditGroup;

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
  },
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
