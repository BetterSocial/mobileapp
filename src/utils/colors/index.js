// https://chir.ag/projects/name-that-color/
export const colors = {
  bondi_blue: '#00ADB5',
  white: '#ffffff',
  black: '#000000',
  emperor: '#4F4F4F',
  gray: '#828282',
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
  blue: '#2C67BC',
  lightblue: '#55C2FF',
  blue1: '#2C67BC',
  red: '#FF2E63',
  holytosca: '#00ADB5',
  holytosca30percent: '#00ADB54D',
  blackgrey: '#828282',
  halfBaked: '#88CDD0',
  tradewind: '#58B1B5',
  elm: '#22878B',
  blockColor: '#FF2E63',
  darkBlue: '#2C67BC',
  blueSea10: '#55C2FF',
  greenDark: '#004346'
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
