import dimen from '../dimen';

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

export const normalizeFontSize = (size, factor = 0.5) =>
  size + (dimen.normalizeDimen(size) - size) * factor;

export const normalize = (size) => {
  return normalizeFontSize(size);
};

export const normalizeFontSizeByWidth = (fontSize) => {
  return normalizeFontSize(fontSize);
};
