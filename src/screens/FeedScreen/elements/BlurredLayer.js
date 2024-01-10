import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import ToastMessage from 'react-native-toast-message';

import {fonts, normalizeFontSizeByWidth} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import IconSecurityLock from '../../../assets/icon/IconSecurityLock';
import BlurredLayerToast from './BlurredLayerToast';

const BlurredLayerContent = ({onPressContent}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPressContent}>
      <IconSecurityLock />
      <Text style={styles.infoText}>
        To protect the privacy of your connections, you need to follow at least 7 users to see
        anonymous posts.
      </Text>
      <Text style={styles.buttonText}>See suggested users</Text>
    </TouchableOpacity>
  );
};

const BlurredLayer = ({
  isVisible,
  layerOnly,
  blurType = 'dark',
  toastOnly,
  withToast,
  onPressContent,
  children
}) => {
  return toastOnly ? (
    isVisible ? (
      <BlurredLayerToast>{children}</BlurredLayerToast>
    ) : (
      <>{children}</>
    )
  ) : (
    <>
      {withToast && <BlurredLayerToast>{children}</BlurredLayerToast>}
      {isVisible && (
        <TouchableOpacity
          style={styles.containerBlur}
          activeOpacity={1}
          onPress={() =>
            ToastMessage.show({
              type: 'asNative',
              text1: 'Follow more users to enable interactions with anonymous posts',
              position: 'bottom'
            })
          }>
          <BlurView style={styles.containerBlur} blurType={blurType} blurAmount={4}>
            {!layerOnly && <BlurredLayerContent onPressContent={onPressContent} />}
          </BlurView>
        </TouchableOpacity>
      )}
    </>
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
