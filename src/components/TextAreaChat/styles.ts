import {StyleSheet} from 'react-native';
import {COLORS} from '../../utils/theme';

export const S = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 6
  },
  placeholderAvatar: {
    borderRadius: 50,
    height: 30,
    width: 30,
    backgroundColor: COLORS.gray1,
    marginRight: 6
  },
  textArea: {
    display: 'flex',
    flex: 1,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    textAlignVertical: 'top'
  },
  image: {
    width: 24,
    height: 24,
    marginTop: 5,
    borderRadius: 50,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emojiStyle: {
    fontSize: 12
  },
  sendIconContainer: {
    borderRadius: 50,
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 1.5,
    alignSelf: 'flex-end'
  }
});
