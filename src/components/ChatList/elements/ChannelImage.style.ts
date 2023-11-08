import {StyleSheet} from 'react-native';

import dimen from '../../../utils/dimen';
import {colors} from '../../../utils/colors';

export const channelImageStyles = StyleSheet.create({
  containerImage: {
    position: 'relative',
    width: dimen.normalizeDimen(45),
    height: dimen.normalizeDimen(45),
    marginTop: dimen.normalizeDimen(12),
    marginBottom: dimen.normalizeDimen(12),
    borderRadius: dimen.normalizeDimen(23)
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
    backgroundColor: colors.gray1
  },
  containerGreen: {
    backgroundColor: colors.bondi_blue
  },
  containerDarkBlue: {
    backgroundColor: colors.darkBlue
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
