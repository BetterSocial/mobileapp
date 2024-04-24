import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';

import {COLORS} from '../../../utils/theme';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import dimen from '../../../utils/dimen';

const ModalChangeName = (props) => {
  const {isOpen, name, onCloseModal, onSave} = props;
  const [groupName, setGroupName] = useState(name);
  const isAndroid = Platform.OS === 'android';

  const onChangeText = (value) => {
    if (/^[^!-\/:-@\[-`{-~]+$/.test(value) || value === '') {
      setGroupName(value);
    }
  };

  useEffect(() => {
    if (name) {
      setGroupName(name);
    }
  }, [name]);

  return (
    <Modal
      animationInTiming={200}
      animationOutTiming={200}
      isVisible={isOpen}
      useNativeDriver={isAndroid}
      onBackdropPress={onCloseModal}
      {...props}>
      <View style={styles.modalContainer}>
        <Text style={styles.titleText}>Edit Group Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={onChangeText}
            selectTextOnFocus
            testID="onInputChange"
            multiline
            textAlignVertical="top"
            maxLength={20}
          />
        </View>
        <Text style={styles.helperText}>{groupName.length}/20</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onCloseModal}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onSave(groupName)}
            disabled={groupName.trim().length <= 0}
            style={{marginLeft: dimen.normalizeDimen(32)}}>
            <Text
              style={[
                styles.buttonText,
                groupName.trim().length <= 0 ? {color: COLORS.gray400} : {}
              ]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: dimen.normalizeDimen(16),
    borderRadius: dimen.normalizeDimen(8)
  },
  titleText: {
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[700]
  },
  helperText: {
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[500],
    color: COLORS.gray400,
    marginTop: dimen.normalizeDimen(4)
  },
  inputContainer: {
    paddingTop: dimen.normalizeDimen(10),
    paddingBottom: dimen.normalizeDimen(14),
    paddingHorizontal: dimen.normalizeDimen(16),
    borderWidth: 1,
    borderColor: COLORS.signed_secondary,
    backgroundColor: COLORS.white,
    borderRadius: dimen.normalizeDimen(8),
    marginTop: dimen.normalizeDimen(12)
  },
  input: {
    color: COLORS.black,
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(14)
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: dimen.normalizeDimen(32)
  },
  buttonText: {
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[600],
    color: COLORS.black
  }
});

export default React.memo(ModalChangeName);
