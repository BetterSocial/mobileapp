import * as React from 'react';
import {
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import {useNavigation, useRoute} from '@react-navigation/core';
import FastImage from 'react-native-fast-image';

import BottomSheetChooseImage from '../InputUsername/elements/BottomSheetChooseImage';
import dimen from '../../utils/dimen';
import {Button} from '../../components/Button';
import {COLORS} from '../../utils/theme';
import {Header} from '../../components';
import {ProgressBar} from '../../components/ProgressBar';
import TopicDomainHeader from '../TopicPageScreen/elements/TopicDomainHeader';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {putCommunityImage} from '../../service/topics';
import IconPencil from '../../assets/icons/Ic_pencil';
import CommunityIcon from '../../assets/hashtag.png';
import PreviewIphone from '../../assets/preview_iphone.png';
import IconExclamationMark from '../../assets/icons/Ic_exclamation_mark';
import MemoIcArrowBackCircle from '../../assets/arrow/Ic_arrow_back_circle';
import ShareIconCircle from '../../assets/icons/Ic_share_circle';
import {requestCameraPermission, requestExternalStoragePermission} from '../../utils/permission';
import ImageUtils from '../../utils/image';

const CreateCommunityCustomize = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {isCreateCommunity, topicCommunityId, topicCommunityName} = route?.params || {};
  const [iconUrl, setIconUrl] = React.useState('');
  const [coverUrl, setCoverUrl] = React.useState('');
  const [iconUrlUploaded, setIconUrlUploaded] = React.useState('');
  const [coverUrlUploaded, setCoverUrlUploaded] = React.useState('');
  const [changeType, setChangeType] = React.useState(null);
  const [isSubmitNext, setIsSubmitNext] = React.useState(false);
  const bottomSheetChooseImageRef = React.useRef();

  const onPhoto = (type) => {
    setChangeType(type);
    bottomSheetChooseImageRef.current.open();
  };

  const uploadImage = async (image) => {
    const res = await ImageUtils.uploadImage(image);

    switch (changeType) {
      case 'icon':
        setIconUrlUploaded(res.data.url);
        break;
      case 'cover':
      default:
        setCoverUrlUploaded(res.data.url);
        break;
    }
  };

  const handleOpenCamera = async () => {
    const {success, message} = await requestCameraPermission();
    if (success) {
      ImagePicker.openCamera({
        mediaType: 'photo'
      }).then(async (imageRes) => {
        const imageCropped = await ImagePicker.openCropper({
          mediaType: 'photo',
          path: imageRes.path,
          width: imageRes.width,
          height: imageRes.height,
          cropperChooseText: 'Next',
          freeStyleCropEnabled: true
        });
        if (imageCropped.path) {
          switch (changeType) {
            case 'icon':
              setIconUrl(imageCropped.path);
              break;
            case 'cover':
            default:
              setCoverUrl(imageCropped.path);
              break;
          }
        }
        bottomSheetChooseImageRef.current.close();
        uploadImage(imageCropped.path);
      });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const handleOpenGallery = async () => {
    const {success, message} = await requestExternalStoragePermission();
    if (success) {
      ImagePicker.openPicker({
        mediaType: 'photo',
        sortOrder: 'asc',
        smartAlbums: ['RecentlyAdded', 'UserLibrary']
      }).then(async (imageRes) => {
        const imageCropped = await ImagePicker.openCropper({
          mediaType: 'photo',
          path: imageRes.path,
          width: imageRes.width,
          height: imageRes.height,
          cropperChooseText: 'Next',
          freeStyleCropEnabled: true
        });
        if (imageCropped.path) {
          switch (changeType) {
            case 'icon':
              setIconUrl(imageCropped.path);
              break;
            case 'cover':
            default:
              setCoverUrl(imageCropped.path);
              break;
          }
        }
        bottomSheetChooseImageRef.current.close();
        uploadImage(imageCropped.path);
      });
    } else {
      Toast.show(message, Toast.SHORT);
    }
  };

  const next = async () => {
    const response = await putCommunityImage(topicCommunityName, iconUrlUploaded, coverUrlUploaded);
    if (response.success) {
      navigation.replace('ContactScreen', {
        isCreateCommunity,
        topicCommunityId,
        topicCommunityName
      });
    }
    setIsSubmitNext(false);
  };

  React.useEffect(() => {
    if (
      isSubmitNext &&
      ((iconUrlUploaded !== '' && iconUrlUploaded.includes('https') && coverUrlUploaded === '') ||
        (iconUrlUploaded !== '' &&
          iconUrlUploaded.includes('https') &&
          coverUrlUploaded !== '' &&
          coverUrlUploaded.includes('https')))
    ) {
      next();
    }
  }, [isSubmitNext, iconUrlUploaded, coverUrlUploaded]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <Header
        title="Customize Community"
        onPress={() => navigation.goBack()}
        titleStyle={{
          alignSelf: 'center'
        }}
        containerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: COLORS.gray210
        }}
      />
      <View style={styles.keyboardavoidingview}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.content}>
            <ProgressBar isStatic={true} value={50} />
            <Text style={styles.desc}>Use images that represent your community.</Text>
            <View style={styles.previewContainer}>
              {coverUrl !== '' ? (
                <FastImage
                  source={{uri: coverUrl}}
                  resizeMode={FastImage.resizeMode.cover}
                  style={styles.coverPreview}
                />
              ) : (
                <View style={[styles.coverPreview, {backgroundColor: COLORS.signed_secondary}]} />
              )}
              <View style={styles.previewContentImage}>
                <FastImage source={PreviewIphone} style={styles.previewContentImageAsset} />
                <View style={styles.previewContentRow}>
                  <MemoIcArrowBackCircle
                    width={dimen.normalizeDimen(32)}
                    height={dimen.normalizeDimen(32)}
                  />
                  <ShareIconCircle color="black" width={32} height={32} />
                </View>
                <View
                  style={{
                    marginTop: dimen.normalizeDimen(13),
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                  {iconUrl !== '' ? (
                    <FastImage
                      source={{uri: iconUrl}}
                      resizeMode={FastImage.resizeMode.cover}
                      style={{
                        width: dimen.normalizeDimen(36),
                        height: dimen.normalizeDimen(36),
                        borderRadius: 100,
                        marginRight: dimen.normalizeDimen(6)
                      }}
                    />
                  ) : (
                    <View
                      style={[
                        styles.infoItemIcon,
                        {
                          width: dimen.normalizeDimen(36),
                          height: dimen.normalizeDimen(36),
                          marginRight: dimen.normalizeDimen(6)
                        }
                      ]}>
                      <FastImage
                        source={CommunityIcon}
                        resizeMode={FastImage.resizeMode.contain}
                        style={[
                          styles.imageDefaultCommunity,
                          {
                            width: dimen.normalizeDimen(14),
                            height: dimen.normalizeDimen(14)
                          }
                        ]}
                      />
                    </View>
                  )}
                  <TopicDomainHeader
                    domain={topicCommunityName}
                    memberCount={1212}
                    isFollow={true}
                    isPreview
                  />
                </View>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <View>
                  {iconUrl !== '' ? (
                    <FastImage
                      source={{uri: iconUrl}}
                      resizeMode={FastImage.resizeMode.cover}
                      style={styles.iconCommunity}
                    />
                  ) : (
                    <View style={styles.infoItemIcon}>
                      <FastImage
                        source={CommunityIcon}
                        resizeMode={FastImage.resizeMode.contain}
                        style={styles.imageDefaultCommunity}
                      />
                    </View>
                  )}
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.infoTitle}>Community Icon</Text>
                  <Text style={styles.infoDesc}>
                    The icon is important as it will determine first impressions
                  </Text>
                  <TouchableOpacity style={styles.infoAction} onPress={() => onPhoto('icon')}>
                    <IconPencil width={14} height={14} color={COLORS.signed_primary} />
                    <Text style={styles.infoActionText}>Change Icon</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.infoItem}>
                <View>
                  {coverUrl !== '' ? (
                    <FastImage
                      source={{uri: coverUrl}}
                      resizeMode={FastImage.resizeMode.cover}
                      style={styles.iconCommunity}
                    />
                  ) : (
                    <View style={[styles.infoItemIcon, {backgroundColor: COLORS.signed_secondary}]}>
                      <IconExclamationMark
                        width={dimen.normalizeDimen(46)}
                        height={dimen.normalizeDimen(46)}
                      />
                    </View>
                  )}
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.infoTitle}>Community Cover</Text>
                  <Text style={styles.infoDesc}>
                    This banner greets those that enter your community.
                  </Text>
                  <TouchableOpacity style={styles.infoAction} onPress={() => onPhoto('cover')}>
                    <IconPencil width={14} height={14} color={COLORS.signed_primary} />
                    <Text style={styles.infoActionText}>Change Cover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.gap} />
      </View>
      <View style={styles.footer}>
        <View style={styles.textSmallContainer}>
          <Text style={styles.textSmall}>
            You{"'"}ll appear as the first member of this community. You can switch your membership
            to incognito at any time from the community page.
          </Text>
        </View>
        <Button disabled={iconUrl === '' || isSubmitNext} onPress={() => setIsSubmitNext(true)}>
          {isSubmitNext ? <ActivityIndicator /> : <Text>Next</Text>}
        </Button>
      </View>
      <BottomSheetChooseImage
        ref={bottomSheetChooseImageRef}
        onOpenCamera={handleOpenCamera}
        onOpenImageGalery={handleOpenGallery}
      />
    </SafeAreaView>
  );
};

export default CreateCommunityCustomize;

const styles = StyleSheet.create({
  containerInput: {
    flexDirection: 'row',
    marginTop: dimen.normalizeDimen(18),
    marginBottom: dimen.normalizeDimen(20)
  },
  input: {
    borderWidth: dimen.normalizeDimen(1),
    borderRadius: dimen.normalizeDimen(8),
    borderColor: COLORS.gray210,
    backgroundColor: COLORS.gray110,
    color: COLORS.white,
    paddingHorizontal: dimen.normalizeDimen(23),
    paddingVertical: dimen.normalizeDimen(13),
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  btnNext: {marginTop: dimen.normalizeDimen(16)},
  gap: {flex: 1},
  icon: {
    width: dimen.normalizeDimen(14),
    height: dimen.normalizeDimen(14),
    position: 'absolute',
    bottom: dimen.normalizeDimen(-5),
    left: dimen.normalizeDimen(19)
  },
  image: {
    height: dimen.normalizeDimen(52),
    width: dimen.normalizeDimen(52),
    borderRadius: dimen.normalizeDimen(26)
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    color: COLORS.gray510,
    marginTop: dimen.normalizeDimen(40),
    textAlign: 'center'
  },
  content: {
    paddingTop: dimen.normalizeDimen(20),
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  keyboardavoidingview: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  textMessage: (color) => ({
    fontSize: normalizeFontSize(12),
    color,
    fontFamily: fonts.inter[400],
    marginTop: dimen.normalizeDimen(6)
  }),
  parentIcon: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  parentInfo: {
    width: '90%'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: dimen.normalizeDimen(112),
    width: '100%',
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(20),
    backgroundColor: COLORS.almostBlack,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textSmallContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textSmall: {
    fontSize: normalizeFontSize(10),
    fontFamily: fonts.inter[400],
    textAlign: 'center',
    color: COLORS.gray510
  },
  coverPreview: {
    width: '100%',
    height: dimen.normalizeDimen(90),
    position: 'absolute',
    borderTopRightRadius: 80,
    borderTopLeftRadius: 80
  },
  previewContainer: {
    position: 'relative',
    alignSelf: 'center',
    width: dimen.normalizeDimen(300),
    height: dimen.normalizeDimen(190),
    marginTop: dimen.normalizeDimen(30)
  },
  previewContentImage: {
    paddingHorizontal: dimen.normalizeDimen(25),
    paddingVertical: dimen.normalizeDimen(52)
  },
  previewContentImageAsset: {
    width: dimen.normalizeDimen(300),
    height: dimen.normalizeDimen(190),
    position: 'absolute'
  },
  previewContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconCommunity: {
    width: dimen.normalizeDimen(60),
    height: dimen.normalizeDimen(60),
    borderRadius: 100,
    marginRight: dimen.normalizeDimen(20)
  },
  infoContainer: {
    paddingTop: dimen.normalizeDimen(20),
    marginTop: -dimen.normalizeDimen(30),
    backgroundColor: COLORS.almostBlack,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray210
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: dimen.normalizeDimen(30)
  },
  infoItemIcon: {
    width: dimen.normalizeDimen(60),
    height: dimen.normalizeDimen(60),
    borderRadius: 100,
    backgroundColor: COLORS.signed_primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimen.normalizeDimen(20)
  },
  imageDefaultCommunity: {
    width: dimen.normalizeDimen(22),
    height: dimen.normalizeDimen(22)
  },
  infoTitle: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(16),
    lineHeight: normalizeFontSize(24),
    color: COLORS.white,
    marginBottom: dimen.normalizeDimen(4)
  },
  infoDesc: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(17),
    color: COLORS.gray510,
    marginBottom: dimen.normalizeDimen(8)
  },
  infoAction: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoActionText: {
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(17),
    color: COLORS.signed_primary,
    marginLeft: dimen.normalizeDimen(6)
  }
});
