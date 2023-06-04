import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';

export const S = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    padding: 10
  },
  placeholderAvatar: {
    borderRadius: 50,
    height: 30,
    width: 30,
    backgroundColor: colors.gray1,
    marginRight: 6
  },
  textArea: {
    marginTop: 2,
    minHeight: 88,
    display: 'flex',
    flex: 1
  },
  sendIconContainer: (value) => ({
    borderRadius: 18,
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 1.5,
    alignSelf: 'flex-end',
    backgroundColor: value ? colors.bondi_blue : colors.gray1
  })
});
