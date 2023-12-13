export const COLORS = {
  alto: '#E0E0E0',
  black: '#1E1F20',
  black000: '#000',
  black30percent: 'rgba(0,0,0,0.3)',
  black43: '#434343',
  blackgrey: '#828282',
  blue: '#4782D7',
  blueLoyal: '#023B60',
  blueOnboarding: '#4782D7',
  blueTanzanite: '#11516F',
  blueSea: '#55C2FF',
  blueZaffre: '#0E24B3',
  bondi_blue: '#00ADB5',
  brilliance: '#FCFCFC',
  bunting: '#11243D',
  concrete: '#F2F2F2',
  emperor: '#4F4F4F',
  french_pass: '#b6e4fd',
  gray: '#6A6A6A',
  gray1: '#C4C4C4',
  gray4: '#4A4A4A',
  gray5: '#4D4D4D',
  gray6: '#F2F2F2',
  gray7: '#7A7A7A',
  gray8: '#69707C',
  greenMantis: '#79B45D',
  greyseries: '#333333',
  holytosca: '#00ADB5',
  holyTosca: '#00ADB5',
  holytosca15percent: '#00ADB526',
  holytosca30percent: '#00ADB54D',
  lightBlue: '#4782D7',
  lightgrey: '#F5F5F5',
  mine_shaft: '#333333',
  pattens_blue: '#ddf2fe',
  platinum: '#E6E6E6',
  porcelain: '#ecf0f1',
  red: '#FF2E63',
  redalert: '#FF2E63',
  silver: '#BDBDBD',
  waterspout: '#9DEDF1',
  white: '#FFFFFF',
  whiteSmoke: '#F4F4F4',

  signed_primary: '#4782D7',
  signed_secondary: '#6295DD',
  anon_primary: '#003848',
  anon_secondary: '#154B5B',
  radical_red: '#FF3466',
  light_silver: '#D2D4DB'
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

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
