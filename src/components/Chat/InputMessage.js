import * as React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';

import {useMessageInputContext} from 'stream-chat-react-native';

import MemoIc_emoji from '../../assets/icons/Ic_emoji';
import MemoIc_Picture from '../../assets/icons/Ic_Picture';
import {colors} from '../../utils/colors';
import IconSend from '../../assets/icon/IconSendComment';
import SheetEmoji from './SheetEmoji';

const InputMessage = () => {
  const refEmoji = React.useRef(null);
  const {
    setText,
    text,
    appendText,
    sendMessage,
    toggleAttachmentPicker,
    ImageUploadPreview,
    imageUploads,
  } = useMessageInputContext();

  const onChangeInput = (v) => {
    setText(v);
  };
  const onShowPickerEmoji = () => {
    refEmoji.current.open();
  };
  const onSelectImoji = (emoji) => {
    appendText(emoji);
    refEmoji.current.close();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerInput}>
          <TextInput
            multiline
            style={styles.input}
            onChangeText={onChangeInput}
            value={text}
          />
          <TouchableOpacity
            style={styles.btnEmoji}
            onPress={() => onShowPickerEmoji()}>
            <MemoIc_emoji width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPicture}
            onPress={toggleAttachmentPicker}>
            <MemoIc_Picture width={20} height={20} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.btn(text || imageUploads.length !== 0)}
          onPress={sendMessage}>
          <IconSend style={styles.icSendButton} />
        </TouchableOpacity>
      </View>
      <SheetEmoji
        ref={refEmoji}
        selectEmoji={(emoji) => onSelectImoji(emoji)}
      />
    </>
  );
};

export default InputMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 4,
  },
  btnEmoji: {
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  icSendButton: {
    alignSelf: 'center',
  },
  btnPicture: {
    paddingVertical: 7,
    paddingRight: 7,
    paddingLeft: 6,
  },
  containerInput: {
    flex: 1,
    backgroundColor: colors.lightgrey,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 9,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.lightgrey,
  },
  btn: (enabled) => ({
    backgroundColor: enabled ? colors.bondi_blue : colors.gray1,
    borderRadius: 18,
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 8,
  }),
});
