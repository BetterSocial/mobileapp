export const COLORS = {
  alto: '#E0E0E0',
  black: '#FFFFFF', // changed to white, before is #1E1F20
  black000: '#000',
  black30percent: 'rgba(0,0,0,0.3)',
  black80percent: 'rgba(0,0,0,0.8)',
  black43: '#434343',
  blue: '#2F80ED',
  blueLoyal: '#023B60',
  blueOnboarding: '#4782D7',
  blueTanzanite: '#11516F',
  blueSea: '#55C2FF',
  blueZaffre: '#0E24B3',
  blueLink: '#5CB9FF',
  brilliance: '#FCFCFC',
  bunting: '#11243D',
  french_pass: '#b6e4fd',
  greenMantis: '#79B45D',
  pattens_blue: '#ddf2fe',
  platinum: '#E6E6E6',
  porcelain: '#ecf0f1',
  silver: '#BDBDBD',
  waterspout: '#9DEDF1',
  white: '#FFFFFF',
  white10percent: 'rgba(255,255,255,0.1)',
  white20percent: 'rgba(255,255,255,0.2)',
  white30percent: 'rgba(255,255,255,0.3)',
  whiteSmoke: '#F4F4F4',
  bluePrimary: '#4782D7',

  anonPmGroupChannel: '#11333B',
  anonTopicChannel: '#184A57',
  anonPostNotificationChannel: '#17272B',

  signedPmGroupChannel: '#112A3D',
  signedTopicChannel: '#1D3E5E',
  signedPostNotificationChannel: '#16202A',

  // need to remove
  holytosca: '#00ADB5',
  lightBlue: '#2F80ED',
  gray1: '#C4C4C4',
  gray100: '#F5F6F7',
  gray110: '#1E3343',
  gray200: '#E8EBED',
  gray210: '#3A4F64',
  gray300: '#D2D4DB',
  gray310: '#52667A',
  gray400: '#9B9FA9',
  gray410: '#8C939F',
  gray500: '#69707C',
  gray510: '#A5ACB8',
  almostBlack: '#16202A',
  darkGray: '#394756',
  darkGray2: '#394756',
  gray6: '#F2F2F2',
  gray4: '#4A4A4A',
  bondi_blue: '#00ADB5',

  // new color
  signed_primary: '#0391FB',
  signed_primary_15: '#0391FB26',
  signed_secondary: '#275D8A',
  default_signed_secondary: '#0391FB',
  anon_primary: '#00ABB2',
  anon_primary_15: '#00ABB226',
  anon_secondary: '#184A57',
  radical_red: '#FF3466',
  light_silver: '#D2D4DB',
  balance_gray: '#9B9FA9',
  gray: '#E8EBED',
  redalert: '#FF2E63',
  elm: '#22878B',
  halfBaked: '#88CDD0',
  greenDark: '#004346',
  holytosca30percent: '#00ADB54D',
  black50: 'rgba(0, 0, 0, 0.5)',
  black75: 'rgba(0, 0, 0, 0.75)',
  black80: 'rgba(0, 0, 0, 0.8)',
  transparent: 'transparent',
  anonSecondary20: 'rgba(0, 173, 181, 0.2)',
  lightgrey60: 'rgba(245, 246, 247, 0.6)',
  upvote: '#69DD10',
  downvote: '#E2887E'
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
  body4: 12

  // app dimensions
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
  comment: {fontFamily: 'Inter-Regular', fontSize: SIZES.body3, lineHeight: 19}
};

export const hexToRgb = (hex, opacity = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return result ? `rgba(${r},${g},${b},${opacity})` : null;
};

export const checkIsHasColor = (color) => {
  const regex = /^#[0-9a-f]{3,6}$/i;
  return regex.test(color);
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
