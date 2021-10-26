import {PixelRatio, Dimensions} from 'react-native';

export const fonts = {
  inter: {
    100: 'Inter-Thin',
    200: 'Inter-Extra-light',
    300: 'Inter-Light',
    400: 'Inter-Regular',
    500: 'Inter-Medium',
    600: 'Inter-SemiBold',
    700: 'Inter-Bold',
    800: 'Inter-Extra-bold',
    900: 'Inter-Black',
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
    900: 'Poppins-Black',
  },
};

export const normalize = (fontSize) => {
  let referenceWidth = 375;
  let currentScreenWidth = Dimensions.get('window').width;
  let normalizedSize = (currentScreenWidth / referenceWidth) * fontSize;
  console.log(normalizedSize);
  return normalizedSize;
};
