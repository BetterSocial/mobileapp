import * as React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
  Image,
  Alert
} from 'react-native';

import IconSend from '../../assets/icon/IconSendComment';
import SheetEmoji from './SheetEmoji';
import {colors} from '../../utils/colors';
import dimen from '../../utils/dimen';
import ToggleSwitch from '../ToggleSwitch';
import {normalizeFontSize} from '../../utils/fonts';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: dimen.normalizeDimen(6)
  },
  btnEmoji: {
    width: dimen.normalizeDimen(24),
    height: dimen.normalizeDimen(24),
    borderRadius: dimen.normalizeDimen(24 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  },
  icSendButton: {
    alignSelf: 'center'
  },
  btnPicture: {
    paddingVertical: dimen.normalizeDimen(7),
    paddingRight: dimen.normalizeDimen(7),
    paddingLeft: dimen.normalizeDimen(6)
  },
  containerInput: {
    backgroundColor: colors.lightgrey,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: dimen.normalizeDimen(4),
    paddingHorizontal: dimen.normalizeDimen(8),
    borderRadius: dimen.normalizeDimen(12),
    minHeight: dimen.normalizeDimen(32)
  },
  input: {
    flex: 1,
    backgroundColor: colors.lightgrey,
    maxHeight: dimen.normalizeDimen(100),
    color: colors.black,
    fontSize: normalizeFontSize(14),
    fontWeight: '400',
    marginRight: dimen.normalizeDimen(6)
  },
  btn: {
    borderRadius: dimen.normalizeDimen(32 / 2),
    width: dimen.normalizeDimen(32),
    height: dimen.normalizeDimen(32),
    display: 'flex',
    justifyContent: 'center'
  },
  enableButton: {
    backgroundColor: colors.bondi_blue
  },
  disableButton: {
    backgroundColor: colors.gray1
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
    backgroundColor: colors.holytosca,
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
  toggleConfirm?: () => void;
}

const InputMessageV2 = ({
  onSendButtonClicked,
  emojiCode,
  emojiColor,
  profileImage,
  username,
  toggleConfirm,
  type
}: InputMessageV2Props) => {
  const refEmoji = React.useRef(null);
  const [inputFocus, setInputFocus] = React.useState(false);
  const [alignItemsInput, setAlignItemsInput] = React.useState('center');
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
    if (isDisabled) return colors.gray1;
    if (type === 'SIGNED') return colors.darkBlue;
    return colors.bondi_blue;
  }, [isDisableButton()]);

  const toggleChnage = () => {
    Alert.alert(
      '',
      type === 'ANONYMOUS'
        ? `Switch back to regular chat? Message ${username} using your username.`
        : `Switch to anonymous chat? Message ${username} anonymously instead.`,
      [
        {
          text: 'Cancel'
        },
        {text: 'Yes, move to other chat', onPress: () => toggleConfirm}
      ]
    );
  };

  return (
    <View style={[styles.main, {alignItems: alignItemsInput as ViewStyle['alignItems']}]}>
      {emojiCode ? (
        <View style={[styles.btnEmoji, {backgroundColor: emojiColor}]}>
          <Text>{emojiCode}</Text>
        </View>
      ) : (
        <Image source={{uri: profileImage}} style={styles.btnEmoji} />
      )}
      <View style={styles.container}>
        <View style={styles.containerInput}>
          <TextInput
            multiline
            style={styles.input}
            onChangeText={onChangeInput}
            value={text}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            onContentSizeChange={(e) => {
              const {contentSize} = e.nativeEvent;
              if (contentSize.height >= 20) {
                setAlignItemsInput('flex-end');
              } else {
                setAlignItemsInput('center');
              }
            }}
          />
          <ToggleSwitch
            labelLeft={!inputFocus ? 'Anonymity' : undefined}
            containerStyle={{alignSelf: alignItemsInput as ViewStyle['alignItems']}}
            styleLabelLeft={[
              styles.labelToggle,
              {color: type === 'ANONYMOUS' ? colors.gray : colors.blue}
            ]}
            onValueChange={toggleChnage}
            value={type === 'ANONYMOUS'}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.btn, isDisableButton() ? styles.disableButton : styles.enableButton]}
        disabled={isDisableButton()}
        onPress={handleSendMessage}>
        <IconSend
          style={styles.icSendButton}
          fillBackground={sendButtonStyle()}
          fillIcon={colors.white}
        />
      </TouchableOpacity>
      <SheetEmoji ref={refEmoji} selectEmoji={onSelectEmoji} />
    </View>
  );
};

export default React.memo(InputMessageV2);
