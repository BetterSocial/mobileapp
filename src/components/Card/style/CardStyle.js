import {StyleSheet} from 'react-native';
import {COLORS} from '../../../utils/theme';
import {fonts} from '../../../utils/fonts';

const CardStyle = StyleSheet.create({
  link: {
    color: COLORS.blue,
    textDecorationLine: 'underline',
    marginStart: 8,
    fontSize: 12
  },
  contentDomain: {flexDirection: 'row', alignItems: 'center'},
  containerDomain: {justifyContent: 'space-around'},
  date: {fontSize: 12, color: '#828282'},
  domain: {
    fontSize: 16,
    lineHeight: 16,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: fonts.inter[600]
  },
  width: (width) => ({
    width
  }),
  imageHeader: {height: '100%', width: '100%', borderRadius: 45},
  constainerHeader: {
    flexDirection: 'row',
    padding: 8
  },
  contentHeader: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 'rgba(0,0,0, 0.5)',
    overflow: 'hidden',
    paddingBottom: 8,
    flex: 1
  },
  image: {
    width: '100%',
    height: '100%'
  },
  content: {
    // paddingTop: 8,
    justifyContent: 'space-between',
    flex: 1
    // backgroundColor: 'blue',
  },
  title: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 8,
    fontFamily: fonts.inter[600],
    paddingRight: 20,
    paddingLeft: 20
  },
  description: {
    color: COLORS.blackgrey,
    fontSize: 12,
    fontFamily: fonts.inter[400],
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 5,
    lineHeight: 18
  },
  openLinkText: {
    color: COLORS.blue,
    textDecorationLine: 'underline',
    marginStart: 8,
    fontSize: 12
  }
});

export default CardStyle;
