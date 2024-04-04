import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../../utils/theme';
import useReadmore from './hooks/useReadmore';
import {fonts, normalizeFontSize} from '../../utils/fonts';

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    color: COLORS.grey410
  },
  moreText: {
    color: COLORS.bondi_blue
  }
});

const ReadMore = ({text, onPress}) => {
  const {
    isFinishSetLayout,
    realNumberLine,
    textShown,
    layoutWidth,
    setIsFinishSetLayout,
    handleLayoutText,
    handleLayoutWidth,
    limitNumberLine
  } = useReadmore({
    numberLine: 1
  });

  React.useEffect(() => {
    setIsFinishSetLayout(false);
  }, [layoutWidth, text]);

  return (
    <View style={{marginLeft: 8, marginTop: 2}} onLayout={handleLayoutWidth}>
      {isFinishSetLayout ? (
        <TouchableOpacity testID="finishLayout" onPress={onPress}>
          <Text style={styles.text}>
            {textShown}
            {limitNumberLine < realNumberLine ? (
              <Text testID="moreText" style={styles.moreText}>
                More...
              </Text>
            ) : null}
          </Text>
        </TouchableOpacity>
      ) : null}
      {!isFinishSetLayout ? (
        <TouchableOpacity testID="finishLayout" onPress={onPress}>
          <Text style={styles.text} testID="notFinishLayout" onTextLayout={handleLayoutText}>
            {text}{' '}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ReadMore;
