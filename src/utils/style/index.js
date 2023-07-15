import {StyleSheet} from 'react-native';
import {COLORS} from '../theme';
import {fonts} from '../fonts';

const UtilStyle = StyleSheet.create({
  mention: {
    color: COLORS.blue,
    fontFamily: fonts.inter[500],
    fontWeight: '500'
  }
});

export default UtilStyle;
