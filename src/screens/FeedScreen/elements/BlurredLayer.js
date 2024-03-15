import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
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
BlurredLayerContent.propTypes = {
  onPressContent: PropTypes.func
};

const ToastOnlyComponent = ({isVisible, children}) => {
  return isVisible ? <BlurredLayerToast>{children}</BlurredLayerToast> : <>{children}</>;
};
ToastOnlyComponent.propTypes = {
  isVisible: PropTypes.bool,
  children: PropTypes.any
};

const BlurredLayer = ({
  isVisible,
  layerOnly,
  blurType = 'dark',
  toastOnly,
  withToast,
  onPressContent,
  children,
  containerStyle
}) => {
  return (
    <View style={[styles.relative, containerStyle]} testID="blurredLayer" isVisible={isVisible}>
      {toastOnly ? (
        <ToastOnlyComponent isVisible={isVisible}>{children}</ToastOnlyComponent>
      ) : (
        <>
          {withToast && <ToastOnlyComponent isVisible={isVisible}>{children}</ToastOnlyComponent>}
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  relative: {
    position: 'relative',
    width: '100%'
  },
  containerBlur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
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
BlurredLayer.propTypes = {
  isVisible: PropTypes.bool,
  layerOnly: PropTypes.bool,
  blurType: PropTypes.string,
  toastOnly: PropTypes.bool,
  withToast: PropTypes.bool,
  onPressContent: PropTypes.func,
  children: PropTypes.any
};
export default React.memo(BlurredLayer);
