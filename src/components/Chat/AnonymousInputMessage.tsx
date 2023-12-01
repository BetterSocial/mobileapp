import * as React from 'react';
import {Alert, Linking, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';

import IconSend from '../../assets/icon/IconSendComment';
import IconPlusAttachment from '../../assets/icon/IconPlusAttachment';
import {colors} from '../../utils/colors';
import BottomSheetAttachment from '../../screens/ProfileScreen/elements/BottomSheetAttachment';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';
import ImageUtils from '../../utils/image';

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9
  },
  input: {
    flex: 1,
    backgroundColor: colors.lightgrey,
    maxHeight: 100,
    borderRadius: 8,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 9
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
  onSendButtonClicked: (message: string, attachments: any) => void;
  type: 'SIGNED' | 'ANONYMOUS';
}

const AnonymousInputMessage = ({onSendButtonClicked, type}: AnonymousInputMessageProps) => {
  const refEmoji = React.useRef(null);
  const refAttachment = React.useRef(null);
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
    refEmoji.current.open();
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
    if (type === 'SIGNED') return colors.darkBlue;
    return colors.bondi_blue;
  }, [isDisableButton()]);

  const plusButtonStyle = React.useCallback(() => {
    if (type === 'SIGNED') return colors.darkBlue;
    return colors.bondi_blue;
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerInput}>
          <TextInput
            multiline
            style={styles.input}
            onChangeText={onChangeInput}
            value={text?.trim()}
          />
          {text?.trim() !== '' && (
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
          )}
          {text?.trim() === '' && (
            <TouchableOpacity style={styles.btn} onPress={onSelectAttachment}>
              <IconPlusAttachment style={styles.icSendButton} fillIcon={plusButtonStyle()} />
            </TouchableOpacity>
          )}
        </View>
      </View>

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
    </>
  );
};

export default React.memo(AnonymousInputMessage);
