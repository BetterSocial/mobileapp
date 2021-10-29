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
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import DefaultChatGroupProfilePicture from '../../../assets/images/default-group-picture.png';

const EditGroup = ({editName, setEditName, onUpdateImage, imageUri}) => {
  const [groupChat] = React.useContext(Context).groupChat;
  let countUser = Object.entries(groupChat.participants).length;

  const renderImage = (source) => {
    try {
      if (source && source.indexOf('file:///') > -1) {
        return <Image source={{uri: source}} style={styles.image} />;
      } else if (source && source.length > 0) {
        return (
          <Image
            source={{uri: `data:image/jpg;base64,${source}`}}
            style={styles.image}
          />
        );
      } else if (countUser > 2) {
        return (
          <Image source={DefaultChatGroupProfilePicture} style={styles.image} />
        );
      } else {
        return <MemoIc_pencil width={25} height={25} color={COLORS.gray1} />;
      }
    } catch (e) {
      return <MemoIc_pencil width={25} height={25} color={COLORS.gray1} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemEdit}>
        {true ? (
          <TouchableOpacity
            style={styles.btnUpdatePhoto}
            onPress={onUpdateImage}>
            {renderImage(imageUri)}
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
        {true ? (
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
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(48 / 2),
  },
  editName: {
    color: COLORS.white,
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
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
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(18),
  },
  container: {
    backgroundColor: COLORS.holyTosca,
    borderTopWidth: 1,
    borderTopColor: COLORS.alto,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  btnUpdatePhoto: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(24),
    backgroundColor: COLORS.alto,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 17,
  },
});
