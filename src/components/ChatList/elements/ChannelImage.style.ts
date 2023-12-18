import {StyleSheet} from 'react-native';

import dimen from '../../../utils/dimen';
import {COLORS} from '../../../utils/theme';

export const channelImageStyles = StyleSheet.create({
  containerImage: {
    position: 'relative',
    width: dimen.normalizeDimen(48),
    height: dimen.normalizeDimen(48),
    marginTop: dimen.normalizeDimen(12),
    marginBottom: dimen.normalizeDimen(12),
    borderRadius: dimen.normalizeDimen(24)
  },
  containerImageGroupINfo: {
    position: 'relative',
    width: dimen.normalizeDimen(100),
    height: dimen.normalizeDimen(100),
    borderRadius: dimen.normalizeDimen(50)
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
  imageDefaultGroupInfo: {
    width: dimen.normalizeDimen(50),
    height: dimen.normalizeDimen(50)
  },
  containerGrey: {
    backgroundColor: COLORS.gray9
  },
  containerGreen: {
    backgroundColor: COLORS.holyTosca
  },
  containerDarkBlue: {
    backgroundColor: COLORS.blue
  },
  containerBigDarkBlue: {
    backgroundColor: COLORS.blueSecondary
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
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeIcon: {
    width: dimen.normalizeDimen(12),
    height: dimen.normalizeDimen(12)
  }
});
