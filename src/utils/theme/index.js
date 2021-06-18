import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  black: '#1E1F20',
  white: '#FFFFFF',
  gray: '#6A6A6A',
  holyTosca: '#00ADB5',
  red: '#FF2E63',
  lightBlue: '#2F80ED',
  blueSea: '#55C2FF',
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  h1: 36,
  h2: 16,
  h3: 14,
  h4: 12,
  body1: 24,
  body2: 16,
  body3: 14,
  body4: 12,

  // app dimensions
  width,
  height,
};
export const FONTS = {
  h1: {fontFamily: 'Inter-Black', fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontFamily: 'Inter-Bold', fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontFamily: 'Inter-Bold', fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontFamily: 'Inter-Bold', fontSize: SIZES.h4, lineHeight: 22},
  body1: {fontFamily: 'Inter-Regular', fontSize: SIZES.body1, lineHeight: 36},
  body2: {fontFamily: 'Inter-Regular', fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontFamily: 'Inter-Regular', fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontFamily: 'Inter-Regular', fontSize: SIZES.body4, lineHeight: 22},
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
