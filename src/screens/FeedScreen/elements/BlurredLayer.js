import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BlurView} from '@react-native-community/blur';

import {fonts, normalizeFontSizeByWidth} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import IconSecurityLock from '../../../assets/icon/IconSecurityLock';
import BlurredLayerToast from './BlurredLayerToast';

const BlurredLayerContent = ({onPressContent}) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onPressContent}>
      <IconSecurityLock />
      <Text style={styles.infoText}>
        To protect the privacy of your connections, you need to follow at least 7 users to see
        anonymous posts.
      </Text>
      <Text style={styles.buttonText}>See suggested users</Text>
    </TouchableOpacity>
  );
};

const BlurredLayer = ({layerOnly, blurType = 'dark', toastOnly, withToast, onPressContent}) => {
  return toastOnly ? (
    <BlurredLayerToast />
  ) : (
    <BlurView style={styles.containerBlur} blurType={blurType}>
      {withToast && <BlurredLayerToast />}
      {!layerOnly && <BlurredLayerContent onPressContent={onPressContent} />}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  containerBlur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoText: {
    fontFamily: fonts.inter[400],
    fontWeight: 'normal',
    fontSize: normalizeFontSizeByWidth(12),
    lineHeight: 18,
    color: COLORS.white,
    textAlign: 'center',
    maxWidth: 242,
    marginVertical: 20
  },
  buttonText: {
    fontFamily: fonts.inter[400],
    fontWeight: 'normal',
    fontSize: normalizeFontSizeByWidth(12),
    lineHeight: 18,
    color: COLORS.white,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  }
});
export default React.memo(BlurredLayer);
