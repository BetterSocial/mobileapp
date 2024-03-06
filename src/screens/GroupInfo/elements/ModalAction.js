import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import SimpleToast from 'react-native-simple-toast';

import {ANONYMOUS, SIGNED} from '../../../hooks/core/constant';
import {COLORS} from '../../../utils/theme';
import Loading from '../../Loading';

const ModalAction = (props) => {
  const {
    isOpen,
    name,
    onCloseModal,
    onPress,
    selectedUser,
    isGroup = false,
    isLoadingInitChat = false,
    from
  } = props;
  const isAndroid = Platform.OS === 'android';
  const isAnon = selectedUser?.anon_user_info_color_code && selectedUser?.anon_user_info_emoji_code;

  const RenderButton = () => {
    switch (from) {
      case ANONYMOUS:
        if (isAnon) {
          return (
            <TouchableOpacity
              onPress={() => onPress('message', selectedUser)}
              style={styles.buttonStyle}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textButton}>Leave Incognito Mode</Text>
                <Loading visible={isLoadingInitChat} />
              </View>
            </TouchableOpacity>
          );
        }
        return (
          <>
            <TouchableOpacity
              onPress={() => onPress('message', selectedUser)}
              style={styles.buttonStyle}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textButton}>Leave Incognito Mode</Text>
                <Loading visible={isLoadingInitChat} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPress('view')} style={styles.buttonStyle}>
              <Text style={styles.textButton}>View {name}&apos;s Profile </Text>
            </TouchableOpacity>
          </>
        );
      case SIGNED:
        if (isAnon) {
          return (
            <TouchableOpacity
              onPress={() => {
                if (!selectedUser?.allow_anon_dm) {
                  return SimpleToast.show('This user does not allow messages in Incognito Mode.');
                }
                onPress('message-anonymously', selectedUser);
              }}
              style={styles.buttonStyle}>
              <Text
                numberOfLines={1}
                style={selectedUser?.allow_anon_dm ? styles.textButton : styles.disabledTextButton}>
                Message {name} Incognito
              </Text>
            </TouchableOpacity>
          );
        }
        return (
          <>
            {isGroup && (
              <TouchableOpacity
                onPress={() => {
                  if (!selectedUser?.allow_anon_dm) {
                    return SimpleToast.show('This user does not allow messages in Incognito Mode.');
                  }
                  onPress('message-anonymously', selectedUser);
                }}
                style={styles.buttonStyle}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.textButton}>Message {name}</Text>
                  <Loading visible={isLoadingInitChat} />
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                if (!selectedUser?.allow_anon_dm) {
                  return SimpleToast.show('This user does not allow messages in Incognito Mode.');
                }
                onPress('message-anonymously', selectedUser);
              }}
              style={styles.buttonStyle}>
              <Text
                numberOfLines={1}
                style={selectedUser?.allow_anon_dm ? styles.textButton : styles.disabledTextButton}>
                Message {name} Incognito
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPress('view')} style={styles.buttonStyle}>
              <Text style={styles.textButton}>View {name}&apos;s Profile </Text>
            </TouchableOpacity>
          </>
        );
      default:
        <></>;
    }
    return <></>;
  };

  return (
    <Modal
      animationInTiming={200}
      animationOutTiming={200}
      isVisible={isOpen}
      useNativeDriver={isAndroid}
      onBackdropPress={onCloseModal}
      {...props}>
      <View style={styles.modalContainer}>
        <RenderButton />
        {/* {isGroup && (
          <TouchableOpacity onPress={() => onPress('remove')} style={styles.buttonStyle}>
            <Text style={styles.textButton}>Remove {name} </Text>
          </TouchableOpacity>
        )} */}
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
    color: COLORS.gray300
  },
  textButton: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default React.memo(ModalAction);
