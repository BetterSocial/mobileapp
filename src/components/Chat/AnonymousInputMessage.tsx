import * as React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

import IconSend from '../../assets/icon/IconSendComment';
import SheetEmoji from './SheetEmoji';
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
    padding: 9,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 8
  },
  input: {
    flex: 1,
    backgroundColor: colors.lightgrey
  },
  btn: {
    borderRadius: 18,
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 8
  },
  enableButton: {
    backgroundColor: colors.bondi_blue
  },
  disableButton: {
    backgroundColor: colors.gray1
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
}

const AnonymousInputMessage = ({onSendButtonClicked}: AnonymousInputMessageProps) => {
  const refEmoji = React.useRef(null);
  const [text, setText] = React.useState('');

  const onChangeInput = (v) => {
    setText(v);
  };
  const onSelectEmoji = () => {
    refEmoji.current.close();
  };

  const handleSendMessage = () => {
    onSendButtonClicked(text);
    setText('');
  };

  const isDisableButton = () => {
    return text?.length === 0;
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerInput}>
          <TextInput
            multiline
            style={styles.input}
            numberOfLines={5}
            onChangeText={onChangeInput}
            value={text}
          />
          <TouchableOpacity
            style={[styles.btn, isDisableButton() ? styles.disableButton : styles.enableButton]}
            disabled={isDisableButton()}
            onPress={handleSendMessage}>
            <IconSend style={styles.icSendButton} />
          </TouchableOpacity>
        </View>
      </View>

      <SheetEmoji ref={refEmoji} selectEmoji={onSelectEmoji} />
    </>
  );
};

export default AnonymousInputMessage;
