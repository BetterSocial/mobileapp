import {StyleSheet} from 'react-native';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

export const STEP_NUMBER_RADIUS = 14;
export const STEP_NUMBER_DIAMETER = STEP_NUMBER_RADIUS * 2;
export const ZINDEX = 100;
export const MARGIN = 13;
export const OFFSET_WIDTH = 4;

export const TooltipStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: ZINDEX
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    overflow: 'hidden'
  },
  tooltipTitle: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 19.36,
    color: COLORS.black000,
    marginBottom: 8
  },
  tooltipText: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.blackgrey,
    marginBottom: 8
  },
  tooltipContainer: {
    flex: 1
  },
  buttonText: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 16.94,
    marginLeft: 16,
    color: COLORS.blueOnboarding
  },
  bottomBar: {
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
