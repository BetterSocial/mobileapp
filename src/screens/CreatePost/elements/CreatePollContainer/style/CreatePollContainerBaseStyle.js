import {StyleSheet} from 'react-native';

import {COLORS} from '../../../../../utils/theme';
import dimen from '../../../../../utils/dimen';
import {fonts} from '../../../../../utils/fonts';

const CreatePollContainerBaseStyle = StyleSheet.create({
  createpollcontainer: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.gray110,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: dimen.normalizeDimen(16),
    padding: dimen.normalizeDimen(16)
  },

  removepollcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: dimen.normalizeDimen(16)
  },

  addpollitemcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: dimen.normalizeDimen(10),
    marginBottom: dimen.normalizeDimen(2),
    paddingVertical: dimen.normalizeDimen(12)
  },

  addpollitemplusicon: {
    color: COLORS.black,
    alignSelf: 'center'
  },

  removepolltext: {
    color: COLORS.redalert,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold'
  },

  divider: {
    flex: 1,
    width: '100%',
    height: 1,
    marginVertical: dimen.normalizeDimen(8),
    backgroundColor: COLORS.gray110
  },

  row: {
    flexDirection: 'row',
    display: 'flex',
    paddingVertical: dimen.normalizeDimen(8)
  },

  fillparenttext: {
    flex: 1,
    alignSelf: 'center',
    color: COLORS.white
  },

  rightarrow: {
    alignSelf: 'center'
  },

  polldurationbutton: {
    fontFamily: fonts.inter[400],
    backgroundColor: COLORS.almostBlack,
    color: COLORS.almostBlack,
    paddingVertical: dimen.normalizeDimen(4),
    borderRadius: dimen.normalizeDimen(4)
  },

  polldurationbuttontext: {
    fontFamily: fonts.inter[400],
    color: COLORS.almostBlack,
    backgroundColor: COLORS.anon_primary,
    paddingHorizontal: dimen.normalizeDimen(22),
    paddingVertical: dimen.normalizeDimen(8),
    borderRadius: 6,
    marginEnd: dimen.normalizeDimen(24)
  },

  switchtext: {
    fontFamily: fonts.inter[400],
    alignSelf: 'center',
    marginRight: dimen.normalizeDimen(16),
    color: COLORS.white
  },

  modalcontainer: {
    flexDirection: 'column',
    display: 'flex',
    flex: 1
  },

  parentcolumncontainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingVertical: dimen.normalizeDimen(24),
    borderRadius: 4,
    paddingHorizontal: dimen.normalizeDimen(12)
  },

  modalrowcontainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    display: 'flex',
    width: '100%'
  },

  pickercontainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    flex: 1
  },

  setdurationtext: {
    fontFamily: fonts.inter[600],
    marginBottom: dimen.normalizeDimen(22)
  },

  pickerlabeltext: {
    fontFamily: fonts.inter[400],
    marginBottom: dimen.normalizeDimen(32)
  },

  bottombuttonrowcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  buttoncontainer: {
    paddingHorizontal: dimen.normalizeDimen(16),
    paddingVertical: dimen.normalizeDimen(8)
  },

  bottombuttontext: {
    fontFamily: fonts.inter[600]
  }
});

export default CreatePollContainerBaseStyle;
