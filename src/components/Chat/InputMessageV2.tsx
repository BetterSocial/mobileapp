import * as React from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import ToastMessage from 'react-native-toast-message';
import IconSend from '../../assets/icon/IconSendComment';
import dimen from '../../utils/dimen';
import {normalizeFontSize} from '../../utils/fonts';
import ToggleSwitch from '../ToggleSwitch';
import SheetEmoji from './SheetEmoji';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: dimen.normalizeDimen(6)
  },
  btnEmoji: {
    width: dimen.normalizeDimen(24),
    height: dimen.normalizeDimen(24),
    borderRadius: dimen.normalizeDimen(24 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginBottom: dimen.normalizeDimen(4)
  },
  icSendButton: {
    alignSelf: 'center'
  },
  containerInput: {
    flex: 1,
    backgroundColor: COLORS.lightgrey,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: dimen.normalizeDimen(6),
    paddingHorizontal: dimen.normalizeDimen(8),
    borderRadius: dimen.normalizeDimen(12),
    minHeight: dimen.normalizeDimen(32),
    marginHorizontal: dimen.normalizeDimen(6)
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightgrey,
    color: COLORS.black,
    fontFamily: 'Inter',
    fontSize: normalizeFontSize(14),
    fontStyle: 'normal',
    fontWeight: '400',
    marginRight: dimen.normalizeDimen(12),
    minHeight: dimen.normalizeDimen(20),
    maxHeight: dimen.normalizeDimen(80),
    textAlignVertical: 'center',
    paddingTop: dimen.normalizeDimen(2)
  },
  btn: {
    borderRadius: dimen.normalizeDimen(32 / 2),
    width: dimen.normalizeDimen(32),
    height: dimen.normalizeDimen(32),
    display: 'flex'
  },
  enableButton: {
    backgroundColor: COLORS.holyTosca
  },
  disableButton: {
    backgroundColor: COLORS.gray9
  },
  previewPhotoContainer: {
    marginTop: dimen.normalizeDimen(5),
    marginBottom: dimen.normalizeDimen(5)
  },
  imageStyle: {
    height: dimen.normalizeDimen(64),
    width: dimen.normalizeDimen(64),
    marginRight: dimen.normalizeDimen(10)
  },
  containerDelete: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: dimen.normalizeDimen(25),
    width: dimen.normalizeDimen(25),
    backgroundColor: COLORS.holyTosca,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: dimen.normalizeDimen(100),
    borderRadius: dimen.normalizeDimen(13)
  },
  labelToggle: {
    fontSize: dimen.normalizeDimen(8),
    fontWeight: '400'
  }
});

export interface InputMessageV2Props {
  onSendButtonClicked: (message: string) => void;
  type: 'SIGNED' | 'ANONYMOUS';
  emojiCode?: string;
  emojiColor?: string;
  username?: string;
  profileImage?: string;
  onToggleConfirm?: () => void;
  isShowToggle?: boolean;
  messageDisable?: string | null;
}

const InputMessageV2 = ({
  onSendButtonClicked,
  emojiCode,
  emojiColor,
  profileImage,
  username,
  onToggleConfirm,
  type,
  isShowToggle = true,
  messageDisable
}: InputMessageV2Props) => {
  const refEmoji = React.useRef(null);
  const [inputFocus, setInputFocus] = React.useState(false);
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

  const sendButtonStyle = React.useCallback(() => {
    const isDisabled = isDisableButton();
    if (isDisabled) return COLORS.gray9;
    if (type === 'SIGNED') return COLORS.blue;
    return COLORS.holyTosca;
  }, [isDisableButton()]);

  const toggleChnage = () => {
    if (messageDisable) {
      ToastMessage.show({
        type: 'asNative',
        text1: messageDisable,
        position: 'bottom'
      });
      return;
    }

    Alert.alert(
      '',
      type === 'ANONYMOUS'
        ? `Switch back to regular chat?\nMessage ${username} using your username.`
        : 'Switch to anonymous chat?\nMessage this user anonymously instead.',
      [
        {
          text: 'Cancel'
        },
        {text: 'Yes, move to other chat', onPress: onToggleConfirm}
      ]
    );
  };

  return (
    <View style={styles.main}>
      {emojiCode ? (
        <View style={[styles.btnEmoji, {backgroundColor: emojiColor}]}>
          <Text style={{textAlign: 'center', textAlignVertical: 'center'}}>{emojiCode}</Text>
        </View>
      ) : (
        <Image source={{uri: profileImage}} style={styles.btnEmoji} />
      )}
      <View style={styles.containerInput}>
        <TextInput
          multiline
          style={styles.input}
          onChangeText={onChangeInput}
          value={text}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          numberOfLines={4}
        />
        {isShowToggle && (
          <ToggleSwitch
            labelLeft={!inputFocus ? 'Anonymity' : undefined}
            styleLabelLeft={[
              styles.labelToggle,
              {color: type === 'ANONYMOUS' ? COLORS.gray8 : COLORS.blue}
            ]}
            onValueChange={toggleChnage}
            value={type === 'ANONYMOUS'}
          />
        )}
      </View>
      <TouchableOpacity
        style={[styles.btn, isDisableButton() ? styles.disableButton : styles.enableButton]}
        disabled={isDisableButton()}
        onPress={handleSendMessage}>
        <IconSend
          style={styles.icSendButton}
          fillBackground={sendButtonStyle()}
          fillIcon={COLORS.white}
        />
      </TouchableOpacity>
      <SheetEmoji ref={refEmoji} selectEmoji={onSelectEmoji} />
    </View>
  );
};

export default React.memo(InputMessageV2);
