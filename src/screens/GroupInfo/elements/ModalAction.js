import React from 'react';
import Modal from 'react-native-modal';
import {TouchableOpacity, Text, View, StyleSheet, Platform} from 'react-native';

const ModalAction = (props) => {
  const {isOpen, name, onCloseModal, onPress, selectedUser} = props;
  const isAndroid = Platform.OS === 'android'
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
          onPress={() => onPress('message', selectedUser)}
          style={styles.buttonStyle}>
          <Text style={styles.textButton}>Message {name}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress('view')} style={styles.buttonStyle}>
          <Text style={styles.textButton}>View {name}&apos;s Profile </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress('remove')} style={styles.buttonStyle}>
          <Text style={styles.textButton}>Remove {name} </Text>
        </TouchableOpacity>
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
  textButton: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default React.memo(ModalAction);
