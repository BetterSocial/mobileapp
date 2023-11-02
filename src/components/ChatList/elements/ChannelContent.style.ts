import {StyleSheet} from 'react-native';

import {colors} from '../../../utils/colors';
import {fonts, normalize} from '../../../utils/fonts';

export const channelContentStyles = StyleSheet.create({
  title: {
    fontFamily: fonts.inter[700],
    fontSize: normalize(14),
    lineHeight: 22,
    flex: 1,
    paddingBottom: 2
  },
  description: {
    fontFamily: fonts.inter[400],
    fontSize: normalize(14),
    lineHeight: 22,
    alignSelf: 'center',
    flex: 1,
    marginRight: 4
  },
  time: {
    fontFamily: fonts.poppins[400],
    fontSize: normalize(14),
    lineHeight: 22,
    marginLeft: 20,
    color: colors.gray,
    alignSelf: 'flex-start'
  },
  containerBadge: {
    backgroundColor: colors.darkBlue,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    fontFamily: fonts.inter[400],
    fontSize: normalize(10),
    lineHeight: 14.52,
    color: colors.white
  }
});
