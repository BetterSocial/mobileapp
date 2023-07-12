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
    minHeight: 88,
    display: 'flex',
    flex: 1,
    fontSize: 12
  },
  image: {
    width: 24,
    height: 24,
    marginTop: 1,
    borderRadius: 18,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emojyStyle: {
    fontSize: 12
  },
  sendIconContainer: {
    borderRadius: 18,
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 1.5,
    alignSelf: 'flex-end'
  }
});
