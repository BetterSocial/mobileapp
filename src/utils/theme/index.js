import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  black: '#1E1F20',
  black000: '#000',
  white: '#FFFFFF',
  gray: '#6A6A6A',
  greyseries: '#333333',
  gray6: '#F2F2F2',
  holyTosca: '#00ADB5',
  red: '#FF2E63',
  lightBlue: '#2F80ED',
  blueSea: '#55C2FF',
  bondi_blue: '#00ADB5',
  emperor: '#4F4F4F',
  gray1: '#C4C4C4',
  lightgrey: '#F5F5F5',
  concrete: '#F2F2F2',
  mine_shaft: '#333333',
  bunting: '#11243D',
  alto: '#E0E0E0',
  porcelain: '#ecf0f1',
  silver: '#BDBDBD',
  french_pass: '#b6e4fd',
  pattens_blue: '#ddf2fe',
  blue: '#2F80ED',
  holytosca: '#00ADB5',
  holytosca30percent: '#00ADB54D',
  blackgrey: '#828282',
  redalert: '#FF2E63',
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
  comment: {fontFamily: 'Inter-Regular', fontSize: SIZES.body3, lineHeight: 19},
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
