import {Dimensions, PixelRatio, Platform} from 'react-native';

export const fonts = {
  inter: {
    100: 'Inter-Thin',
    200: 'Inter-ExtraLight',
    300: 'Inter-Light',
    400: 'Inter-Regular',
    500: 'Inter-Medium',
    600: 'Inter-SemiBold',
    700: 'Inter-Bold',
    800: 'Inter-ExtraBold',
    900: 'Inter-Black'
  },
  poppins: {
    100: 'Poppins-Thin',
    200: 'Poppins-ExtraLight',
    300: 'Poppins-Light',
    400: 'Poppins-Regular',
    500: 'Poppins-Medium',
    600: 'Poppins-SemiBold',
    700: 'Poppins-Bold',
    800: 'Poppins-ExtraBold',
    900: 'Poppins-Black'
  }
};

export const normalize = (size) => {
  // let referenceWidth = 326;
  const referenceWidth = 375;
  const currentScreenWidth = Dimensions.get('screen').width;
  const normalizedSize = (currentScreenWidth / referenceWidth) * size;
  return normalizedSize;
};

export const normalizeFontSize = (fontSize) => {
  const referenceHeight = 771;
  const currentScreenHeight = Dimensions.get('screen').height;
  const normalizedFontSize = (currentScreenHeight / referenceHeight) * fontSize;
  return normalizedFontSize;
};

export const normalizeFontSizeByWidth = (fontSize) => {
  const referenceHeight = 375;
  const currentScreenHeight = Dimensions.get('screen').width;
  const normalizedFontSize = (currentScreenHeight / referenceHeight) * fontSize;
  return normalizedFontSize;
};

export const scaleFontSize = (fontSize) => {
  const {height} = Dimensions.get('window');
  const newScale = height / (812 - 78);
  const newSize = fontSize * newScale;
  if (Platform.OS === 'ios') return Math.round(PixelRatio.roundToNearestPixel(newSize));
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};
