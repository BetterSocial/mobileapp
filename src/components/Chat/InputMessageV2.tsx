import * as React from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';

import ToastMessage from 'react-native-toast-message';
import IconSend from '../../assets/icon/IconSendComment';
import IconPlusAttachment from '../../assets/icon/IconPlusAttachment';
import {colors} from '../../utils/colors';
import dimen from '../../utils/dimen';
import {normalizeFontSize} from '../../utils/fonts';
import ToggleSwitch from '../ToggleSwitch';
import SheetEmoji from './SheetEmoji';
import BottomSheetAttachment from '../../screens/ProfileScreen/elements/BottomSheetAttachment';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';
import ImageUtils from '../../utils/image';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
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
    flexShrink: 0,
    marginBottom: dimen.normalizeDimen(4)
  },
  icSendButton: {
    alignSelf: 'center'
  },
  containerInput: {
    flex: 1,
    backgroundColor: colors.lightgrey,
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
    backgroundColor: colors.lightgrey,
    color: colors.black,
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
  const refAttachment = React.useRef(null);
  const [inputFocus, setInputFocus] = React.useState(false);
  const [text, setText] = React.useState('');
  const [isLoadingUploadImageMedia, setIsLoadingUploadImageMedia] = React.useState(false);
  const [isLoadingUploadImageCamera, setIsLoadingUploadImageCamera] = React.useState(false);

  const handleUploadMedia = async (paths) => {
    setIsLoadingUploadImageMedia(true);

    const resultUrls = paths.map((path) => ({
      type: 'image',
      asset_url: path,
      thumb_url: path,
      myCustomField: 'image'
    }));
    console.warn('resultUrls', resultUrls);
    onSendButtonClicked(' ', resultUrls);
    setIsLoadingUploadImageMedia(false);
  };

  const handleUploadCamera = async (path) => {
    setIsLoadingUploadImageCamera(true);

    const resultUrls = [];
    const uploadedImageUrl = await ImageUtils.uploadImageWithoutAuth(path);
    resultUrls.push({
      type: 'image',
      asset_url: uploadedImageUrl,
      thumb_url: uploadedImageUrl,
      myCustomField: 'image'
    });

    onSendButtonClicked(' ', resultUrls);
    setIsLoadingUploadImageCamera(false);
  };

  const openSettingApp = () => {
    Linking.openSettings();
  };

  const openAlertPermission = (message) => {
    Alert.alert('Permission Denied', message, [
      {text: 'Open Settings', onPress: openSettingApp},
      {text: 'Close'}
    ]);
  };

  const onOpenMedia = async () => {
    const {success} = await requestExternalStoragePermission();
    if (success) {
      ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true,
        multiple: true,
        maxFiles: 20
      }).then(async (images) => {
        const allPromises: Promise<void>[] = images.map(async (image) => {
          const imageCropped = await ImagePicker.openCropper({
            path: image.path,
            width: 512,
            height: 512
          });
          return imageCropped.path;
        });

        const newImages = await Promise.all(allPromises);

        handleUploadMedia(newImages, 'gallery');
      });
    } else {
      openAlertPermission(
        'We’re not able to access your photos, please adjust your permission settings for BetterSocial.'
      );
    }
  };

  const onOpenCamera = async () => {
    const {success} = await requestCameraPermission();
    if (success) {
      ImagePicker.openCamera({
        width: 512,
        height: 512,
        cropping: true,
        mediaType: 'photo'
      }).then((imageRes) => {
        handleUploadCamera(imageRes.path);
      });
    } else {
      openAlertPermission(
        'We’re not able to access your camera, please adjust your permission settings for BetterSocial.'
      );
    }
  };

  const onOpenFile = async () => {
    const {success} = await requestExternalStoragePermission();
    if (success) {
      DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory'
      }).then((pickerResult) => {
        console.warn('pickerResult', pickerResult);
        //
      });
    } else {
      openAlertPermission(
        'We’re not able to access your document library, please adjust your permission settings for BetterSocial.'
      );
    }
  };

  const onChangeInput = (v) => {
    setText(v);
  };
  const onSelectEmoji = () => {
    refEmoji.current.close();
  };

  const onSelectAttachment = () => {
    refAttachment.current.open();
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

  const plusButtonStyle = React.useCallback(() => {
    if (type === 'SIGNED') return colors.darkBlue;
    return colors.bondi_blue;
  }, []);

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
              {color: type === 'ANONYMOUS' ? colors.gray : colors.blue}
            ]}
            onValueChange={toggleChnage}
            value={type === 'ANONYMOUS'}
          />
        )}
      </View>
      {text?.trim() !== '' && (
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
      )}
      {text?.trim() === '' && (
        <TouchableOpacity style={styles.btn} onPress={onSelectAttachment}>
          <IconPlusAttachment style={styles.icSendButton} fillIcon={plusButtonStyle()} />
        </TouchableOpacity>
      )}
      <SheetEmoji ref={refEmoji} selectEmoji={onSelectEmoji} />

      <BottomSheetAttachment
        ref={refAttachment}
        onOpenMedia={onOpenMedia}
        onOpenGIF={onSelectEmoji}
        onOpenCamera={onOpenCamera}
        onOpenFile={onOpenFile}
        isLoadingUploadMedia={isLoadingUploadImageMedia}
        isLoadingUploadGIF={false}
        isLoadingUploadCamera={isLoadingUploadImageCamera}
        isLoadingUploadFile={false}
      />
    </View>
  );
};

export default React.memo(InputMessageV2);
