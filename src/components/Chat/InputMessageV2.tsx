/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import ToastMessage from 'react-native-toast-message';
import {Alert, Image, Linking, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';

import BottomSheetAttachment from './BottomSheetAttachment';
import BottomSheetGif from './BottomSheetGif';
import IconPlusAttachment from '../../assets/icon/IconPlusAttachment';
import ImageUtils from '../../utils/image';
import PressEventTrackingWrapper from '../Wrapper/PressEventTrackingWrapper';
import SendIcon from '../SendIcon';
import ToggleSwitch from '../ToggleSwitch';
import dimen from '../../utils/dimen';
import useAnalyticUtilsHook from '../../libraries/analytics/useAnalyticUtilsHook';
import {ANONYMOUS, SIGNED} from '../../hooks/core/constant';
import {BetterSocialEventTracking} from '../../libraries/analytics/analyticsEventTracking';
import {COLORS} from '../../utils/theme';
import {normalizeFontSize} from '../../utils/fonts';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
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
    backgroundColor: COLORS.gray110,
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
    backgroundColor: COLORS.gray110,
    color: COLORS.white,
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
    backgroundColor: COLORS.bondi_blue
  },
  disableButton: {
    backgroundColor: COLORS.gray1
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
    backgroundColor: COLORS.holytosca,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: dimen.normalizeDimen(100),
    borderRadius: dimen.normalizeDimen(13)
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
  isAnonimityEnabled?: boolean;
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
  messageDisable,
  isAnonimityEnabled = true
}: InputMessageV2Props) => {
  const refAttachment = React.useRef(null);
  const refGif = React.useRef(null);
  const [inputFocus, setInputFocus] = React.useState(false);
  const [text, setText] = React.useState('');
  const [isLoadingUploadImageMedia, setIsLoadingUploadImageMedia] = React.useState(false);
  const [isLoadingUploadImageCamera, setIsLoadingUploadImageCamera] = React.useState(false);
  const [isLoadingUploadImageFile, setIsLoadingUploadImageFile] = React.useState(false);
  const [isLoadingUploadImageGIF, setIsLoadingUploadImageGIF] = React.useState(false);
  const [isClosedByRef, setIsClosedByRef] = React.useState(false);

  const {eventTrackByUserType, getEventName} = useAnalyticUtilsHook(type);

  const handleUploadMedia = async (medias) => {
    setIsLoadingUploadImageMedia(true);

    const resultUrls = medias.map((media) => ({
      type: media.type,
      asset_url: media.path,
      thumb_url: media.path,
      myCustomField: media.type,
      video_path: media?.pathVideo ?? null,
      video_name: media?.nameVideo ?? null,
      video_type: media?.typeVideo ?? null
    }));
    onSendButtonClicked('Sent media 🏞️', resultUrls);
    setIsLoadingUploadImageMedia(false);
  };

  const handleUploadCamera = async (path) => {
    setIsLoadingUploadImageCamera(true);

    const resultUrls: any = [];
    const uploadedImageUrl = await ImageUtils.uploadImageWithoutAuth(path, {
      withFailedEventTrack: getEventName(
        BetterSocialEventTracking.SIGNED_CHAT_SCREEN_ATTACHMENT_MEDIA_UPLOAD_FILE,
        BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_ATTACHMENT_MEDIA_UPLOAD_FILE
      )
    });
    resultUrls.push({
      type: 'image',
      asset_url: uploadedImageUrl,
      thumb_url: uploadedImageUrl,
      myCustomField: 'image'
    });

    onSendButtonClicked('Sent media 🏞️', resultUrls);
    setIsLoadingUploadImageCamera(false);
  };

  const handleSelectGIF = (gifPath, gifPathSmall) => {
    setIsLoadingUploadImageGIF(true);
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
    onSendButtonClicked('Sent GIF 🏞️', resultUrls);
    setIsLoadingUploadImageGIF(false);
  };

  const handleFile = (file) => {
    const resultUrls = [
      {
        type: 'file',
        myCustomField: 'file',
        asset_url: file.uri,
        thumb_url: file.uri,
        file_name: file.name,
        file_size: file.size,
        file_path: file.uri
      }
    ];
    onSendButtonClicked('Sent a file 📁', resultUrls);
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

  const onOpenMedia = async () => {
    setIsLoadingUploadImageMedia(true);
    const {success} = await requestExternalStoragePermission();
    if (success) {
      eventTrackByUserType(
        BetterSocialEventTracking.SIGNED_CHAT_SCREEN_ATTACHMENT_CLICK_MEDIA,
        BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLICK_MEDIA
      );
      ImagePicker.openPicker({
        multiple: true,
        maxFiles: 20,
        sortOrder: 'asc',
        smartAlbums: ['RecentlyAdded', 'UserLibrary']
      })
        .then(async (medias) => {
          setIsLoadingUploadImageMedia(false);
          const newMedias: any = [];
          for (const media of medias) {
            if (media?.mime?.includes('video')) {
              const thumbnailPath = await getVideoThumbnail(media.path);
              newMedias.push({
                type: 'video',
                path: thumbnailPath,
                pathVideo: media.path,
                nameVideo: media.filename,
                typeVideo: media.mime
              });
            } else {
              const imageCropped = await ImagePicker.openCropper({
                mediaType: 'photo',
                path: media.path,
                width: media.width,
                height: media.height,
                cropperChooseText: 'Next',
                freeStyleCropEnabled: true
              });
              newMedias.push({type: 'image', path: imageCropped.path});
            }
          }

          setIsClosedByRef(true);
          handleUploadMedia(newMedias);
        })
        .catch(() => {
          setIsLoadingUploadImageMedia(false);
        });
    } else {
      setIsLoadingUploadImageMedia(false);
      openAlertPermission(
        'We’re not able to access your photos, please adjust your permission settings for Helio.'
      );
    }
  };

  const onOpenCamera = async () => {
    setIsLoadingUploadImageCamera(true);
    const {success} = await requestCameraPermission();
    if (success) {
      eventTrackByUserType(
        BetterSocialEventTracking.SIGNED_CHAT_SCREEN_ATTACHMENT_CLICK_CAMERA,
        BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLICK_CAMERA
      );
      ImagePicker.openCamera({
        mediaType: 'photo'
      })
        .then(async (imageRes) => {
          setIsLoadingUploadImageCamera(false);
          const imageCropped = await ImagePicker.openCropper({
            mediaType: 'photo',
            path: imageRes.path,
            width: imageRes.width,
            height: imageRes.height,
            cropperChooseText: 'Next',
            freeStyleCropEnabled: true
          });
          setIsClosedByRef(true);
          handleUploadCamera(imageCropped.path);
        })
        .catch(() => {
          setIsLoadingUploadImageCamera(false);
        });
    } else {
      setIsLoadingUploadImageCamera(false);
      openAlertPermission(
        'We’re not able to access your camera, please adjust your permission settings for Helio.'
      );
    }
  };

  const onOpenFile = async () => {
    setIsLoadingUploadImageFile(true);
    eventTrackByUserType(
      BetterSocialEventTracking.SIGNED_CHAT_SCREEN_ATTACHMENT_CLICK_FILE,
      BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLICK_FILE
    );
    DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen'
    })
      .then((pickerResult) => {
        setIsLoadingUploadImageFile(false);
        setIsClosedByRef(true);
        handleFile(pickerResult);
      })
      .catch(() => {
        setIsLoadingUploadImageFile(false);
      });
  };

  const onChangeInput = (v) => {
    setText(v);
  };

  const onOpenGIF = () => {
    setIsClosedByRef(true);
    setTimeout(() => {
      refGif.current.open();
      eventTrackByUserType(
        BetterSocialEventTracking.SIGNED_CHAT_SCREEN_ATTACHMENT_CLICK_GIF,
        BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLICK_GIF
      );
    }, 500);
  };

  const onCloseGIF = () => {
    refGif.current.close();
  };

  const onSelectAttachment = () => {
    refAttachment.current.open();
  };

  const handleSendMessage = () => {
    onSendButtonClicked(text?.trim(), []);
    setText('');
  };

  const isDisableButton = () => {
    return text?.length === 0;
  };

  const toggleChange = () => {
    if (messageDisable) {
      ToastMessage.show({
        type: 'asNative',
        text1: messageDisable,
        position: 'bottom'
      });
      return;
    }

    if (!isAnonimityEnabled) {
      ToastMessage.show({
        type: 'asNative',
        text1: 'This user does not want to receive anonymous messages',
        position: 'bottom'
      });
    } else {
      Alert.alert(
        '',
        type === ANONYMOUS
          ? `Switch back to regular chat?\nMessage ${username} using your username.`
          : 'Switch to anonymous chat?\nMessage this user in Incognito Mode instead.',
        [
          {
            text: 'Cancel',
            onPress: () =>
              eventTrackByUserType(
                BetterSocialEventTracking.SIGNED_CHAT_SCREEN_TOGGLE_MOVE_CHAT_CLOSE_ALERT,
                BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_TOGGLE_MOVE_CHAT_CLOSE_ALERT
              )
          },
          {text: 'Yes, move to other chat', onPress: onToggleConfirm}
        ]
      );
      eventTrackByUserType(
        BetterSocialEventTracking.SIGNED_CHAT_SCREEN_TOGGLE_MOVE_CHAT_OPEN_ALERT,
        BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_TOGGLE_MOVE_CHAT_OPEN_ALERT
      );
    }
  };

  const plusButtonStyle = React.useCallback(() => {
    if (type === SIGNED) return COLORS.signed_primary;
    return COLORS.anon_primary;
  }, []);

  const onCloseAttachmentSheet = () => {
    if (!isClosedByRef) {
      eventTrackByUserType(
        BetterSocialEventTracking.SIGNED_CHAT_SCREEN_ATTACHMENT_CLOSE_DRAWER,
        BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_ATTACHMENT_CLOSE_DRAWER
      );
    }
  };

  React.useEffect(() => {
    if (isClosedByRef) {
      refAttachment?.current?.close();
      setTimeout(() => {
        setIsClosedByRef(false);
      }, 500);
    }
  }, [isClosedByRef]);

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
          style={[
            styles.input,
            Platform.OS === 'android' ? {paddingBottom: dimen.normalizeDimen(2)} : {}
          ]}
          onChangeText={onChangeInput}
          value={text}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          numberOfLines={Platform.OS === 'android' ? 1 : 4}
          keyboardAppearance="dark"
        />
        {isShowToggle && (
          <ToggleSwitch
            labelLeft={
              !inputFocus ? (isAnonimityEnabled ? 'Incognito' : 'Incognito disabled') : undefined
            }
            styleLabelLeft={[
              {color: type === 'ANONYMOUS' ? COLORS.anon_primary : COLORS.signed_primary}
            ]}
            onValueChange={toggleChange}
            value={type === ANONYMOUS}
          />
        )}
      </View>
      {text?.trim() !== '' && (
        <PressEventTrackingWrapper
          name={getEventName(
            BetterSocialEventTracking.SIGNED_CHAT_SCREEN_SEND_BUTTON_CLICKED,
            BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_SEND_BUTTON_CLICKED
          )}
          style={[styles.btn, isDisableButton() ? styles.disableButton : styles.enableButton]}
          disabled={isDisableButton()}
          onPress={handleSendMessage}>
          <SendIcon type={type} isDisabled={isDisableButton()} />
        </PressEventTrackingWrapper>
      )}
      {text?.trim() === '' && (
        <PressEventTrackingWrapper
          style={styles.btn}
          onPress={onSelectAttachment}
          name={getEventName(
            BetterSocialEventTracking.SIGNED_CHAT_SCREEN_PLUS_SIGN_CLICKED,
            BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_PLUS_SIGN_CLICKED
          )}>
          <IconPlusAttachment style={styles.icSendButton} fillIcon={plusButtonStyle()} />
        </PressEventTrackingWrapper>
      )}

      <BottomSheetAttachment
        ref={refAttachment}
        onOpenMedia={onOpenMedia}
        onOpenGIF={onOpenGIF}
        onOpenCamera={onOpenCamera}
        onOpenFile={onOpenFile}
        onClose={onCloseAttachmentSheet}
        isLoadingUploadMedia={isLoadingUploadImageMedia}
        isLoadingUploadGIF={isLoadingUploadImageGIF}
        isLoadingUploadCamera={isLoadingUploadImageCamera}
        isLoadingUploadFile={isLoadingUploadImageFile}
      />

      <BottomSheetGif ref={refGif} onCancel={onCloseGIF} onSelect={handleSelectGIF} />
    </View>
  );
};

export default React.memo(InputMessageV2);
