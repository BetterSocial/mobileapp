import {StyleSheet} from 'react-native';

import dimen from '../../../utils/dimen';
import {colors} from '../../../utils/colors';

export const channelImageStyles = StyleSheet.create({
  containerImage: {
    position: 'relative',
    width: dimen.normalizeDimen(48),
    height: dimen.normalizeDimen(48),
    marginTop: dimen.normalizeDimen(12),
    marginBottom: dimen.normalizeDimen(12),
    borderRadius: dimen.normalizeDimen(24)
  },
  containerDefaultImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageDefaultCommunity: {
    width: dimen.normalizeDimen(20),
    height: dimen.normalizeDimen(20)
  },
  imageDefaultGroup: {
    width: dimen.normalizeDimen(24),
    height: dimen.normalizeDimen(24)
  },
  containerGrey: {
    backgroundColor: colors.gray1
  },
  containerGreen: {
    backgroundColor: colors.bondi_blue
  },
  containerBlue: {
    backgroundColor: colors.lightblue
  },
  badgeContainer: {
    position: 'absolute',
    display: 'flex',
    top: dimen.normalizeDimen(30 + 12),
    right: 0,
    width: dimen.normalizeDimen(24),
    height: dimen.normalizeDimen(24),
    borderRadius: dimen.normalizeDimen(12),
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeIcon: {
    width: dimen.normalizeDimen(12),
    height: dimen.normalizeDimen(12)
  }
});
