// https://chir.ag/projects/name-that-color/
export const colors = {
  bondi_blue: '#00ADB5',
  white: '#ffffff',
  black: '#0C0C0C',
  emperor: '#4F4F4F',
  gray: '#69707C',
  gray1: '#9B9FA9',
  lightgrey: '#FFFFFF',
  concrete: '#F2F2F2',
  mine_shaft: '#333333',
  bunting: '#11243D',
  alto: '#E8EBED',
  porcelain: '#ecf0f1',
  silver: '#BDBDBD',
  french_pass: '#b6e4fd',
  pattens_blue: '#ddf2fe',
  blue: '#2F80ED',
  lightblue: '#55C2FF',
  blue1: '#4782D7',
  red: '#FF2E63',
  holytosca: '#003848',
  holytosca30percent: '#0038484D',
  blackgrey: '#69707C',
  redalert: '#FF2E63',
  halfBaked: '#88CDD0',
  tradewind: '#58B1B5',
  elm: '#22878B',
  blockColor: '#FF2E63',
  darkBlue: '#4782D7',
  blueSea10: '#55C2FF',
  greenDark: '#004346',
  babyBlue: '#7B9DCD',

  signed_primary: '#4782D7',
  signed_secondary: '#6295DD',
  anon_primary: '#003848',
  anon_secondary: '#154B5B',
  radical_red: '#FF3466',
  light_silver: '#D2D4DB'
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
