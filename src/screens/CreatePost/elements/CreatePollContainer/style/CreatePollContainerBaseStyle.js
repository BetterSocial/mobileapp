import {StyleSheet} from 'react-native';

import {COLORS} from '../../../../../utils/theme';

const CreatePollContainerBaseStyle = StyleSheet.create({
  createpollcontainer: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.lightgrey,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 16,
    padding: 16
  },

  removepollcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 16
  },

  addpollitemcontainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2,
    paddingVertical: 12
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
    marginVertical: 8,
    backgroundColor: COLORS.lightgrey
  },

  row: {
    flexDirection: 'row',
    display: 'flex',
    paddingVertical: 8
  },

  fillparenttext: {
    flex: 1,
    alignSelf: 'center'
  },

  rightarrow: {
    alignSelf: 'center'
  },

  polldurationbutton: {
    backgroundColor: COLORS.white,
    color: COLORS.white,
    paddingVertical: 4,
    borderRadius: 4
  },

  polldurationbuttontext: {
    color: COLORS.white,
    backgroundColor: COLORS.anon_primary,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 6,
    marginEnd: 24
  },

  switchtext: {
    alignSelf: 'center',
    marginRight: 16
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
    paddingVertical: 24,
    borderRadius: 4,
    paddingHorizontal: 12
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
    fontFamily: 'Inter-SemiBold',
    marginBottom: 22
  },

  pickerlabeltext: {
    marginBottom: 32
  },

  bottombuttonrowcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  buttoncontainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },

  bottombuttontext: {
    fontFamily: 'Inter-SemiBold'
  }
});

export default CreatePollContainerBaseStyle;
