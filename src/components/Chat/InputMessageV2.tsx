/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import ToastMessage from 'react-native-toast-message';

import IconSend from '../../assets/icon/IconSendComment';
import IconPlusAttachment from '../../assets/icon/IconPlusAttachment';
import {colors} from '../../utils/colors';
import dimen from '../../utils/dimen';
import {normalizeFontSize} from '../../utils/fonts';
import ToggleSwitch from '../ToggleSwitch';
import BottomSheetAttachment from './BottomSheetAttachment';
import BottomSheetGif from './BottomSheetGif';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';
import ImageUtils from '../../utils/image';
import {ANONYMOUS, SIGNED} from '../../hooks/core/constant';

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
  onSendButtonClicked: (message: string, attachments: any) => void;
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
  const refAttachment = React.useRef(null);
  const refGif = React.useRef(null);
  const [inputFocus, setInputFocus] = React.useState(false);
  const [text, setText] = React.useState('');
  const [isLoadingUploadImageMedia, setIsLoadingUploadImageMedia] = React.useState(false);
  const [isLoadingUploadImageCamera, setIsLoadingUploadImageCamera] = React.useState(false);

  const handleUploadMedia = async (medias) => {
    setIsLoadingUploadImageMedia(true);

    const resultUrls = medias.map((media) => ({
      type: media.type,
      asset_url: media.path,
      thumb_url: media.path,
      myCustomField: media.type,
      video_path: media?.pathVideo ?? null
    }));
    console.warn('resultUrls', resultUrls);
    onSendButtonClicked(' ', resultUrls);
    setIsLoadingUploadImageMedia(false);
  };

  const handleUploadCamera = async (path) => {
    setIsLoadingUploadImageCamera(true);

    const resultUrls: any = [];
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

  const handleSelectGIF = (gifPath, gifPathSmall) => {
    onCloseGIF();
    const resultUrls = [
      {
        type: 'gif',
        asset_url: gifPath,
        thumb_url: gifPathSmall,
        myCustomField: 'gif',
        gif_path: gifPath
      }
    ];
    console.warn('resultUrls', resultUrls);
    onSendButtonClicked(' ', resultUrls);
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

  const processImage = async (image) => {
    const imageCropped = await ImagePicker.openCropper({
      mediaType: 'photo',
      path: image.path,
      cropperChooseText: 'Next',
      freeStyleCropEnabled: true
    });
    return imageCropped.path;
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getVideoThumbnail = async (videoPath) => {
    try {
      const thumbnail = await createThumbnail({
        url: videoPath,
        timeStamp: 1000
      });
      return thumbnail.path;
    } catch (error) {
      console.error('Error generating thumbnail', error);
      return null;
    }
  };

  const processMediasSequentially = async (medias, delayTime) => {
    const newMedias: any = [];
    for (const media of medias) {
      if (media?.mime?.includes('video')) {
        const thumbnailPath = await getVideoThumbnail(media.path);
        newMedias.push({type: 'video', path: thumbnailPath, pathVideo: media.path});
      } else {
        const croppedImage = await processImage(media);
        newMedias.push({type: 'photo', path: croppedImage});
        await delay(delayTime);
      }
    }
    return newMedias;
  };

  const onOpenMedia = async () => {
    const {success} = await requestExternalStoragePermission();
    if (success) {
      ImagePicker.openPicker({
        multiple: true,
        maxFiles: 20
      }).then(async (medias) => {
        const newMedias = await processMediasSequentially(medias, 200);

        handleUploadMedia(newMedias);
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
        mediaType: 'photo'
      }).then(async (imageRes) => {
        const imageCropped = await ImagePicker.openCropper({
          mediaType: 'photo',
          path: imageRes.path,
          cropperChooseText: 'Next',
          freeStyleCropEnabled: true
        });
        handleUploadCamera(imageCropped.path);
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

  const onOpenGIF = () => {
    refAttachment.current.close();
    setTimeout(() => {
      refGif.current.open();
    }, 500);
  };

  const onCloseGIF = () => {
    refGif.current.close();
  };

  const onSelectAttachment = () => {
    refAttachment.current.open();
  };

  const handleSendMessage = () => {
    onSendButtonClicked(text, []);
    setText('');
  };

  const isDisableButton = () => {
    return text?.length === 0;
  };

  const sendButtonStyle = React.useCallback(() => {
    const isDisabled = isDisableButton();
    if (isDisabled) return colors.gray1;
    if (type === SIGNED) return colors.darkBlue;
    return colors.bondi_blue;
  }, [isDisableButton()]);

  const toggleChange = () => {
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
      type === ANONYMOUS
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
    if (type === SIGNED) return colors.darkBlue;
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
              {color: type === ANONYMOUS ? colors.gray : colors.blue}
            ]}
            onValueChange={toggleChange}
            value={type === ANONYMOUS}
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

      <BottomSheetAttachment
        ref={refAttachment}
        onOpenMedia={onOpenMedia}
        onOpenGIF={onOpenGIF}
        onOpenCamera={onOpenCamera}
        onOpenFile={onOpenFile}
        isLoadingUploadMedia={isLoadingUploadImageMedia}
        isLoadingUploadGIF={false}
        isLoadingUploadCamera={isLoadingUploadImageCamera}
        isLoadingUploadFile={false}
      />

      <BottomSheetGif ref={refGif} onCancel={onCloseGIF} onSelect={handleSelectGIF} />
    </View>
  );
};

export default React.memo(InputMessageV2);
