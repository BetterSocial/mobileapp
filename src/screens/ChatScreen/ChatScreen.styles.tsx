import {Dimensions, StyleProp, StyleSheet, ViewStyle} from 'react-native';

import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';

const {height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: height - 85
  },
  chatContainer: {
    display: 'flex',
    height: '100%'
  },
  inputContainer: {
    backgroundColor: COLORS.almostBlack,
    position: 'absolute',
    bottom: 0,
    // height: 50,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 8,
    paddingBottom: 16,
    borderTopColor: COLORS.gray110,
    borderTopWidth: 1
  },
  contentContainerStyle: {
    paddingTop: dimen.normalizeDimen(60),
    paddingBottom: dimen.normalizeDimen(4),
    backgroundColor: COLORS.almostBlack
  }
});

export const paramInputContainer = (
  bottomSafeAreaInsets = 0,
  isKeyboardOpen = false
): StyleProp<ViewStyle> => ({
  backgroundColor: COLORS.almostBlack,
  position: 'absolute',
  bottom: 0,
  minHeight: 66 + bottomSafeAreaInsets,
  left: 0,
  right: 0,
  zIndex: 100,
  padding: 8,
  paddingBottom: 16,
  borderTopColor: COLORS.gray110,
  borderTopWidth: 1,
  flexDirection: isKeyboardOpen ? 'column' : 'row',
  alignItems: isKeyboardOpen ? 'center' : 'flex-start'
});
