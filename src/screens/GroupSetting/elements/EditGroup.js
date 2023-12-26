import * as React from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import DefaultChatGroupProfilePicture from '../../../assets/images/default-group-picture.png';
import MemoIc_pencil from '../../../assets/icons/Ic_pencil';
import {COLORS} from '../../../utils/theme';
import {Context} from '../../../context';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';

const EditGroup = ({
  editName,
  setEditName,
  onUpdateImage,
  imageUri,
  isFocusChatName = false,
  saveGroupName
}) => {
  const [groupChat] = React.useContext(Context).groupChat;
  const countUser = Object.entries(groupChat.participants).length;

  const inputChatNameRef = React.useRef();

  React.useEffect(() => {
    if (inputChatNameRef && isFocusChatName) {
      inputChatNameRef.current.focus();
    }
  }, [inputChatNameRef, isFocusChatName]);

  const renderImage = (source) => {
    if (source && source.indexOf('file:///') > -1) {
      return <Image testID="fileImage" source={{uri: source}} style={styles.image} />;
    }
    if (source && source.length > 0) {
      if (source.indexOf('res.cloudinary.com') > -1) {
        return <Image testID="rescloud" source={{uri: source}} style={styles.image} />;
      }

      return <Image source={{uri: `data:image/jpg;base64,${source}`}} style={styles.image} />;
    }
    if (countUser > 2) {
      return (
        <Image
          testID="imageCountUser"
          source={DefaultChatGroupProfilePicture}
          style={styles.image}
        />
      );
    }
    return (
      <View testID="imagePencil">
        <MemoIc_pencil width={25} height={25} color={COLORS.lightgrey} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemEdit}>
        <TouchableOpacity
          testID="updateImage"
          style={styles.btnUpdatePhoto}
          onPress={onUpdateImage}>
          {renderImage(imageUri)}
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputChatNameRef}
            style={styles.editName}
            value={editName}
            onChangeText={setEditName}
            selectTextOnFocus
            onBlur={saveGroupName}
            testID="onInputChange"
            multiline
            textAlignVertical="top"
          />
        </View>
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
    borderRadius: normalize(48 / 2)
  },
  editName: {
    color: COLORS.white,
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    flex: 1
  },
  inputContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1
  },
  itemEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  textDesc: {
    color: COLORS.white,
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(18)
  },
  container: {
    backgroundColor: COLORS.anon_primary,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightgrey,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  btnUpdatePhoto: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(24),
    backgroundColor: COLORS.lightgrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 17
  }
});
