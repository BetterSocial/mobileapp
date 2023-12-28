import Modal from 'react-native-modal';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Loading from '../../Loading';
import {COLORS} from '../../../utils/theme';

const ModalAction = (props) => {
  const {
    isOpen,
    name,
    onCloseModal,
    onPress,
    selectedUser,
    isGroup = false,
    isLoadingInitChat = false
  } = props;
  const isAndroid = Platform.OS === 'android';

  return (
    <Modal
      animationInTiming={200}
      animationOutTiming={200}
      isVisible={isOpen}
      useNativeDriver={isAndroid}
      onBackdropPress={onCloseModal}
      {...props}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          testID="pressMessage"
          onPress={() => onPress('message', selectedUser)}
          style={styles.buttonStyle}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.textButton}>Message {name}</Text>
            <Loading visible={isLoadingInitChat} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          testID="pressMessageAnonym"
          onPress={() => onPress('message-anonymously', selectedUser)}
          style={styles.buttonStyle}>
          <Text style={selectedUser?.allow_anon_dm ? styles.textButton : styles.disabledTextButton}>
            Message Anonymously
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="pressView"
          onPress={() => onPress('view')}
          style={styles.buttonStyle}>
          <Text style={styles.textButton}>View {name}&apos;s Profile </Text>
        </TouchableOpacity>
        {isGroup && (
          <TouchableOpacity
            testID="pressRemove"
            onPress={() => onPress('remove')}
            style={styles.buttonStyle}>
            <Text style={styles.textButton}>Remove {name} </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 24
  },
  buttonStyle: {
    paddingVertical: 18,
    justifyContent: 'center'
  },
  disabledTextButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray1
  },
  textButton: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default React.memo(ModalAction);
