import Modal from 'react-native-modal';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const ModalActionAnonymous = (props) => {
  const {isOpen, name, onCloseModal, onPress, selectedUser} = props;
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
        <TouchableOpacity onPress={() => onPress('block', selectedUser)} style={styles.buttonStyle}>
          <Text style={styles.textButton}>Block {name}</Text>
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

export default React.memo(ModalActionAnonymous);
