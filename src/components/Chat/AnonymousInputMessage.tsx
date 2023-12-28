import * as React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

import IconSend from '../../assets/icon/IconSendComment';
import {colors} from '../../utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  btnEmoji: {
    paddingVertical: 7,
    paddingHorizontal: 6
  },
  icSendButton: {
    alignSelf: 'center'
  },
  btnPicture: {
    paddingVertical: 7,
    paddingRight: 7,
    paddingLeft: 6
  },
  containerInput: {
    backgroundColor: colors.lightgrey,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    borderRadius: 8
  },
  input: {
    flex: 1,
    backgroundColor: colors.lightgrey,
    maxHeight: 100
  },
  btn: {
    borderRadius: 18,
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 8
  },
  previewPhotoContainer: {
    marginTop: 5,
    marginBottom: 5
  },
  imageStyle: {
    height: 64,
    width: 64,
    marginRight: 10
  },
  containerDelete: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 25,
    width: 25,
    backgroundColor: colors.holytosca,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    borderRadius: 13
  }
});

export interface AnonymousInputMessageProps {
  onSendButtonClicked: (message: string) => void;
  type: 'SIGNED' | 'ANONYMOUS';
}

const AnonymousInputMessage = ({onSendButtonClicked, type}: AnonymousInputMessageProps) => {
  const [text, setText] = React.useState('');

  const onChangeInput = (v) => {
    setText(v);
  };

  const handleSendMessage = () => {
    onSendButtonClicked(text);
    setText('');
  };

  const isDisableButton = () => {
    return text?.length === 0;
  };

  const sendButtonStyle = React.useCallback(() => {
    const isDisabled = isDisableButton();
    if (isDisabled) return colors.gray1;
    if (type === 'SIGNED') return colors.darkBlue;
    return colors.bondi_blue;
  }, [isDisableButton()]);

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput multiline style={styles.input} onChangeText={onChangeInput} value={text} />
        <TouchableOpacity
          style={styles.btn}
          disabled={isDisableButton()}
          onPress={handleSendMessage}>
          <IconSend
            style={styles.icSendButton}
            fillBackground={sendButtonStyle()}
            fillIcon={colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(AnonymousInputMessage);
